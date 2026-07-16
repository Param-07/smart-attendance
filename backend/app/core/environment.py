"""
Environment Configuration

Loads environment variables from the .env file and provides
a centralized interface for accessing them throughout the application.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

# ---------------------------------------------------------
# Load .env
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


class Environment:
    """Environment variable helper."""

    @staticmethod
    def get(key: str, default: str | None = None) -> str | None:
        """
        Return an environment variable.

        Parameters
        ----------
        key : str
            Environment variable name.

        default : str | None
            Default value if variable doesn't exist.
        """

        return os.getenv(key, default)

    @staticmethod
    def require(key: str) -> str:
        """
        Return a required environment variable.

        Raises
        ------
        RuntimeError
            If the variable does not exist.
        """

        value = os.getenv(key)

        if value is None:
            raise RuntimeError(
                f"Missing required environment variable: {key}"
            )

        return value