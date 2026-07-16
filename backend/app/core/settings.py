"""
Application Settings

Contains application-wide constants used throughout
the Smart Attendance system.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from pathlib import Path

# =====================================================
# Application
# =====================================================

APP_NAME = "Smart Attendance"

APP_VERSION = "1.0.0"

API_PREFIX = "/api/v1"

# =====================================================
# Project Paths
# =====================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

APP_DIR = PROJECT_ROOT / "app"

UPLOAD_DIR = PROJECT_ROOT / "uploads"

LOG_DIR = PROJECT_ROOT / "logs"

MODEL_DIR = PROJECT_ROOT / "app" / "ai" / "models"

DEFAULT_ENVIRONMENT = "development"

# =====================================================
# Image Settings
# =====================================================

MAX_IMAGE_SIZE_MB = 5

SUPPORTED_IMAGE_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
)

SUPPORTED_IMAGE_MIME_TYPES = (
    "image/jpeg",
    "image/png",
)

# =====================================================
# Face Recognition
# =====================================================

FACE_MATCH_THRESHOLD = 0.60

MIN_FACE_SIZE = 80

MAX_FACES_ALLOWED = 1

# =====================================================
# Attendance
# =====================================================

GPS_DISTANCE_UNIT = "meters"

DEFAULT_ATTENDANCE_STATUS = "Present"

# =====================================================
# Pagination
# =====================================================

DEFAULT_PAGE_SIZE = 20

MAX_PAGE_SIZE = 100

# =====================================================
# Logging
# =====================================================

LOG_FILE_NAME = "smart_attendance.log"

LOG_LEVEL = "INFO"