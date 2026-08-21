import hashlib
from database import get_connection

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Admin table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # 2. Projects table
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

    # 3. Skills table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 4. Profile table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT,
            profile_image TEXT,
            resume_file TEXT
        )
    """)

    # Auto Seed Admin
    cursor.execute("SELECT id FROM admin WHERE username = 'admin'")
    row = cursor.fetchone()
    admin_hash = hash_password("admin123")
    if not row:
        cursor.execute("INSERT INTO admin (username, password) VALUES (?, ?)", ("admin", admin_hash))
    else:
        cursor.execute("UPDATE admin SET password = ? WHERE username = 'admin'", (admin_hash,))

    # Auto Seed Profile
    cursor.execute("SELECT id FROM profile WHERE id = 1")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO profile (id, name, email, profile_image, resume_file) VALUES (1, ?, ?, ?, ?)",
            ("Kaliraja S", "kaliraja@example.com", "", "")
        )

    conn.commit()
    conn.close()
    print("Database and admin initialized successfully with built-in hashing!")
