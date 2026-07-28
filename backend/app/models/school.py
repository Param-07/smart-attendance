from sqlalchemy import String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

from app.models import BaseModel, Teacher

if TYPE_CHECKING:
    from app.models import SchoolConfiguration
    
class School(BaseModel):
    __tablename__ = "schools"

    __table_args__ = (
        UniqueConstraint(
            "code",
            name="uq_school_code"
        ),
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    code: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        server_default=text("'India'")
    )

    postal_code: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    logo_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        server_default=text("'Asia/Kolkata'")
    )

    configuration: Mapped["SchoolConfiguration"] = relationship(
        "SchoolConfiguration",
        back_populates="school",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="joined"
    )

    teachers: Mapped[list["Teacher"]] = relationship(
        "Teacher",
        back_populates="school",
        lazy="select"
    )

    def __repr__(self) -> str:
        return (
            f"<School(id={self.id}, "
            f"code='{self.code}', "
            f"name='{self.name}')>"
        )