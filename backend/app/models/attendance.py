from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.attendance.enums import AttendanceStatus
from app.models import Account, Teacher, BaseModel


class Attendance(BaseModel):
    __tablename__ = "attendances"

    __table_args__ = (
        UniqueConstraint(
            "teacher_id",
            "attendance_date",
            name="uq_teacher_attendance_date",
        ),
    )

    # Relationships

    teacher_id: Mapped[int] = mapped_column(
        ForeignKey("teachers.id"),
        nullable=False,
        index=True,
    )

    teacher: Mapped["Teacher"] = relationship(
        "Teacher",
        back_populates="attendances",
    )

    # Attendance Information

    attendance_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    check_in_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    check_out_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Selfie

    check_in_selfie_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    
    face_match_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # Check In/Out

    check_in_latitude: Mapped[Decimal] = mapped_column(
        Numeric(10, 7),
        nullable=False,
    )

    check_in_longitude: Mapped[Decimal] = mapped_column(
        Numeric(10, 7),
        nullable=False,
    )

    check_in_accuracy: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    check_out_latitude: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 7),
        nullable=True,
    )

    check_out_longitude: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 7),
        nullable=True,
    )

    check_out_accuracy: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # Attendance Status

    status: Mapped[AttendanceStatus] = mapped_column(
        Enum(AttendanceStatus),
        nullable=False,
        default=AttendanceStatus.OPEN,
    )

    # Admin Correction

    remarks: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    corrected_by: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id"),
        nullable=True,
    )

    corrected_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    corrected_by_account: Mapped["Account"] = relationship(
        "Account",
        foreign_keys=[corrected_by],
    )