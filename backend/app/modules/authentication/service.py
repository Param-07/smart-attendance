from __future__ import annotations

from flask import current_app

from app.core.enums import AccountStatus

from .exceptions import (
    AccountDisabledException,
    AccountLockedException,
    InvalidCredentialsException,
)
from .repository import AuthRepository
from .utils import AuthUtils
from app.modules.common.http.request_context import RequestContext
from app.models.account import Account


class AuthService:

    MAX_FAILED_ATTEMPTS = 5

    def __init__(
        self,
        repository: AuthRepository | None = None,
    ) -> None:
        self.repository = repository or AuthRepository()

    def login(
        self,
        username: str,
        password: str,
        ip_address: str | None = None,
    ) -> dict:
        try:
            account = self.repository.get_by_username(username)

            if account is None:
                raise InvalidCredentialsException()
            if account.account_status == AccountStatus.LOCKED:
                raise AccountLockedException()
            if account.account_status == AccountStatus.DISABLED:
                raise AccountDisabledException()

            is_valid = AuthUtils.verify_password(
                password=password,
                password_hash=account.password_hash,
            )

            if not is_valid:
                self.repository.increment_failed_attempts(account)

                if (
                    account.failed_login_attempts
                    >= self.MAX_FAILED_ATTEMPTS
                ):
                    self.repository.lock_account(account)

                self.repository.commit()
                raise InvalidCredentialsException()

            self.repository.reset_failed_attempts(account)
            self.repository.update_last_login(
                account=account,
                ip_address=ip_address,
            )

            access_token = AuthUtils.generate_access_token(account)
            refresh_token = AuthUtils.generate_refresh_token(account)

            self.repository.commit()

            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "Bearer",
                "expires_in": int(
                    current_app.config[
                        "JWT_ACCESS_TOKEN_EXPIRES"
                    ].total_seconds()
                ),
            }

        except (
            InvalidCredentialsException,
            AccountLockedException,
            AccountDisabledException,
        ):
            self.repository.rollback()
            raise

        except Exception:
            self.repository.rollback()
            raise

    def get_current_user(self) -> Account:

        public_uuid = RequestContext.get_identity()

        account = self.repository.get_by_public_uuid(public_uuid)

        if account is None:
            raise InvalidCredentialsException()
        if account.account_status == AccountStatus.LOCKED:
            raise AccountLockedException()
        if account.account_status == AccountStatus.DISABLED:
            raise AccountDisabledException()

        return account
    
    def refresh_token(self):
        
        public_uuid = RequestContext.get_identity()

        account = self.repository.get_by_public_uuid(public_uuid)

        if account is None:
            raise InvalidCredentialsException()
        if account.account_status == AccountStatus.LOCKED:
            raise AccountLockedException()
        if account.account_status == AccountStatus.DISABLED:
            raise AccountDisabledException()
        
        access_token = AuthUtils.generate_access_token(account)

        return {
            "access_token": access_token,
            "expires_in": 900
        }
