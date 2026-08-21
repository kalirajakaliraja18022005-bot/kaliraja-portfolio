import os
import shutil
import hashlib
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from models import create_tables
from database import get_connection

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

app = FastAPI(
    title="Kaliraja Portfolio API",
    description="Backend API for Kaliraja Portfolio Admin Panel",
    version="1.0.0"
)

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

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

class LoginRequest(BaseModel):
    username: str
    password: str

class SkillCreate(BaseModel):
    name: str
    description: str

@app.on_event("startup")
def startup_event():
    try:
        create_tables()
    except Exception as e:
        print(f"Startup error: {e}")

@app.get("/")
def home():
    return {"message": "Kaliraja Portfolio API is running"}

@app.get("/health")
def health_check():
    create_tables()
    return {"status": "OK", "database": "Connected SQLite", "admin": "Ready"}

@app.post("/admin/login")
def admin_login(data: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, username, password FROM admin WHERE username = ?", (data.username,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        admin = dict(row)
        input_hash = hash_password(data.password)

        if input_hash != admin["password"] and data.password != admin["password"]:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return {
            "message": "Login successful",
            "admin_id": admin["id"],
            "username": admin["username"]
        }
    finally:
        conn.close()

@app.get("/projects")
def get_projects():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, title, description, technologies, github_url, live_url, image_url, created_at FROM projects ORDER BY id DESC")
        return {"projects": [dict(row) for row in cursor.fetchall()]}
    finally:
        conn.close()

@app.get("/projects/{project_id}")
def get_project(project_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, title, description, technologies, github_url, live_url, image_url, created_at FROM projects WHERE id = ?", (project_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Project not found")
        return dict(row)
    finally:
        conn.close()

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

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO projects (title, description, technologies, github_url, live_url, image_url) VALUES (?, ?, ?, ?, ?, ?)",
            (title, description, technologies, github_url, live_url, image_url)
        )
        conn.commit()
        return {"message": "Project added successfully", "project_id": cursor.lastrowid}
    finally:
        conn.close()

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
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, image_url FROM projects WHERE id = ?", (project_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Project not found")

        image_url = dict(row)["image_url"]
        if image and image.filename:
            filename = f"proj_{image.filename}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"/uploads/{filename}"

        cursor.execute(
            "UPDATE projects SET title = ?, description = ?, technologies = ?, github_url = ?, live_url = ?, image_url = ? WHERE id = ?",
            (title, description, technologies, github_url, live_url, image_url, project_id)
        )
        conn.commit()
        return {"message": "Project updated successfully", "project_id": project_id}
    finally:
        conn.close()

@app.delete("/projects/{project_id}")
def delete_project(project_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM projects WHERE id = ?", (project_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Project not found")

        cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        conn.commit()
        return {"message": "Project deleted successfully", "project_id": project_id}
    finally:
        conn.close()

@app.get("/skills")
def get_skills():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name, description, created_at FROM skills ORDER BY id DESC")
        return {"skills": [dict(row) for row in cursor.fetchall()]}
    finally:
        conn.close()

@app.post("/skills")
def add_skill(data: SkillCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO skills (name, description) VALUES (?, ?)", (data.name, data.description))
        conn.commit()
        return {"message": "Skill added successfully"}
    finally:
        conn.close()

@app.delete("/skills/{skill_id}")
def delete_skill(skill_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM skills WHERE id = ?", (skill_id,))
        conn.commit()
        return {"message": "Skill deleted successfully"}
    finally:
        conn.close()

@app.get("/profile")
def get_profile():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name, email, profile_image, resume_file FROM profile WHERE id = 1")
        row = cursor.fetchone()
        return dict(row) if row else {}
    finally:
        conn.close()

@app.post("/profile/upload")
def upload_profile_assets(
    profile_image: UploadFile = File(None),
    resume_file: UploadFile = File(None)
):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT profile_image, resume_file FROM profile WHERE id = 1")
        row = cursor.fetchone()
        current = dict(row) if row else {"profile_image": "", "resume_file": ""}

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

        cursor.execute("UPDATE profile SET profile_image = ?, resume_file = ? WHERE id = 1", (img_path, pdf_path))
        conn.commit()
        return {"message": "Assets updated successfully", "profile_image": img_path, "resume_file": pdf_path}
    finally:
        conn.close()
