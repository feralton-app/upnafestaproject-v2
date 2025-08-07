#!/usr/bin/env python3
"""
Backend Test Suite for UpnaFesta Google Drive API Integration
Tests all backend endpoints and database functionality
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class UpnaFestaBackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_clients = []
        self.created_albums = []
        
    def log_test(self, test_name, success, message="", details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'status': status,
            'message': message,
            'details': details
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if message:
            print(f"    {message}")
        if details and not success:
            print(f"    Details: {details}")
        print()
    
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Basic API Connectivity", True, f"API responded: {data.get('message', 'OK')}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_google_config_endpoints(self):
        """Test Google Cloud API configuration endpoints"""
        print("=== Testing Google Config Endpoints ===")
        
        # Test GET config (should be empty initially)
        try:
            response = self.session.get(f"{API_BASE}/admin/google-config")
            if response.status_code == 200:
                config = response.json()
                self.log_test("GET Google Config (empty)", True, f"Config: {config}")
            else:
                self.log_test("GET Google Config (empty)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET Google Config (empty)", False, f"Error: {str(e)}")
        
        # Test POST config (create new config)
        test_config = {
            "client_id": "test-client-id-123456789.apps.googleusercontent.com",
            "client_secret": "test-client-secret-GOCSPX-abcdef123456",
            "redirect_uri": f"{BACKEND_URL}/api/auth/google/callback"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/admin/google-config", json=test_config)
            if response.status_code == 200:
                config = response.json()
                self.log_test("POST Google Config", True, f"Created config ID: {config.get('id')}")
                self.test_config_id = config.get('id')
            else:
                self.log_test("POST Google Config", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST Google Config", False, f"Error: {str(e)}")
        
        # Test GET config (should return the created config)
        try:
            response = self.session.get(f"{API_BASE}/admin/google-config")
            if response.status_code == 200:
                config = response.json()
                if config and config.get('client_id') == test_config['client_id']:
                    self.log_test("GET Google Config (with data)", True, f"Retrieved config for client_id: {config.get('client_id')}")
                else:
                    self.log_test("GET Google Config (with data)", False, "Config not found or incorrect")
            else:
                self.log_test("GET Google Config (with data)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET Google Config (with data)", False, f"Error: {str(e)}")
        
        # Test GET redirect URIs
        try:
            response = self.session.get(f"{API_BASE}/admin/google-redirect-uris")
            if response.status_code == 200:
                uris_info = response.json()
                if 'authorized_redirect_uris' in uris_info:
                    self.log_test("GET Google Redirect URIs", True, f"Found {len(uris_info['authorized_redirect_uris'])} redirect URIs")
                else:
                    self.log_test("GET Google Redirect URIs", False, "Missing redirect URIs in response")
            else:
                self.log_test("GET Google Redirect URIs", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET Google Redirect URIs", False, f"Error: {str(e)}")
    
    def test_client_management_endpoints(self):
        """Test client management endpoints"""
        print("=== Testing Client Management Endpoints ===")
        
        # Test POST client (create new client)
        test_client = {
            "name": "João Silva",
            "email": f"joao.silva.{uuid.uuid4().hex[:8]}@email.com",
            "album_limit": 2
        }
        
        try:
            response = self.session.post(f"{API_BASE}/admin/clients", json=test_client)
            if response.status_code == 200:
                client = response.json()
                self.log_test("POST Create Client", True, f"Created client: {client.get('name')} (ID: {client.get('id')})")
                self.created_clients.append(client)
                self.test_client_id = client.get('id')
            else:
                self.log_test("POST Create Client", False, f"Status: {response.status_code}, Response: {response.text}")
                return
        except Exception as e:
            self.log_test("POST Create Client", False, f"Error: {str(e)}")
            return
        
        # Test GET all clients
        try:
            response = self.session.get(f"{API_BASE}/admin/clients")
            if response.status_code == 200:
                clients = response.json()
                if isinstance(clients, list) and len(clients) > 0:
                    self.log_test("GET All Clients", True, f"Found {len(clients)} clients")
                else:
                    self.log_test("GET All Clients", False, "No clients found or invalid response")
            else:
                self.log_test("GET All Clients", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET All Clients", False, f"Error: {str(e)}")
        
        # Test GET specific client
        if hasattr(self, 'test_client_id'):
            try:
                response = self.session.get(f"{API_BASE}/clients/{self.test_client_id}")
                if response.status_code == 200:
                    client = response.json()
                    if client.get('id') == self.test_client_id:
                        self.log_test("GET Specific Client", True, f"Retrieved client: {client.get('name')}")
                    else:
                        self.log_test("GET Specific Client", False, "Client ID mismatch")
                else:
                    self.log_test("GET Specific Client", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("GET Specific Client", False, f"Error: {str(e)}")
        
        # Test GET non-existent client
        fake_id = str(uuid.uuid4())
        try:
            response = self.session.get(f"{API_BASE}/clients/{fake_id}")
            if response.status_code == 404:
                self.log_test("GET Non-existent Client", True, "Correctly returned 404 for non-existent client")
            else:
                self.log_test("GET Non-existent Client", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("GET Non-existent Client", False, f"Error: {str(e)}")
    
    def test_album_management_endpoints(self):
        """Test album management endpoints"""
        print("=== Testing Album Management Endpoints ===")
        
        if not hasattr(self, 'test_client_id'):
            self.log_test("Album Tests", False, "No test client available - skipping album tests")
            return
        
        # First, approve the client for album creation
        # Note: This would normally require payment approval, but we'll test the endpoint behavior
        
        # Test POST album (should fail for pending_payment client)
        test_album = {
            "name": "Casamento João e Maria",
            "event_date": "2024-06-15T18:00:00"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/clients/{self.test_client_id}/albums", json=test_album)
            if response.status_code == 400:
                error_detail = response.json().get('detail', '')
                if 'pagamento aprovado' in error_detail or 'payment' in error_detail.lower():
                    self.log_test("POST Album (pending payment)", True, "Correctly blocked album creation for pending payment client")
                else:
                    self.log_test("POST Album (pending payment)", False, f"Unexpected error: {error_detail}")
            else:
                self.log_test("POST Album (pending payment)", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("POST Album (pending payment)", False, f"Error: {str(e)}")
        
        # Test GET albums for client (should work even with pending payment)
        try:
            response = self.session.get(f"{API_BASE}/clients/{self.test_client_id}/albums")
            if response.status_code == 200:
                albums = response.json()
                if isinstance(albums, list):
                    self.log_test("GET Client Albums", True, f"Retrieved {len(albums)} albums for client")
                else:
                    self.log_test("GET Client Albums", False, "Invalid response format")
            else:
                self.log_test("GET Client Albums", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET Client Albums", False, f"Error: {str(e)}")
        
        # Test album creation with non-existent client
        fake_client_id = str(uuid.uuid4())
        try:
            response = self.session.post(f"{API_BASE}/clients/{fake_client_id}/albums", json=test_album)
            if response.status_code == 404:
                self.log_test("POST Album (non-existent client)", True, "Correctly returned 404 for non-existent client")
            else:
                self.log_test("POST Album (non-existent client)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("POST Album (non-existent client)", False, f"Error: {str(e)}")
        
        # Test PUT album update (should fail for non-existent album)
        fake_album_id = str(uuid.uuid4())
        album_update = {
            "event_date": "2024-07-20T19:00:00",
            "primary_color": "#FF5733"
        }
        
        try:
            response = self.session.put(f"{API_BASE}/clients/{self.test_client_id}/albums/{fake_album_id}", json=album_update)
            if response.status_code == 404:
                self.log_test("PUT Album Update (non-existent)", True, "Correctly returned 404 for non-existent album")
            else:
                self.log_test("PUT Album Update (non-existent)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("PUT Album Update (non-existent)", False, f"Error: {str(e)}")
    
    def test_oauth_endpoints(self):
        """Test OAuth Google Drive endpoints"""
        print("=== Testing OAuth Endpoints ===")
        
        if not hasattr(self, 'test_client_id'):
            self.log_test("OAuth Tests", False, "No test client available - skipping OAuth tests")
            return
        
        # Test GET authorization URL
        try:
            response = self.session.get(f"{API_BASE}/auth/google/authorize/{self.test_client_id}")
            if response.status_code == 200:
                auth_data = response.json()
                if 'auth_url' in auth_data and 'state' in auth_data:
                    self.log_test("GET Google Authorization URL", True, f"Generated auth URL with state: {auth_data.get('state')}")
                    # Verify the auth URL contains expected Google OAuth parameters
                    auth_url = auth_data.get('auth_url', '')
                    if 'accounts.google.com' in auth_url and 'client_id' in auth_url:
                        self.log_test("Google Auth URL Validation", True, "Auth URL contains expected Google OAuth parameters")
                    else:
                        self.log_test("Google Auth URL Validation", False, "Auth URL missing expected parameters")
                else:
                    self.log_test("GET Google Authorization URL", False, "Missing auth_url or state in response")
            else:
                self.log_test("GET Google Authorization URL", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("GET Google Authorization URL", False, f"Error: {str(e)}")
        
        # Test authorization with non-existent client
        fake_client_id = str(uuid.uuid4())
        try:
            response = self.session.get(f"{API_BASE}/auth/google/authorize/{fake_client_id}")
            if response.status_code == 404:
                self.log_test("GET Auth URL (non-existent client)", True, "Correctly returned 404 for non-existent client")
            else:
                self.log_test("GET Auth URL (non-existent client)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("GET Auth URL (non-existent client)", False, f"Error: {str(e)}")
        
        # Test OAuth callback (should fail without proper code/state)
        try:
            response = self.session.get(f"{API_BASE}/auth/google/callback?code=invalid&state=invalid")
            if response.status_code == 400:
                self.log_test("GET OAuth Callback (invalid)", True, "Correctly rejected invalid OAuth callback")
            else:
                self.log_test("GET OAuth Callback (invalid)", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("GET OAuth Callback (invalid)", False, f"Error: {str(e)}")
        
        # Test disconnect Google (should work even without connection)
        try:
            response = self.session.delete(f"{API_BASE}/clients/{self.test_client_id}/google-connection")
            if response.status_code in [200, 400]:  # 400 is acceptable if no connection exists
                if response.status_code == 200:
                    self.log_test("DELETE Google Connection", True, "Successfully processed disconnect request")
                else:
                    result = response.json()
                    if 'desconectar' in result.get('detail', '').lower():
                        self.log_test("DELETE Google Connection", True, "Correctly handled disconnect for unconnected client")
                    else:
                        self.log_test("DELETE Google Connection", False, f"Unexpected error: {result.get('detail')}")
            else:
                self.log_test("DELETE Google Connection", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("DELETE Google Connection", False, f"Error: {str(e)}")
    
    def test_database_structure(self):
        """Test if database tables were created by checking endpoint responses"""
        print("=== Testing Database Structure (via API) ===")
        
        # The database structure is validated indirectly through successful API calls
        # If we've successfully created clients and configs, the tables exist
        
        success_count = sum(1 for result in self.test_results if "✅ PASS" in result['status'])
        total_count = len(self.test_results)
        
        if success_count > total_count * 0.7:  # If more than 70% of tests passed
            self.log_test("Database Structure", True, f"Database appears functional - {success_count}/{total_count} tests passed")
        else:
            self.log_test("Database Structure", False, f"Database may have issues - only {success_count}/{total_count} tests passed")
    
    def test_file_upload_endpoint(self):
        """Test file upload endpoint (without actual Google Drive connection)"""
        print("=== Testing File Upload Endpoint ===")
        
        # Create a fake album ID for testing
        fake_album_id = str(uuid.uuid4())
        
        # Test upload to non-existent album
        try:
            files = {'file': ('test.jpg', b'fake image data', 'image/jpeg')}
            data = {'guest_name': 'Maria Santos', 'comment': 'Foto linda do casamento!'}
            
            response = self.session.post(f"{API_BASE}/albums/{fake_album_id}/upload", files=files, data=data)
            if response.status_code == 404:
                self.log_test("POST File Upload (non-existent album)", True, "Correctly returned 404 for non-existent album")
            else:
                self.log_test("POST File Upload (non-existent album)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("POST File Upload (non-existent album)", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting UpnaFesta Backend API Tests")
        print("=" * 50)
        
        # Test basic connectivity first
        if not self.test_basic_connectivity():
            print("❌ Basic connectivity failed - stopping tests")
            return
        
        # Run all test suites
        self.test_google_config_endpoints()
        self.test_client_management_endpoints()
        self.test_album_management_endpoints()
        self.test_oauth_endpoints()
        self.test_file_upload_endpoint()
        self.test_database_structure()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in self.test_results if "✅ PASS" in result['status'])
        failed = sum(1 for result in self.test_results if "❌ FAIL" in result['status'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {failed} ❌")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result['status']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 50)
        
        # Return summary for test_result.md
        return {
            'total': total,
            'passed': passed,
            'failed': failed,
            'success_rate': (passed/total)*100,
            'failed_tests': [r for r in self.test_results if "❌ FAIL" in r['status']]
        }

if __name__ == "__main__":
    tester = UpnaFestaBackendTester()
    tester.run_all_tests()