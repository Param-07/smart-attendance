from dataclasses import dataclass
from math import ceil
from typing import Generic, TypeVar

T = TypeVar("T")


@dataclass
class PaginationResult(Generic[T]):
    items: list[T]
    page: int
    page_size: int
    total_records: int

    @property
    def total_pages(self) -> int:
        if self.total_records == 0:
            return 0
        return ceil(self.total_records / self.page_size)

    @property
    def has_next(self) -> bool:
        return self.page < self.total_pages

    @property
    def has_previous(self) -> bool:
        return self.page > 1