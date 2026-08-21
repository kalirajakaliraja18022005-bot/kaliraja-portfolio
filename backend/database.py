import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "mysql-c5fed6-kalirajakaliraja18022005-d8fc.l.aivencloud.com"),
    "port": int(os.getenv("DB_PORT", 13156)),
    "user": os.getenv("DB_USER", "avnadmin"),
    "password": os.getenv("DB_PASSWORD", "AVNS_N_OInvjLOxXAmyqr3LI"),
    "database": os.getenv("DB_NAME", "defaultdb"),
    "ssl_disabled": False
}

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)