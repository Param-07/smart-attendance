"""
Smart Attendance Bootstrap

Initializes the Smart Attendance project by creating
the required folders and files.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from pathlib import Path
from project_config import ROOT, FOLDERS, FILES
from file_utils import (
    create_directory,
    create_file,
    success,
    warning,
    info,
    error,
)


def create_directories() -> tuple[int, int]:
    """
    Create all project directories.

    Returns
    -------
    tuple[int, int]
        (created_count, skipped_count)
    """

    created = 0
    skipped = 0

    info("Creating directories...\n")

    for folder in FOLDERS:
        path = ROOT / folder

        if create_directory(path):
            success(folder)
            created += 1
        else:
            warning(folder)
            skipped += 1

    return created, skipped


def create_project_files() -> tuple[int, int]:
    """
    Create all project files.

    Returns
    -------
    tuple[int, int]
        (created_count, skipped_count)
    """

    created = 0
    skipped = 0

    print()
    info("Creating files...\n")

    for file in FILES:
        path = ROOT / file

        if create_file(path):
            success(file)
            created += 1
        else:
            warning(file)
            skipped += 1

    return created, skipped


def print_summary(
    folder_created: int,
    folder_skipped: int,
    file_created: int,
    file_skipped: int,
) -> None:
    """Print bootstrap summary."""

    print("\n" + "=" * 60)
    info("Bootstrap Completed Successfully")
    print("=" * 60)

    print(f"Directories Created : {folder_created}")
    print(f"Directories Skipped : {folder_skipped}")

    print()

    print(f"Files Created       : {file_created}")
    print(f"Files Skipped       : {file_skipped}")

    print("=" * 60)


def main() -> None:
    """Bootstrap entry point."""

    print("=" * 60)
    print("           SMART ATTENDANCE BOOTSTRAP")
    print("=" * 60)
    print()

    folder_created, folder_skipped = create_directories()

    file_created, file_skipped = create_project_files()

    print_summary(
        folder_created,
        folder_skipped,
        file_created,
        file_skipped,
    )


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        error("\nBootstrap cancelled by user.")
    except Exception as exc:
        error(f"\nUnexpected Error: {exc}")