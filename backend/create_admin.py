from database import get_connection
from passlib.context import CryptContext

# 1. Connect to Aiven Cloud Database
connection = get_connection()
cursor = connection.cursor()

# 2. Create all required tables directly
print("Creating tables in cloud database...")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )
""")

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

cursor.execute("""
    CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS profile (
        id INT PRIMARY KEY DEFAULT 1,
        name VARCHAR(100),
        email VARCHAR(200),
        profile_image VARCHAR(500),
        resume_file VARCHAR(500)
    )
""")

# Insert default profile row
cursor.execute("""
    INSERT IGNORE INTO profile (id, name, email, profile_image, resume_file)
    VALUES (1, 'Kaliraja S', 'your-email@example.com', '', '')
""")

# 3. Create Admin user
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
username = "admin"
password = "admin123"
hashed_password = pwd_context.hash(password)

cursor.execute(
    """
    INSERT INTO admin (username, password)
    VALUES (%s, %s)
    ON DUPLICATE KEY UPDATE password = %s
    """,
    (username, hashed_password, hashed_password)
)

connection.commit()
cursor.close()
connection.close()

print("All database tables created successfully!")
print("Admin created successfully!")
print("Username:", username)
print("Password:", password)