from database import get_connection
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            technologies TEXT,
            github_url TEXT,
            live_url TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT,
            profile_image TEXT,
            resume_file TEXT
        )
    """)

    cursor.execute("SELECT id FROM admin WHERE username = 'admin'")
    if not cursor.fetchone():
        hashed_pwd = pwd_context.hash("admin123")
        cursor.execute("INSERT INTO admin (username, password) VALUES (?, ?)", ("admin", hashed_pwd))

    cursor.execute("SELECT id FROM profile WHERE id = 1")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO profile (id, name, email, profile_image, resume_file) VALUES (1, ?, ?, ?, ?)",
            ("Kaliraja S", "kaliraja@example.com", "", "")
        )

    conn.commit()
    conn.close()
    print("Local SQLite Database & Admin initialized successfully!")
