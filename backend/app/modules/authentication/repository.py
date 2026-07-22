from __future__ import annotations
from datetime import datetime

from app.extensions import db
from app.models.account import Account
from app.core.enums import AccountStatus
from app.modules.common.database.base_repository import BaseRepository

class AuthRepository(BaseRepository[Account]):
    """
    Repository responsible for authentication related
    database operations.
    """

    def __init__(self):
        super().__init__(Account)

    def get_by_username(self, username: str) -> Account | None:
        return (
            db.session.query(Account)
                .filter(Account.username == username)
                .first()
        )
    
    def update_last_login(self, account: Account, ip_address: str | None = None) -> None:
        account.last_login = datetime.now()
        account.last_login_ip = ip_address

    def increment_failed_attempts(self, account: Account) -> None:
        account.failed_login_attempts += 1

    def reset_failed_attempts(self, account: Account) -> None:
        account.failed_login_attempts = 0

    def lock_account(self, account: Account):
        account.account_status = AccountStatus.LOCKED

    def unlock_account(self, account: Account) -> None:
        account.account_status = AccountStatus.ACTIVE
        account.failed_login_attempts = 0

    def disable_account(self, account: Account) -> None:
        account.account_status = AccountStatus.DISABLED