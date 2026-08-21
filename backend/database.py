import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

# Extract raw host and strip any port or protocol accidentally appended
raw_host = os.getenv("DB_HOST", "mysql-c5fed6-kalirajakaliraja18022005-d8fc.l.aivencloud.com")
clean_host = raw_host.split(":")[0].replace("https://", "").replace("http://", "").replace("mysql://", "").strip()

raw_port = os.getenv("DB_PORT", "13156")
clean_port = int(str(raw_port).split("/")[-1])

DB_CONFIG = {
    "host": clean_host,
    "port": clean_port,
    "user": os.getenv("DB_USER", "avnadmin"),
    "password": os.getenv("DB_PASSWORD", "AVNS_N_OInvjLOxXAmyqr3LI"),
    "database": os.getenv("DB_NAME", "defaultdb"),
    "ssl_disabled": False,
    "ssl_verify_cert": False
}

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)