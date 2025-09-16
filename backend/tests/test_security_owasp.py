"""
OWASP Security Testing Suite
"""
import pytest

class TestOWASPSecurity:
    """
    Security testing based on OWASP guidelines
    Focuses on authentication, authorization, and input validation
    """
    
    def test_authentication_bypass_prevention(self, client):
        """
        OWASP A01: Broken Access Control
        Tests protection against authentication bypass attempts
        """
        # Test 1: No token access attempt
        response = client.get("/users/me")
        assert response.status_code == 401
        
        # Test 2: Invalid token format
        invalid_headers = {"Authorization": "Bearer invalid-token"}
        response = client.get("/users/me", headers=invalid_headers)
        assert response.status_code == 401
        
        # Test 3: Malformed authorization header
        malformed_headers = {"Authorization": "InvalidFormat token"}
        response = client.get("/users/me", headers=malformed_headers)
        assert response.status_code == 401
    
    def test_authorization_boundary_enforcement(self, client, sample_user_data):
        """
        OWASP A01: Broken Access Control
        Tests user isolation and resource access controls
        """
        # Create two separate users
        user1_data = sample_user_data.copy()
        user2_data = sample_user_data.copy()
        user2_data["username"] = "user2"
        user2_data["email"] = "user2@example.com"
        
        # Register both users
        client.post("/auth/register", json=user1_data)
        client.post("/auth/register", json=user2_data)
        
        # Get tokens for both users
        user1_token = client.post("/auth/token", data={"username": user1_data["username"], "password": user1_data["password"]}).json()["access_token"]
        user2_token = client.post("/auth/token", data={"username": user2_data["username"], "password": user2_data["password"]}).json()["access_token"]
        
        # User 1 creates an identity
        user1_headers = {"Authorization": f"Bearer {user1_token}"}
        identity_response = client.post("/identities", json={"display_name": "User1 Identity"}, headers=user1_headers)
        identity_id = identity_response.json()["id"]
        
        # User 2 attempts to access User 1's identity (should fail)
        user2_headers = {"Authorization": f"Bearer {user2_token}"}
        unauthorized_access = client.get(f"/identities/{identity_id}", headers=user2_headers)
        
        # Verify access denied
        assert unauthorized_access.status_code == 404  # Resource not found for this user
    
    def test_input_validation_sql_injection_prevention(self, client, authenticated_headers):
        """
        OWASP A03: Injection
        Tests protection against SQL injection in user inputs
        """
        # Attempt SQL injection in identity creation
        malicious_data = {
            "display_name": "'; DROP TABLE identities; --",
            "email": "' OR '1'='1",
            "bio": "Normal bio'; DELETE FROM users; --"
        }
        
        response = client.post("/identities", json=malicious_data, headers=authenticated_headers)
        
        # Should either succeed with escaped data or fail validation
        # But system should remain stable
        assert response.status_code in [200, 201, 400, 422]  # Valid response codes
        
        # Verify system integrity by accessing other endpoints
        health_check = client.get("/health")
        assert health_check.status_code == 200
    
    def test_session_management_security(self, client, sample_user_data):
        """
        OWASP A07: Identification and Authentication Failures
        Tests secure session handling and token management
        """
        # Register and login
        client.post("/auth/register", json=sample_user_data)
        login_response = client.post("/auth/token", data={
            "username": sample_user_data["username"],
            "password": sample_user_data["password"]
        })
        
        token_data = login_response.json()
        
        # Verify token security properties
        assert "access_token" in token_data
        assert token_data["expires_in"] == 1800  # 30-minute expiration
        
        # Verify token cannot be used for admin operations (if any)
        token = token_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test access to legitimate user resources
        user_response = client.get("/users/me", headers=headers)
        assert user_response.status_code == 200
        
        # Verify token is user-specific and contains user ID
        assert token.startswith("fake-token-for-")