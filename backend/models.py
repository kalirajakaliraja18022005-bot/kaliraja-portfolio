from database import get_connection
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tables():
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # 1. Admin table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        """)

        # Default Admin User ('admin' / 'admin123') create panradhu
        cursor.execute("SELECT id FROM admin WHERE username = 'admin'")
        if not cursor.fetchone():
            hashed_pwd = pwd_context.hash("admin123")
            cursor.execute(
                "INSERT INTO admin (username, password) VALUES (%s, %s)",
                ("admin", hashed_pwd)
            )

        # 2. Projects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                technologies VARCHAR(500),
                github_url VARCHAR(500),
                live_url VARCHAR(500),
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Safe Column Add
        try:
            cursor.execute("ALTER TABLE projects ADD COLUMN image_url VARCHAR(500)")
        except Exception:
            pass

        # 3. Skills table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 4. Profile table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS profile (
                id INT PRIMARY KEY DEFAULT 1,
                name VARCHAR(100),
                email VARCHAR(200),
                profile_image VARCHAR(500),
                resume_file VARCHAR(500)
            )
        """)

        # Default profile record initialization
        cursor.execute("""
            INSERT IGNORE INTO profile (id, name, email, profile_image, resume_file)
            VALUES (1, 'Kaliraja S', 'kaliraja@example.com', '', '')
        """)

        connection.commit()
        print("Database tables & default admin initialized successfully.")

    except Exception as e:
        print(f"Table creation error: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()