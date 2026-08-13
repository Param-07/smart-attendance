"""add super admin and school admin roles

Revision ID: ac9cf3576973
Revises: 79516a26916e
Create Date: 2026-08-13 23:15:46.822396

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "ac9cf3576973"
down_revision = "79516a26916e"
branch_labels = None
depends_on = None


def upgrade():
    # -----------------------------------------------------
    # Update PostgreSQL user_role enum
    # -----------------------------------------------------
    #
    # PostgreSQL does not support removing an enum value.
    # Since the database currently contains no account data,
    # recreate the enum type safely.
    #

    op.execute(
        "ALTER TYPE user_role RENAME TO user_role_old"
    )

    op.execute(
        """
        CREATE TYPE user_role AS ENUM (
            'SUPER_ADMIN',
            'SCHOOL_ADMIN',
            'TEACHER'
        )
        """
    )

    op.execute(
        """
        ALTER TABLE accounts
        ALTER COLUMN role
        TYPE user_role
        USING role::text::user_role
        """
    )

    op.execute(
        "DROP TYPE user_role_old"
    )

    # -----------------------------------------------------
    # Make school_id nullable
    # -----------------------------------------------------

    op.alter_column(
        "accounts",
        "school_id",
        existing_type=sa.BIGINT(),
        nullable=True,
    )

    # -----------------------------------------------------
    # Enforce role / school relationship
    # -----------------------------------------------------

    op.create_check_constraint(
        "ck_account_role_school",
        "accounts",
        """
        (
            role = 'SUPER_ADMIN'
            AND school_id IS NULL
        )
        OR
        (
            role IN ('SCHOOL_ADMIN', 'TEACHER')
            AND school_id IS NOT NULL
        )
        """,
    )


def downgrade():

    # -----------------------------------------------------
    # Remove role / school constraint
    # -----------------------------------------------------

    op.drop_constraint(
        "ck_account_role_school",
        "accounts",
        type_="check",
    )

    # -----------------------------------------------------
    # Recreate previous user_role enum
    # -----------------------------------------------------

    op.execute(
        "ALTER TYPE user_role RENAME TO user_role_new"
    )

    op.execute(
        """
        CREATE TYPE user_role AS ENUM (
            'ADMIN',
            'TEACHER'
        )
        """
    )

    op.execute(
        """
        ALTER TABLE accounts
        ALTER COLUMN role
        TYPE user_role
        USING role::text::user_role
        """
    )

    op.execute(
        "DROP TYPE user_role_new"
    )

    # -----------------------------------------------------
    # Restore school_id requirement
    # -----------------------------------------------------

    op.alter_column(
        "accounts",
        "school_id",
        existing_type=sa.BIGINT(),
        nullable=False,
    )