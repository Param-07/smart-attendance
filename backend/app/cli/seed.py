from flask.cli import with_appcontext
import click

from app.extensions import db
from app.models.account import Account
from app.core.enums import (
    UserRole,
    AccountStatus,
)
from app.modules.authentication.utils import AuthUtils


@click.command("create-super-admin")
@with_appcontext
def create_super_admin():
    """
    Create the initial Super Admin account.
    """

    username = click.prompt(
        "Super Admin username",
        type=str,
    ).strip()

    existing = Account.query.filter_by(
        username=username
    ).first()

    if existing:
        click.echo(
            "An account with this username already exists."
        )
        return

    password = click.prompt(
        "Super Admin password",
        confirmation_prompt=True,
    )

    account = Account(
        username=username,
        password_hash=AuthUtils.hash_password(
            password
        ),
        role=UserRole.SUPER_ADMIN,
        account_status=AccountStatus.ACTIVE,
        password_reset_required=False,
        school_id=None,
    )

    try:
        db.session.add(account)
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise

    click.echo(
        f"Super Admin '{username}' created successfully."
    )