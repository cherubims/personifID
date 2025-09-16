"""
Context Management Testing Suite
Validates context operations and identity-context associations
"""
import pytest

class TestContextManagement:
    """
    Comprehensive context management testing
    Covers CRUD operations and many-to-many relationships
    """
    
    @pytest.fixture
    def sample_context_data(self):
        """
        Standardized context data for testing
        Includes visual and descriptive metadata
        """
        return {
            "name": "Professional Network",
            "description": "Business contacts and professional networking",
            "icon": "💼",
            "color": "#2563eb"
        }
    
    def test_context_creation(self, client, authenticated_headers, sample_context_data):
        """
        Tests context creation with metadata handling
        Validates: Data persistence, user association, response structure
        """
        response = client.post(
            "/contexts",
            json=sample_context_data,
            headers=authenticated_headers
        )
        
        # Verify successful creation
        assert response.status_code == 201
        context = response.json()
        
        # Validate all fields
        assert context["name"] == sample_context_data["name"]
        assert context["description"] == sample_context_data["description"]
        assert context["icon"] == sample_context_data["icon"]
        assert context["color"] == sample_context_data["color"]
        assert context["identity_count"] == 0  # New context has no identities
    
    def test_identity_context_association(self, client, authenticated_headers, sample_context_data):
        """
        Tests many-to-many relationship management
        Validates: Association logic, duplicate prevention, data integrity
        """
        # Create context
        context_response = client.post(
            "/contexts",
            json=sample_context_data,
            headers=authenticated_headers
        )
        context_id = context_response.json()["id"]
        
        # Create identity
        identity_data = {
            "display_name": "Test Identity",
            "privacy_level": "standard"
        }
        identity_response = client.post(
            "/identities",
            json=identity_data,
            headers=authenticated_headers
        )
        identity_id = identity_response.json()["id"]
        
        # Associate identity with context
        association_response = client.post(
            f"/contexts/{context_id}/identities/{identity_id}",
            headers=authenticated_headers
        )
        
        # Verify successful association
        assert association_response.status_code == 201
        assert "successfully added" in association_response.json()["message"]
        
        # Verify association exists
        context_identities = client.get(
            f"/contexts/{context_id}/identities",
            headers=authenticated_headers
        )
        assert context_identities.status_code == 200
        identities = context_identities.json()
        assert len(identities) == 1
        assert identities[0]["id"] == identity_id
    
    def test_duplicate_association_prevention(self, client, authenticated_headers, sample_context_data):
        """
        Tests idempotent association operations
        Validates: Duplicate prevention, graceful handling, system stability
        """
        # Create context and identity
        context_response = client.post("/contexts", json=sample_context_data, headers=authenticated_headers)
        context_id = context_response.json()["id"]
        
        identity_response = client.post("/identities", json={"display_name": "Test"}, headers=authenticated_headers)
        identity_id = identity_response.json()["id"]
        
        # First association
        client.post(f"/contexts/{context_id}/identities/{identity_id}", headers=authenticated_headers)
        
        # Duplicate association attempt
        duplicate_response = client.post(
            f"/contexts/{context_id}/identities/{identity_id}",
            headers=authenticated_headers
        )
        
        # Verify graceful handling (not an error)
        assert duplicate_response.status_code == 200
        assert "already assigned" in duplicate_response.json()["message"]