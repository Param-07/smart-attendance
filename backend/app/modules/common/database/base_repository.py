from __future__ import annotations
from typing import Generic, Optional, TypeVar

from app.extensions import db
from app.models.base_model import BaseModel

T = TypeVar("T", bound = BaseModel)

class BaseRepository(Generic[T]):
    """
    Generic repository for common database operations.

    Every repository in the application should inherit from this class.
    """

    model : type[T]

    # Read Methods 

    def __init__(self, model:type[T]) -> None:
        self.model = model

    def get_by_id(self, id:int) -> Optional[T]:
        return db.session.get(self.model, id)
    
    def get_by_public_uuid(self, public_uuid: str) -> Optional[T]:
        return (
            db.session.query(self.model)
            .filter(self.model.public_uuid == public_uuid)
            .first()
        )
    
    def get_all(self) -> list[T]:
        return db.session.query(self.model).all()
    
    def count(self) -> int:
        return db.session.query(self.model).count()
    
    def exists(self, **filters) -> bool:      # **filters accepts dynamic filters ex: .exists(username/employee_code etc)
        return (
            db.session.query(self.model)
                .filter_by(**filters)
                .first()
                is not None
        )
    
    # Write methods

    def add(self, entity: T) -> T:
        db.session.add(entity)
        return entity
    
    def delete(self, entity: T) -> None:
        db.session.delete(entity)

    def flush(self) -> None:
        db.session.flush()

    def rollback(self) -> None:
        db.session.rollback()

    def save(self, entity: T) -> T:
        db.session.add(entity)
        db.session.commit()
        return entity
    
    def commit(self) -> None:
        db.session.commit()