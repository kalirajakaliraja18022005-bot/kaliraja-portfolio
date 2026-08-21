import sqlite3
import os

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "portfolio.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn
