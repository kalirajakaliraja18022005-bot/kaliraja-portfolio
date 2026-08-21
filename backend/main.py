import os
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from passlib.context import CryptContext

from models import create_tables
from database import get_connection


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Kaliraja Portfolio API",
    description="Backend API for Kaliraja Portfolio Admin Panel",
    version="1.0.0"
)


# =========================================================
# CORS SETTINGS (Explicitly allowing Vercel and Localhost)
# =========================================================

origins = [
    "https://kaliraja-portfolio.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://kaliraja-portfolio.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# STATIC FILES (Uploads Folder)
# =========================================================

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# =========================================================
# PASSWORD ENCRYPTION
# =========================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================================
# MODELS
# =========================================================

class LoginRequest(BaseModel):
    username: str
    password: str


class SkillCreate(BaseModel):
    name: str
    description: str


# =========================================================
# STARTUP
# =========================================================

@app.on_event("startup")
def startup_event():
    try:
        create_tables()
    except Exception as e:
        print(f"Startup table creation warning: {e}")


# =========================================================
# HOME & HEALTH
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Kaliraja Portfolio API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "database": "Connected"
    }


# =========================================================
# ADMIN LOGIN
# =========================================================

@app.post("/admin/login")
def admin_login(data: LoginRequest):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, username, password
            FROM admin
            WHERE username = %s
            """,
            (data.username,)
        )

        admin = cursor.fetchone()

        if not admin or not pwd_context.verify(data.password, admin["password"]):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        return {
            "message": "Login successful",
            "admin_id": admin["id"],
            "username": admin["username"]
        }

    finally:
        cursor.close()
        connection.close()


# =========================================================
# PROJECTS API
# =========================================================

@app.get("/projects")
def get_projects():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                id,
                title,
                description,
                technologies,
                github_url,
                live_url,
                image_url,
                created_at
            FROM projects
            ORDER BY id DESC
            """
        )

        projects = cursor.fetchall()
        return {"projects": projects}

    finally:
        cursor.close()
        connection.close()


@app.get("/projects/{project_id}")
def get_project(project_id: int):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                id,
                title,
                description,
                technologies,
                github_url,
                live_url,
                image_url,
                created_at
            FROM projects
            WHERE id = %s
            """,
            (project_id,)
        )

        project = cursor.fetchone()

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        return project

    finally:
        cursor.close()
        connection.close()


@app.post("/projects")
def add_project(
    title: str = Form(...),
    description: str = Form(...),
    technologies: str = Form(""),
    github_url: str = Form(""),
    live_url: str = Form(""),
    image: UploadFile = File(None)
):
    image_url = ""
    if image and image.filename:
        filename = f"proj_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/{filename}"

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO projects
            (
                title,
                description,
                technologies,
                github_url,
                live_url,
                image_url
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                title,
                description,
                technologies,
                github_url,
                live_url,
                image_url
            )
        )

        connection.commit()
        project_id = cursor.lastrowid

        return {
            "message": "Project added successfully",
            "project_id": project_id
        }

    finally:
        cursor.close()
        connection.close()


@app.put("/projects/{project_id}")
def update_project(
    project_id: int,
    title: str = Form(...),
    description: str = Form(...),
    technologies: str = Form(""),
    github_url: str = Form(""),
    live_url: str = Form(""),
    image: UploadFile = File(None)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, image_url FROM projects WHERE id = %s",
            (project_id,)
        )
        project = cursor.fetchone()

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        image_url = project["image_url"]
        if image and image.filename:
            filename = f"proj_{image.filename}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"/uploads/{filename}"

        cursor.execute(
            """
            UPDATE projects
            SET
                title = %s,
                description = %s,
                technologies = %s,
                github_url = %s,
                live_url = %s,
                image_url = %s
            WHERE id = %s
            """,
            (
                title,
                description,
                technologies,
                github_url,
                live_url,
                image_url,
                project_id
            )
        )

        connection.commit()
        return {
            "message": "Project updated successfully",
            "project_id": project_id
        }

    finally:
        cursor.close()
        connection.close()


@app.delete("/projects/{project_id}")
def delete_project(project_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT id FROM projects WHERE id = %s",
            (project_id,)
        )
        project = cursor.fetchone()

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        cursor.execute(
            "DELETE FROM projects WHERE id = %s",
            (project_id,)
        )
        connection.commit()

        return {
            "message": "Project deleted successfully",
            "project_id": project_id
        }

    finally:
        cursor.close()
        connection.close()


# =========================================================
# SKILLS API
# =========================================================

@app.get("/skills")
def get_skills():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, description, created_at
            FROM skills
            ORDER BY id DESC
            """
        )
        skills = cursor.fetchall()
        return {"skills": skills}

    finally:
        cursor.close()
        connection.close()


@app.post("/skills")
def add_skill(data: SkillCreate):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO skills (name, description)
            VALUES (%s, %s)
            """,
            (data.name, data.description)
        )
        connection.commit()
        return {"message": "Skill added successfully"}

    finally:
        cursor.close()
        connection.close()


@app.delete("/skills/{skill_id}")
def delete_skill(skill_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "DELETE FROM skills WHERE id = %s",
            (skill_id,)
        )
        connection.commit()
        return {"message": "Skill deleted successfully"}

    finally:
        cursor.close()
        connection.close()


# =========================================================
# PROFILE & RESUME API
# =========================================================

@app.get("/profile")
def get_profile():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, email, profile_image, resume_file
            FROM profile
            WHERE id = 1
            """
        )
        profile = cursor.fetchone()
        return profile or {}

    finally:
        cursor.close()
        connection.close()


@app.post("/profile/upload")
def upload_profile_assets(
    profile_image: UploadFile = File(None),
    resume_file: UploadFile = File(None)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT profile_image, resume_file FROM profile WHERE id = 1"
        )
        current = cursor.fetchone() or {"profile_image": "", "resume_file": ""}

        img_path = current.get("profile_image") or ""
        if profile_image and profile_image.filename:
            filename = f"profile_{profile_image.filename}"
            save_path = os.path.join(UPLOAD_DIR, filename)
            with open(save_path, "wb") as buffer:
                shutil.copyfileobj(profile_image.file, buffer)
            img_path = f"/uploads/{filename}"

        pdf_path = current.get("resume_file") or ""
        if resume_file and resume_file.filename:
            filename = f"resume_{resume_file.filename}"
            save_path = os.path.join(UPLOAD_DIR, filename)
            with open(save_path, "wb") as buffer:
                shutil.copyfileobj(resume_file.file, buffer)
            pdf_path = f"/uploads/{filename}"

        cursor.execute(
            """
            UPDATE profile
            SET profile_image = %s, resume_file = %s
            WHERE id = 1
            """,
            (img_path, pdf_path)
        )
        connection.commit()

        return {
            "message": "Assets updated successfully",
            "profile_image": img_path,
            "resume_file": pdf_path
        }

    finally:
        cursor.close()
        connection.close()