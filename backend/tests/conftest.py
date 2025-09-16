"""
PersonifID test infrastructure for backend API testing
"""
import pytest
import asyncio
import sys
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to Python path to import from app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try different import paths to find your main app
try:
    from app.main import app, get_db, Base
except ImportError:
    try:
        from app import app, get_db, Base
    except ImportError:
        # If your main file is actually named differently
        print("Please check your app structure. Looking for app imports...")
        print("Current directory:", os.getcwd())
        print("Available files:", os.listdir('.'))
        if os.path.exists('app'):
            print("App directory contents:", os.listdir('app'))
        raise ImportError("Could not find FastAPI app. Please check import path.")

# Test database configuration for isolation
TEST_DATABASE_URL = "sqlite:///./test_personifid.db"

@pytest.fixture(scope="session")
def test_engine():
    """
    Creates isolated test database engine
    Ensures tests don't interfere with production data
    """
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    # Cleanup: Remove test database after all tests
    if os.path.exists("./test_personifid.db"):
        os.remove("./test_personifid.db")

@pytest.fixture(scope="function")
def test_db(test_engine):
    """
    Provides fresh database session for each test
    Implements transaction rollback for test isolation
    """
    # Create fresh tables for each test
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Clean up after test
        session.rollback()

@pytest.fixture(scope="function")
def client(test_db):
    """
    FastAPI test client with database dependency override
    Enables comprehensive API endpoint testing
    """
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture
def sample_user_data():
    """
    Standardized test user data for consistent testing
    Reduces test data duplication and ensures valid inputs
    """
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepassword123",
        "full_name": "Test User"
    }

@pytest.fixture
def authenticated_headers(client, sample_user_data):
    """
    Provides authentication headers for protected endpoint testing
    Simulates real user authentication flow
    """
    # Register user
    client.post("/auth/register", json=sample_user_data)
    
    # Login to get token
    login_response = client.post("/auth/token", data={
        "username": sample_user_data["username"],
        "password": sample_user_data["password"]
    })
    token = login_response.json()["access_token"]
    
    return {"Authorization": f"Bearer {token}"}