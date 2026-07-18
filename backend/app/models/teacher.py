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
    text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import (
    Department,
    Designation,
    EmploymentStatus,
)
from app.models.base_model import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.account import Account

class Teacher(BaseModel):

    __tablename__ = "teachers"

    # Account

    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id",
                   ondelete="CASCADE"),
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
        server_default=text("false")
    )

    # Remarks

    remarks: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    account: Mapped["Account"] = relationship(
        "Account",
        back_populates = "teacher"
    )

    def to_dict(self) -> dict:
        data = super().to_dict()
        data.update({
            "employee_code": self.employee_code,
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "last_name": self.last_name,
            "display_name": self.display_name,
            "official_email": self.official_email,
            "mobile_number": self.mobile_number,
            "department": self.department.value,
            "designation": self.designation.value,
            "employment_status": self.employment_status.value,
            "joining_date": self.joining_date.isoformat() if self.joining_date else None,
            "face_registered": self.face_registered,
            "remarks": self.remarks,
        })
        return data