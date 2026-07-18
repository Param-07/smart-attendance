from flask.cli import with_appcontext
import click

from app.extensions import db
from app.models.account import Account
from app.core.enums import (
    UserRole,
    AccountStatus,
)
from app.modules.authentication.utils import AuthUtils

@click.command("create-admin")
@with_appcontext
def create_admin():
    """Create the initial administrator account."""

    existing = Account.query.filter_by(
    username="admin"
    ).first()

    if existing:
        click.echo("Admin already exists.")
        return
    
    admin = Account(
    username="admin",
    password_hash=AuthUtils.hash_password("Admin@123"),
    role=UserRole.ADMIN,
    account_status=AccountStatus.ACTIVE,
    )

    db.session.add(admin)
    db.session.commit()

    click.echo("Admin created successfully.")