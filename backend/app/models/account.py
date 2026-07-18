from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Enum, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import AccountStatus, UserRole
from app.models.base_model import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.teacher import Teacher

class Account(BaseModel):
    """
    Authentication account.

    Stores login credentials and account security
    information for all system users.
    """

    __tablename__ = "accounts"

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
        Enum(UserRole, name="user_role"),
        nullable=False,
    )

    account_status: Mapped[AccountStatus] = mapped_column(
        Enum(AccountStatus, name="account_status"),
        nullable=False,
        default=AccountStatus.ACTIVE,
    )

    # Security

    failed_login_attempts: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        server_default="0"
    )

    password_reset_required: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
        server_default=text("true")
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

    teacher: Mapped["Teacher"] = relationship(
        "Teacher",
        back_populates="account",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def to_dict(self) -> dict:
        data = super().to_dict()
        data.update({
            "username": self.username,
            "role": self.role.value,
            "account_status": self.account_status.value,
            "password_reset_required": self.password_reset_required,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        })
        return data