from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import AccountStatus, UserRole
from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.models.school import School
    from app.models.teacher import Teacher


class Account(BaseModel):
    """
    Authentication account.

    Stores login credentials and account security
    information for all system users.

    Roles:
        SUPER_ADMIN
            Platform-level administrator.
            Not associated with a school.

        SCHOOL_ADMIN
            Administrator scoped to one school.

        TEACHER
            Teacher account scoped to one school.
    """

    __tablename__ = "accounts"

    __table_args__ = (
        CheckConstraint(
            """
            (
                role = 'SUPER_ADMIN'
                AND school_id IS NULL
            )
            OR
            (
                role IN ('SCHOOL_ADMIN', 'TEACHER')
                AND school_id IS NOT NULL
            )
            """,
            name="ck_account_role_school",
        ),
    )

    # Authentication

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(
            UserRole,
            name="user_role",
        ),
        nullable=False,
    )

    account_status: Mapped[AccountStatus] = mapped_column(
        Enum(
            AccountStatus,
            name="account_status",
        ),
        nullable=False,
        default=AccountStatus.ACTIVE,
        server_default=text("'ACTIVE'"),
    )

    # Security

    failed_login_attempts: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        server_default="0",
    )

    password_reset_required: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
        server_default=text("true"),
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    last_login_ip: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
    )

    last_password_change: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    password_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # School

    school_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "schools.id",
            ondelete="RESTRICT",
        ),
        nullable=True,
        index=True,
    )

    school: Mapped["School | None"] = relationship(
        "School",
        back_populates="accounts",
        lazy="select",
    )

    # Only TEACHER accounts have a Teacher record.
    #
    # SUPER_ADMIN and SCHOOL_ADMIN accounts have teacher=None.
    #

    teacher: Mapped["Teacher | None"] = relationship(
        "Teacher",
        back_populates="account",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Serialization

    def to_dict(self) -> dict:
        data = super().to_dict()

        data.update({
            "username": self.username,
            "role": self.role.value,
            "account_status": self.account_status.value,
            "password_reset_required": self.password_reset_required,
            "last_login": (
                self.last_login.isoformat()
                if self.last_login
                else None
            ),
        })

        return data