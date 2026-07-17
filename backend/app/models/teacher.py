"""
Teacher Model

Stores teacher profile and employment information.

Authentication is handled by the Account model.
"""

from __future__ import annotations

from datetime import date

from sqlalchemy import (
    Boolean,
    Date,
    Enum,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.enums import (
    Department,
    Designation,
    EmploymentStatus,
)
from app.models.base_model import BaseModel


class Teacher(BaseModel):

    __tablename__ = "teachers"

    # Account

    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id"),
        unique=True,
        nullable=False,
    )

    # Identity

    employee_code: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    first_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    middle_name: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    last_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    display_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    # Contact

    official_email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    mobile_number: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    # Employment

    department: Mapped[Department] = mapped_column(
        Enum(Department, name="department_enum"),
        nullable=False,
    )

    designation: Mapped[Designation] = mapped_column(
        Enum(Designation, name="designation_enum"),
        nullable=False,
    )

    employment_status: Mapped[EmploymentStatus] = mapped_column(
        Enum(
            EmploymentStatus,
            name="employment_status_enum",
        ),
        nullable=False,
        default=EmploymentStatus.ACTIVE,
    )

    joining_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    # Face Recognition

    face_registered: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Remarks

    remarks: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )