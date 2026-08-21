from database import get_connection

def create_tables():
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

    # Check and add 'image_url' column automatically if table already existed without it
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN image_url VARCHAR(500)")
        connection.commit()
    except Exception:
        pass  # Column already exists

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
        VALUES (1, 'Kaliraja S', 'your-email@example.com', '', '')
    """)

    connection.commit()
    cursor.close()
    connection.close()
    print("Database tables initialized successfully.")