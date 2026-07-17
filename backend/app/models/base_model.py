from __future__ import annotations
from datetime import datetime
import uuid

from sqlalchemy import Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import (
    Mapped, mapped_column
)
from sqlalchemy.sql import func

from app.extensions import db

class BaseModel(db.Model):
    """
    Abstract base model.
    All database models inherit from this class.
    """
    __abstract__ = True  # tells the Sqlalchemy library not to ceate table called base_model

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    public_uuid: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        unique=True,
        nullable=False,
        default=uuid.uuid4
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=datetime.now(),
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=datetime.now(),
        onupdate=func.now(),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    def to_dict(self) -> dict:

        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }