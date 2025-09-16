# init_db.py

from sqlalchemy import text
from app.database import engine, Base

def create_privacy_enum():
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'privacylevel');")
        )
        exists = result.scalar()
        if not exists:
            print("Creating ENUM type 'privacylevel'...")
            conn.execute(text("CREATE TYPE privacylevel AS ENUM ('MINIMAL', 'STANDARD', 'HIGH');"))
        else:
            print("ENUM type 'privacylevel' already exists.")

def create_all_tables():
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully.")

if __name__ == "__main__":
    create_privacy_enum()
    create_all_tables()
"""
Initialize the database tables.
Run this script to create all tables in the database.
"""

from app.database import engine, Base
from app.models import user, identity, context, identity_context  # Import all models

def init_db():
    """Create all tables in the database."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
