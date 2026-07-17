"""
Database Utilities

Provides helper functions for validating the
database connection.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from sqlalchemy import text

from app.extensions import db


def test_database_connection() -> bool:
    """
    Test the PostgreSQL database connection.

    Returns
    -------
    bool
        True if the connection succeeds.
    """

    try:
        with db.engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))

            version = result.scalar()

            print("\n" + "=" * 60)
            print("✅ Database Connected Successfully")
            print("=" * 60)
            print(version)
            print("=" * 60 + "\n")

            return True

    except Exception as exc:
        print("\n" + "=" * 60)
        print("❌ Database Connection Failed")
        print("=" * 60)
        print(exc)
        print("=" * 60 + "\n")

        return False