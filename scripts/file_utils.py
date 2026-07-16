"""
File Utilities

Reusable utility functions used by the bootstrap script.

Author: Parmanand Gupta
Project: Smart Attendance
"""

from pathlib import Path

class ConsoleColor:
    """ANSI color codes for terminal output."""

    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    CYAN = "\033[96m"
    RESET = "\033[0m"

def success(message: str) -> None:
    """Print a success message."""
    print(f"{ConsoleColor.GREEN}✓ {message}{ConsoleColor.RESET}")


def warning(message: str) -> None:
    """Print a warning message."""
    print(f"{ConsoleColor.YELLOW}⚠ {message}{ConsoleColor.RESET}")


def error(message: str) -> None:
    """Print an error message."""
    print(f"{ConsoleColor.RED}✗ {message}{ConsoleColor.RESET}")


def info(message: str) -> None:
    """Print an informational message."""
    print(f"{ConsoleColor.CYAN}➜ {message}{ConsoleColor.RESET}")

def create_directory(path: Path) -> bool:
    """
    Create a directory.

    Returns
    -------
    bool
        True if the directory was created.
        False if it already existed.
    """
    if path.exists():
        return False

    path.mkdir(parents=True, exist_ok=True)
    return True


def create_file(path: Path) -> bool:
    """
    Create an empty file.

    Returns
    -------
    bool
        True if the file was created.
        False if it already existed.
    """
    if path.exists():
        return False

    path.parent.mkdir(parents=True, exist_ok=True)
    path.touch()

    return True