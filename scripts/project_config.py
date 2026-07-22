"""
Project Structure Definition

This module contains the complete folder and file structure
for the Smart Attendance project.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FOLDERS = [

    # Root
    "frontend",
    "backend",
    "docs",
    "docker",
    "scripts",
    "tests",
    ".github/workflows",

    # -------------------------
    # Backend
    # -------------------------
    "backend/app",

    "backend/app/core",
    "backend/app/middleware",

    "backend/app/modules",
    "backend/app/modules/authentication",
    "backend/app/modules/teacher",
    "backend/app/modules/attendance",
    "backend/app/modules/face",
    "backend/app/modules/reports",
    "backend/app/modules/settings",

    "backend/app/models",

    "backend/app/ai",
    "backend/app/ai/detector",
    "backend/app/ai/embedding",
    "backend/app/ai/matcher",
    "backend/app/ai/liveness",
    "backend/app/ai/models",
    "backend/app/ai/utils",

    "backend/app/storage",
    "backend/app/utils",

    "backend/migrations",
    "backend/requirements",

    # -------------------------
    # Frontend
    # -------------------------

    "frontend/public",

    "frontend/src",

    "frontend/src/assets",
    "frontend/src/components",
    "frontend/src/features",
    "frontend/src/hooks",
    "frontend/src/layouts",
    "frontend/src/pages",
    "frontend/src/routes",
    "frontend/src/services",
    "frontend/src/contexts",
    "frontend/src/utils",
    "frontend/src/constants",
    "frontend/src/styles",

    # -------------------------
    # Documentation
    # -------------------------

    "docs/01-vision",
    "docs/02-srs",
    "docs/03-architecture",
    "docs/04-database",
    "docs/05-api",
    "docs/06-ui-ux",
    "docs/07-deployment",
    "docs/08-testing",
    "docs/09-sprints",
    "docs/diagrams",
]

FILES = [

    # Root
    ".gitignore",
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md",

    # Backend
    "backend/run.py",
    "backend/requirements.txt",
    "backend/.env.example",

    "backend/app/__init__.py",
    "backend/app/app.py",
    "backend/app/extensions.py",

    "backend/app/core/config.py",
    "backend/app/core/database.py",
    "backend/app/core/security.py",
    "backend/app/core/logger.py",
    "backend/app/core/constants.py",
    "backend/app/core/exceptions.py",

    "backend/app/middleware/auth.py",
    "backend/app/middleware/roles.py",
    "backend/app/middleware/audit.py",
    "backend/app/middleware/validation.py",
    "backend/app/middleware/error_handler.py",

    # Frontend
    "frontend/src/App.jsx",
]