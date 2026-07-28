from __future__ import annotations

from decimal import Decimal
from datetime import time
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    ForeignKey,
    Integer,
    Time,
    text,
    Numeric
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.school import School


class SchoolConfiguration(BaseModel):
    __tablename__ = "school_configurations"

    __table_args__ = (
        CheckConstraint(
            "face_match_threshold >= 0 AND face_match_threshold <= 1",
            name="face_match_threshold_range",
        ),
        CheckConstraint(
            "allowed_radius > 0",
            name="allowed_radius_positive",
        ),
        CheckConstraint(
            "gps_accuracy_threshold > 0",
            name="gps_accuracy_threshold_positive",
        ),
        CheckConstraint(
            "max_failed_login_attempts >= 1",
            name="max_failed_login_attempts_positive",
        ),
        CheckConstraint(
            "lockout_duration_minutes >= 1",
            name="lockout_duration_minutes_positive",
        ),
    )
    
    # Relationship

    school_id: Mapped[int] = mapped_column(
        ForeignKey(
            "schools.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
    )

    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        server_default=text("1"),
    )

    __mapper_args__ = {
        "version_id_col": version,
    }

    school: Mapped["School"] = relationship(
        "School",
        back_populates="configuration",
        lazy="select",
    )

    # Face Recognition

    require_check_in_face: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
    )

    require_check_out_face: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    require_liveness: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
    )

    allow_face_reregistration: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    face_match_threshold: Mapped[Decimal] = mapped_column(
        Numeric(3,2),
        nullable=False,
        server_default=text("0.65"),
    )

    # Attendance

    allow_check_in: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
    )

    allow_check_out: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
    )

    auto_checkout_enabled: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    auto_checkout_time: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    # GPS

    require_check_in_gps: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
    )

    require_check_out_gps: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    allowed_radius: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        server_default=text("100"),
    )

    gps_accuracy_threshold: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        server_default=text("30"),
    )

    # Security

    max_failed_login_attempts: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        server_default=text("5"),
    )

    lockout_duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        server_default=text("30"),
    )

    def __repr__(self) -> str:
        return (
            f"<SchoolConfiguration("
            f"school_id={self.school_id}, "
            f"version={self.version})>"
        )