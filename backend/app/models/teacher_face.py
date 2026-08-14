"""
Teacher Face Model

Stores teacher face registration details used for face recognition.
Each record represents one face registration.
"""

from sqlalchemy import (
    Boolean,
    Float,
    ForeignKey,
    Index,
    String,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models import BaseModel


class TeacherFace(BaseModel):

    __tablename__ = "teacher_faces"

    __table_args__ = (
        Index(
            "uq_teacher_faces_active",
            "teacher_id",
            unique=True,
            postgresql_where=text("is_active = true"),
        ),
    )

    teacher_id: Mapped[int] = mapped_column(
        ForeignKey(
            "teachers.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    image_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    embedding: Mapped[list[float]] = mapped_column(
        JSONB,
        nullable=False,
    )

    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    face_quality_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=text("true"),
    )

    def to_dict(self) -> dict:
        data = super().to_dict()

        data.update({
            "teacher_id": self.teacher_id,
            "image_path": self.image_path,
            "model_name": self.model_name,
            "model_version": self.model_version,
            "face_quality_score": self.face_quality_score,
            "is_active": self.is_active,
        })

        return data