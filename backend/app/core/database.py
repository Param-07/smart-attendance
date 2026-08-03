"""
Database Utilities

Provides helper functions for validating the
database connection.
"""

from sqlalchemy import text

from app.extensions import db
from app.core.logging import get_logger

logger = get_logger(__name__)


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

            result = connection.execute(
                text("SELECT version();")
            )

            version = result.scalar()

            logger.info(
                "Database connection established successfully."
            )

            logger.info(
                "Database version: %s",
                version,
            )

            return True

    except Exception:

        logger.exception(
            "Database connection failed."
        )

        raise