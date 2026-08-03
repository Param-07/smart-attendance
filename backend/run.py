"""
Application Entry Point

Starts the Smart Attendance Flask application.

"""

from app import create_app
from app.core.logging import configure_logging

configure_logging()
app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
    )