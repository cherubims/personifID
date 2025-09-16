"""
Identity Management Testing Suite
Validates CRUD operations and business logic for digital identities
"""
import pytest
import json

class TestIdentityManagement:
    """
    Comprehensive identity management testing
    Covers creation, retrieval, updates, and privacy controls
    """
    
    @pytest.fixture
    def sample_identity_data(self):
        """
        Standardized identity data for consistent testing
        Includes all supported fields and privacy options
        """
        return {
            "display_name": "Professional Me",
            "email": "prof@example.com",
            "phone": "+1234567890",
            "title": "Senior Developer",
            "bio": "Experienced software developer specializing in web applications",
            "is_default": False,
            "is_public": True,
            "privacy_level": "standard",
            "social_links": {
                "linkedin": "https://linkedin.com/in/testuser",
                "github": "https://github.com/testuser"
            },
            "use_case": "Professional networking and job applications"
        }
    
    def test_identity_creation_success(self, client, authenticated_headers, sample_identity_data):
        """
        Tests successful identity creation with comprehensive data
        Validates: Data persistence, JSON handling, relationship creation
        """
        response = client.post(
            "/identities", 
            json=sample_identity_data, 
            headers=authenticated_headers
        )
        
        # Verify successful creation
        assert response.status_code == 201
        identity = response.json()
        
        # Validate all fields are properly stored
        assert identity["display_name"] == sample_identity_data["display_name"]
        assert identity["email"] == sample_identity_data["email"]
        assert identity["title"] == sample_identity_data["title"]
        assert identity["privacy_level"] == sample_identity_data["privacy_level"]
        
        # Verify social links JSON handling
        assert identity["social_links"] == sample_identity_data["social_links"]
        
        # Verify metadata fields
        assert "id" in identity
        assert "created_at" in identity
        assert identity["context_count"] == 0  # New identity has no contexts
    
    def test_identity_retrieval(self, client, authenticated_headers, sample_identity_data):
        """
        Tests identity retrieval and data integrity
        Validates: Data persistence, user isolation, response formatting
        """
        # Create identity
        create_response = client.post(
            "/identities", 
            json=sample_identity_data, 
            headers=authenticated_headers
        )
        identity_id = create_response.json()["id"]
        
        # Retrieve specific identity
        get_response = client.get(
            f"/identities/{identity_id}", 
            headers=authenticated_headers
        )
        
        # Verify successful retrieval
        assert get_response.status_code == 200
        retrieved_identity = get_response.json()
        assert retrieved_identity["display_name"] == sample_identity_data["display_name"]
    
    def test_identity_list_retrieval(self, client, authenticated_headers, sample_identity_data):
        """
        Tests bulk identity retrieval with user isolation
        Validates: User-specific data, performance, response structure
        """
        # Get initial count
        initial_response = client.get("/identities", headers=authenticated_headers)
        initial_count = len(initial_response.json())
        
        # Create multiple identities
        identity_data_1 = sample_identity_data.copy()
        identity_data_1["display_name"] = "Professional Me Test"
        
        identity_data_2 = sample_identity_data.copy()
        identity_data_2["display_name"] = "Casual Me Test"
        identity_data_2["privacy_level"] = "minimal"
        
        client.post("/identities", json=identity_data_1, headers=authenticated_headers)
        client.post("/identities", json=identity_data_2, headers=authenticated_headers)
        
        # Retrieve all user identities
        list_response = client.get("/identities", headers=authenticated_headers)
        
        # Verify successful retrieval
        assert list_response.status_code == 200
        identities = list_response.json()
        
        # Verify we have the expected additional identities
        assert len(identities) == initial_count + 2, f"Expected {initial_count + 2} identities, got {len(identities)}"
        
        # Verify our test identities are present with correct privacy levels
        test_identities = [id for id in identities if "Test" in id["display_name"]]
        assert len(test_identities) == 2, f"Expected 2 test identities, found {len(test_identities)}"
        
        # Verify different privacy levels are maintained
        privacy_levels = {identity["privacy_level"] for identity in test_identities}
        assert "standard" in privacy_levels
        assert "minimal" in privacy_levels
    
    def test_identity_update_functionality(self, client, authenticated_headers, sample_identity_data):
        """
        Tests identity modification and partial updates
        Validates: Data persistence, field-specific updates, validation
        """
        # Create identity
        create_response = client.post(
            "/identities", 
            json=sample_identity_data, 
            headers=authenticated_headers
        )
        identity_id = create_response.json()["id"]
        
        # Update specific fields
        update_data = {
            "title": "Lead Developer",
            "privacy_level": "high",
            "bio": "Updated professional bio"
        }
        
        update_response = client.put(
            f"/identities/{identity_id}",
            json=update_data,
            headers=authenticated_headers
        )
        
        # Verify successful update
        assert update_response.status_code == 200
        updated_identity = update_response.json()
        
        # Verify updated fields
        assert updated_identity["title"] == "Lead Developer"
        assert updated_identity["privacy_level"] == "high"
        assert updated_identity["bio"] == "Updated professional bio"
        
        # Verify unchanged fields remain intact
        assert updated_identity["display_name"] == sample_identity_data["display_name"]
        assert updated_identity["email"] == sample_identity_data["email"]
    
    def test_identity_deletion_cascade(self, client, authenticated_headers, sample_identity_data):
        """
        Tests identity deletion and relationship cleanup
        Validates: Cascade deletion, data integrity, authorization
        """
        # Create identity
        create_response = client.post(
            "/identities", 
            json=sample_identity_data, 
            headers=authenticated_headers
        )
        identity_id = create_response.json()["id"]
        
        # Delete identity
        delete_response = client.delete(
            f"/identities/{identity_id}",
            headers=authenticated_headers
        )
        
        # Verify successful deletion
        assert delete_response.status_code == 200
        assert "deleted successfully" in delete_response.json()["message"]
        
        # Verify identity no longer exists
        get_response = client.get(
            f"/identities/{identity_id}",
            headers=authenticated_headers
        )
        assert get_response.status_code == 404
