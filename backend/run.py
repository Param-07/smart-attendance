"""
Application Entry Point

Starts the Smart Attendance Flask application.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
    )