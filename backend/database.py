import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": "mysql-c5fed6-kalirajakaliraja18022005-d8fc.l.aivencloud.com",
    "port": 13156,
    "user": "avnadmin",
    "password": "AVNS_N_OInvjLOxXAmyqr3LI",  # Aiven-ல் காட்டிய Password-ஐ இங்கே பேஸ்ட் செய்யுங்கள்
    "database": "defaultdb",
}

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)