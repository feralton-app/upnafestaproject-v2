#!/usr/bin/env python3
"""
Focused Test for Folder ID Bug Fix
Tests the specific endpoints related to google_folder_id persistence after the frontend bug fix
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class FolderIdTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
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
    
    def test_folder_id_persistence(self):
        """Test google_folder_id persistence with empty and non-empty values"""
        print("=== Testing Folder ID Persistence Bug Fix ===")
        
        client_id = "1"
        album_id = "album-ana-carlos-2025"
        
        # Test 1: Update with non-empty value
        print("🔍 Testing with non-empty folder ID...")
        non_empty_value = "TESTE123"
        update_data = {"google_folder_id": non_empty_value}
        
        try:
            response = self.session.put(f"{API_BASE}/clients/{client_id}/albums/{album_id}", json=update_data)
            if response.status_code == 200:
                album_data = response.json()
                returned_folder_id = album_data.get('google_folder_id')
                if returned_folder_id == non_empty_value:
                    self.log_test("PUT Album - Non-empty Folder ID", True, f"Successfully updated to: '{non_empty_value}'")
                else:
                    self.log_test("PUT Album - Non-empty Folder ID", False, f"Expected '{non_empty_value}', got '{returned_folder_id}'")
            else:
                self.log_test("PUT Album - Non-empty Folder ID", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("PUT Album - Non-empty Folder ID", False, f"Error: {str(e)}")
        
        # Test 2: Verify persistence by getting the album
        print("🔍 Verifying non-empty value persistence...")
        try:
            response = self.session.get(f"{API_BASE}/clients/{client_id}/albums")
            if response.status_code == 200:
                albums = response.json()
                target_album = None
                for album in albums:
                    if album.get('id') == album_id:
                        target_album = album
                        break
                
                if target_album:
                    persisted_folder_id = target_album.get('google_folder_id')
                    if persisted_folder_id == non_empty_value:
                        self.log_test("GET Albums - Non-empty Folder ID Persistence", True, f"Value persisted correctly: '{non_empty_value}'")
                    else:
                        self.log_test("GET Albums - Non-empty Folder ID Persistence", False, f"Expected '{non_empty_value}', got '{persisted_folder_id}'")
                else:
                    self.log_test("GET Albums - Non-empty Folder ID Persistence", False, f"Album {album_id} not found")
            else:
                self.log_test("GET Albums - Non-empty Folder ID Persistence", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET Albums - Non-empty Folder ID Persistence", False, f"Error: {str(e)}")
        
        # Test 3: Update with empty string (the critical bug fix test)
        print("🔍 Testing with empty folder ID (critical bug fix)...")
        empty_value = ""
        update_data = {"google_folder_id": empty_value}
        
        try:
            response = self.session.put(f"{API_BASE}/clients/{client_id}/albums/{album_id}", json=update_data)
            if response.status_code == 200:
                album_data = response.json()
                returned_folder_id = album_data.get('google_folder_id')
                if returned_folder_id == empty_value:
                    self.log_test("PUT Album - Empty Folder ID", True, f"Successfully updated to empty string")
                else:
                    self.log_test("PUT Album - Empty Folder ID", False, f"Expected empty string, got '{returned_folder_id}'")
            else:
                self.log_test("PUT Album - Empty Folder ID", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("PUT Album - Empty Folder ID", False, f"Error: {str(e)}")
        
        # Test 4: Verify empty string persistence (the main bug that was fixed)
        print("🔍 Verifying empty string persistence (main bug fix)...")
        try:
            response = self.session.get(f"{API_BASE}/clients/{client_id}/albums")
            if response.status_code == 200:
                albums = response.json()
                target_album = None
                for album in albums:
                    if album.get('id') == album_id:
                        target_album = album
                        break
                
                if target_album:
                    persisted_folder_id = target_album.get('google_folder_id')
                    if persisted_folder_id == empty_value:
                        self.log_test("GET Albums - Empty Folder ID Persistence", True, f"Empty string persisted correctly (BUG FIXED!)")
                    else:
                        self.log_test("GET Albums - Empty Folder ID Persistence", False, f"Expected empty string, got '{persisted_folder_id}' (BUG STILL EXISTS!)")
                else:
                    self.log_test("GET Albums - Empty Folder ID Persistence", False, f"Album {album_id} not found")
            else:
                self.log_test("GET Albums - Empty Folder ID Persistence", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET Albums - Empty Folder ID Persistence", False, f"Error: {str(e)}")
        
        # Test 5: Test with null value (edge case)
        print("🔍 Testing with null folder ID...")
        update_data = {"google_folder_id": None}
        
        try:
            response = self.session.put(f"{API_BASE}/clients/{client_id}/albums/{album_id}", json=update_data)
            if response.status_code == 200:
                album_data = response.json()
                returned_folder_id = album_data.get('google_folder_id')
                self.log_test("PUT Album - Null Folder ID", True, f"Successfully handled null value, returned: '{returned_folder_id}'")
            else:
                self.log_test("PUT Album - Null Folder ID", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("PUT Album - Null Folder ID", False, f"Error: {str(e)}")
    
    def test_database_connectivity(self):
        """Test MariaDB connectivity through API"""
        print("=== Testing MariaDB Connectivity ===")
        
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                self.log_test("MariaDB Connectivity", True, "Backend API responding (MariaDB connection working)")
            else:
                self.log_test("MariaDB Connectivity", False, f"API not responding properly: {response.status_code}")
        except Exception as e:
            self.log_test("MariaDB Connectivity", False, f"Connection error: {str(e)}")
    
    def test_client_and_album_existence(self):
        """Verify that the test client and album exist"""
        print("=== Verifying Test Data Existence ===")
        
        client_id = "1"
        album_id = "album-ana-carlos-2025"
        
        # Check if client exists
        try:
            response = self.session.get(f"{API_BASE}/clients/{client_id}")
            if response.status_code == 200:
                client_data = response.json()
                self.log_test("Client Existence Check", True, f"Client '{client_data.get('name')}' found")
            else:
                self.log_test("Client Existence Check", False, f"Client {client_id} not found: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Client Existence Check", False, f"Error: {str(e)}")
            return False
        
        # Check if album exists
        try:
            response = self.session.get(f"{API_BASE}/clients/{client_id}/albums")
            if response.status_code == 200:
                albums = response.json()
                target_album = None
                for album in albums:
                    if album.get('id') == album_id:
                        target_album = album
                        break
                
                if target_album:
                    self.log_test("Album Existence Check", True, f"Album '{target_album.get('name')}' found")
                    return True
                else:
                    self.log_test("Album Existence Check", False, f"Album {album_id} not found in client's albums")
                    return False
            else:
                self.log_test("Album Existence Check", False, f"Failed to get albums: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Album Existence Check", False, f"Error: {str(e)}")
            return False
    
    def run_folder_id_tests(self):
        """Run all folder ID related tests"""
        print("🚀 Starting Folder ID Bug Fix Tests")
        print("=" * 60)
        print("CONTEXT: Testing the bug fix where empty Folder ID didn't persist after refresh")
        print("=" * 60)
        
        # Test database connectivity
        self.test_database_connectivity()
        
        # Verify test data exists
        if not self.test_client_and_album_existence():
            print("❌ Test data not found - cannot proceed with folder ID tests")
            return
        
        # Run the main folder ID persistence tests
        self.test_folder_id_persistence()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 FOLDER ID BUG FIX TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if "✅ PASS" in result['status'])
        failed = sum(1 for result in self.test_results if "❌ FAIL" in result['status'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {failed} ❌")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Check if the critical bug fix is working
        critical_test_passed = any(
            "Empty Folder ID Persistence" in result['test'] and "✅ PASS" in result['status']
            for result in self.test_results
        )
        
        if critical_test_passed:
            print("\n🎉 CRITICAL BUG FIX VERIFIED: Empty Folder ID now persists correctly!")
        else:
            print("\n⚠️  CRITICAL BUG STILL EXISTS: Empty Folder ID persistence issue not resolved!")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result['status']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        
        return {
            'total': total,
            'passed': passed,
            'failed': failed,
            'success_rate': (passed/total)*100,
            'critical_bug_fixed': critical_test_passed,
            'failed_tests': [r for r in self.test_results if "❌ FAIL" in r['status']]
        }

if __name__ == "__main__":
    tester = FolderIdTester()
    tester.run_folder_id_tests()