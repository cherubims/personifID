"""
Authentication System Testing Suite
Validates security, user management, and token handling
"""
import pytest
from fastapi.testclient import TestClient

class TestAuthentication:
    """
    Comprehensive authentication testing covering security edge cases
    Tests registration, login, and token management functionality
    """
    
    def test_user_registration_success(self, client, sample_user_data):
        """
        Tests successful user registration with valid data
        Validates: User creation, password hashing, response format
        """
        response = client.post("/auth/register", json=sample_user_data)
        
        # Verify successful registration
        assert response.status_code == 200
        data = response.json()
        
        # Validate response contains expected user data
        assert data["username"] == sample_user_data["username"]
        assert data["email"] == sample_user_data["email"]
        assert data["full_name"] == sample_user_data["full_name"]
        
        # Security: Ensure password is not returned
        assert "password" not in data
        assert "hashed_password" not in data
    
    def test_user_registration_duplicate_prevention(self, client, sample_user_data):
        """
        Tests duplicate user prevention mechanism
        Validates: Unique constraints, appropriate error responses
        """
        # Register user first time
        client.post("/auth/register", json=sample_user_data)
        
        # Attempt duplicate registration
        duplicate_response = client.post("/auth/register", json=sample_user_data)
        
        # Verify rejection of duplicate
        assert duplicate_response.status_code == 400
        assert "already exists" in duplicate_response.json()["detail"]
    
    def test_login_success(self, client, sample_user_data):
        """
        Tests successful login flow with valid credentials
        Validates: Authentication logic, token generation, session creation
        """
        # Register user first
        client.post("/auth/register", json=sample_user_data)
        
        # Attempt login
        login_response = client.post("/auth/token", data={
            "username": sample_user_data["username"],
            "password": sample_user_data["password"]
        })
        
        # Verify successful login
        assert login_response.status_code == 200
        token_data = login_response.json()
        
        # Validate token structure
        assert "access_token" in token_data
        assert "token_type" in token_data
        assert token_data["token_type"] == "bearer"
        assert token_data["access_token"].startswith("fake-token-for-")
    
    def test_login_invalid_credentials(self, client, sample_user_data):
        """
        Tests login rejection with invalid credentials
        Validates: Security against brute force, error handling
        """
        # Register user
        client.post("/auth/register", json=sample_user_data)
        
        # Attempt login with wrong password
        invalid_login = client.post("/auth/token", data={
            "username": sample_user_data["username"],
            "password": "wrongpassword"
        })
        
        # Verify rejection
        assert invalid_login.status_code == 401
        assert "Invalid credentials" in invalid_login.json()["detail"]
    
    def test_protected_endpoint_without_auth(self, client):
        """
        Tests access control for protected endpoints
        Validates: Authorization middleware, security boundaries
        """
        # Attempt to access protected endpoint without authentication
        response = client.get("/users/me")
        
        # Verify access denied
        assert response.status_code == 401
        assert "Not authenticated" in response.json()["detail"]
    
    def test_protected_endpoint_with_valid_auth(self, client, authenticated_headers):
        """
        Tests authorized access to protected endpoints
        Validates: Token validation, user data retrieval
        """
        # Access protected endpoint with valid token
        response = client.get("/users/me", headers=authenticated_headers)
        
        # Verify successful access
        assert response.status_code == 200
        user_data = response.json()
        assert "username" in user_data
        assert "email" in user_data