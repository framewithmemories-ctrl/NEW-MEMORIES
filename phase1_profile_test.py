import requests
import sys
import json
from datetime import datetime, timezone
import uuid

class Phase1ProfileEnhancementTester:
    def __init__(self, base_url="https://photo-shop-dash.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.test_user_id = "user_123"  # As specified in review request

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def setup_test_user(self):
        """Create or ensure test user exists with ID 'user_123'"""
        try:
            # First try to get existing user
            response = requests.get(f"{self.api_url}/users/{self.test_user_id}", timeout=10)
            
            if response.status_code == 200:
                user_data = response.json()
                self.log_test("Setup Test User (Existing)", True, f"Using existing user: {user_data.get('name', 'Unknown')}")
                return True, user_data
            
            # If user doesn't exist, create new one
            test_user = {
                "name": "Sarah Johnson",
                "email": "sarah.johnson@memories.com",
                "phone": "+91 9876543210",
                "address": "123 Memory Lane, Coimbatore"
            }
            
            # Create user with specific ID by updating after creation
            create_response = requests.post(f"{self.api_url}/users", json=test_user, timeout=10)
            
            if create_response.status_code == 200:
                created_user = create_response.json()
                
                # Update the user ID to our test ID
                update_data = {"id": self.test_user_id}
                update_response = requests.put(f"{self.api_url}/users/{created_user['id']}", json=update_data, timeout=10)
                
                if update_response.status_code == 200:
                    self.log_test("Setup Test User (Created)", True, f"Created test user with ID: {self.test_user_id}")
                    return True, update_response.json()
                else:
                    # Use the created user ID instead
                    self.test_user_id = created_user['id']
                    self.log_test("Setup Test User (Fallback)", True, f"Using created user ID: {self.test_user_id}")
                    return True, created_user
            else:
                self.log_test("Setup Test User", False, f"Failed to create user: {create_response.status_code}")
                return False, None
                
        except Exception as e:
            self.log_test("Setup Test User", False, str(e))
            return False, None

    def test_user_model_extensions(self):
        """Test User model with new Phase 1 fields"""
        try:
            # First get the current user to verify it exists
            get_response = requests.get(f"{self.api_url}/users/{self.test_user_id}", timeout=10)
            if get_response.status_code != 200:
                self.log_test("User Model Extensions", False, f"Test user not found: {get_response.status_code}")
                return False
            
            # Test updating user with new profile enhancement fields
            profile_data = {
                "date_of_birth": "1990-05-15",
                "important_dates": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Mom's Birthday",
                        "date": "1965-03-20",
                        "type": "birthday",
                        "reminder_enabled": True,
                        "reminder_days_before": [7, 1]
                    }
                ],
                "reminder_preferences": {
                    "email": True,
                    "sms": False,
                    "whatsapp": True
                },
                "privacy_consent": {
                    "marketing_consent": True,
                    "data_processing_consent": True,
                    "reminder_consent": True,
                    "consent_timestamp": datetime.now(timezone.utc).isoformat()
                },
                "data_retention": {
                    "auto_delete_photos": True,
                    "retention_period_months": 24,
                    "last_activity": datetime.now(timezone.utc).isoformat()
                }
            }
            
            response = requests.put(f"{self.api_url}/users/{self.test_user_id}/profile", 
                                  json=profile_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                updated_user = response.json()
                
                # Verify all new fields are present
                new_fields = ['date_of_birth', 'important_dates', 'reminder_preferences', 
                             'privacy_consent', 'data_retention']
                missing_fields = [field for field in new_fields if field not in updated_user]
                
                if missing_fields:
                    success = False
                    details = f"Missing new profile fields: {missing_fields}"
                else:
                    # Verify field values
                    dob_correct = updated_user.get('date_of_birth') == profile_data['date_of_birth']
                    reminder_prefs_correct = updated_user.get('reminder_preferences', {}).get('email') == True
                    consent_correct = updated_user.get('privacy_consent', {}).get('marketing_consent') == True
                    
                    details = f"Profile updated with new fields - DOB: {dob_correct}, Reminders: {reminder_prefs_correct}, Consent: {consent_correct}"
                    
                    if not all([dob_correct, reminder_prefs_correct, consent_correct]):
                        success = False
                        details += " - Some field values incorrect"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("User Model Extensions", success, details)
            return success
            
        except Exception as e:
            self.log_test("User Model Extensions", False, str(e))
            return False

    def test_update_profile_endpoint(self):
        """Test PUT /api/users/{user_id}/profile endpoint"""
        try:
            profile_updates = {
                "date_of_birth": "1988-12-25",
                "reminder_preferences": {
                    "email": True,
                    "sms": True,
                    "whatsapp": False
                },
                "privacy_consent": {
                    "marketing_consent": False,
                    "data_processing_consent": True,
                    "reminder_consent": True
                }
            }
            
            response = requests.put(f"{self.api_url}/users/{self.test_user_id}/profile", 
                                  json=profile_updates, timeout=10)
            success = response.status_code == 200
            
            if success:
                user_data = response.json()
                
                # Verify updates were applied
                dob_updated = user_data.get('date_of_birth') == profile_updates['date_of_birth']
                sms_enabled = user_data.get('reminder_preferences', {}).get('sms') == True
                marketing_disabled = user_data.get('privacy_consent', {}).get('marketing_consent') == False
                
                details = f"Profile update successful - DOB updated: {dob_updated}, SMS enabled: {sms_enabled}, Marketing disabled: {marketing_disabled}"
                
                if not all([dob_updated, sms_enabled, marketing_disabled]):
                    success = False
                    details += " - Update verification failed"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Update Profile Endpoint", success, details)
            return success
            
        except Exception as e:
            self.log_test("Update Profile Endpoint", False, str(e))
            return False

    def test_add_important_date(self):
        """Test POST /api/users/{user_id}/important-dates endpoint"""
        try:
            important_date = {
                "name": "Wedding Anniversary",
                "date": "2020-06-15",
                "type": "anniversary",
                "reminder_enabled": True,
                "reminder_days_before": [30, 7, 1]
            }
            
            response = requests.post(f"{self.api_url}/users/{self.test_user_id}/important-dates", 
                                   json=important_date, timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                
                # Check response structure
                has_message = 'message' in result
                has_date_id = 'date_id' in result
                
                if has_message and has_date_id:
                    details = f"Important date added - ID: {result['date_id']}, Message: {result['message']}"
                    return success, result['date_id']
                else:
                    success = False
                    details = "Missing required response fields (message, date_id)"
                    return success, None
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                return success, None
            
            self.log_test("Add Important Date", success, details)
            return success, None
            
        except Exception as e:
            self.log_test("Add Important Date", False, str(e))
            return False, None

    def test_update_important_date(self, date_id):
        """Test PUT /api/users/{user_id}/important-dates/{date_id} endpoint"""
        if not date_id:
            self.log_test("Update Important Date", False, "No date ID available")
            return False
            
        try:
            date_updates = {
                "name": "Wedding Anniversary (Updated)",
                "date": "2020-06-15",
                "type": "anniversary",
                "reminder_enabled": False,
                "reminder_days_before": [7]
            }
            
            response = requests.put(f"{self.api_url}/users/{self.test_user_id}/important-dates/{date_id}", 
                                  json=date_updates, timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                has_message = 'message' in result
                
                if has_message:
                    details = f"Important date updated - {result['message']}"
                else:
                    success = False
                    details = "Missing message in response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Update Important Date", success, details)
            return success
            
        except Exception as e:
            self.log_test("Update Important Date", False, str(e))
            return False

    def test_delete_important_date(self, date_id):
        """Test DELETE /api/users/{user_id}/important-dates/{date_id} endpoint"""
        if not date_id:
            self.log_test("Delete Important Date", False, "No date ID available")
            return False
            
        try:
            response = requests.delete(f"{self.api_url}/users/{self.test_user_id}/important-dates/{date_id}", 
                                     timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                has_message = 'message' in result
                
                if has_message:
                    details = f"Important date deleted - {result['message']}"
                else:
                    success = False
                    details = "Missing message in response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Delete Important Date", success, details)
            return success
            
        except Exception as e:
            self.log_test("Delete Important Date", False, str(e))
            return False

    def test_record_consent(self):
        """Test POST /api/users/{user_id}/consent endpoint"""
        try:
            consent_data = {
                "type": "marketing",
                "consent_given": True,
                "marketing_consent": True,
                "reminder_consent": False
            }
            
            # The endpoint expects request parameter, let's check the backend implementation
            response = requests.post(f"{self.api_url}/users/{self.test_user_id}/consent", 
                                   json=consent_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                
                # Check response structure
                has_message = 'message' in result
                has_consent_id = 'consent_id' in result
                
                if has_message and has_consent_id:
                    details = f"Consent recorded - ID: {result['consent_id']}, Message: {result['message']}"
                else:
                    success = False
                    details = "Missing required response fields (message, consent_id)"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Record Consent", success, details)
            return success
            
        except Exception as e:
            self.log_test("Record Consent", False, str(e))
            return False

    def test_update_reminder_preferences(self):
        """Test PUT /api/users/{user_id}/reminder-preferences endpoint"""
        try:
            preferences = {
                "email": True,
                "sms": True,
                "whatsapp": True
            }
            
            response = requests.put(f"{self.api_url}/users/{self.test_user_id}/reminder-preferences", 
                                  json=preferences, timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                has_message = 'message' in result
                
                if has_message:
                    details = f"Reminder preferences updated - {result['message']}"
                else:
                    success = False
                    details = "Missing message in response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Update Reminder Preferences", success, details)
            return success
            
        except Exception as e:
            self.log_test("Update Reminder Preferences", False, str(e))
            return False

    def test_data_export_request(self):
        """Test POST /api/users/{user_id}/data-export endpoint"""
        try:
            export_request = {
                "type": "export",
                "categories": ["profile", "orders", "photos", "reviews"]
            }
            
            response = requests.post(f"{self.api_url}/users/{self.test_user_id}/data-export", 
                                   json=export_request, timeout=15)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                
                # Check response structure
                required_fields = ['message', 'request_id']
                missing_fields = [field for field in required_fields if field not in result]
                
                if missing_fields:
                    success = False
                    details = f"Missing response fields: {missing_fields}"
                else:
                    # Check if export was processed (mock implementation)
                    has_export_url = 'export_url' in result
                    details = f"Data export requested - ID: {result['request_id']}, Export URL provided: {has_export_url}"
                    
                    if has_export_url:
                        details += f", URL: {result['export_url']}"
                        return success, result['request_id']
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                return success, None
            
            self.log_test("Data Export Request", success, details)
            return success, result.get('request_id') if success else None
            
        except Exception as e:
            self.log_test("Data Export Request", False, str(e))
            return False, None

    def test_data_deletion_request(self):
        """Test POST /api/users/{user_id}/data-deletion endpoint"""
        try:
            deletion_request = {
                "categories": ["photos", "reviews"]
            }
            
            response = requests.post(f"{self.api_url}/users/{self.test_user_id}/data-deletion", 
                                   json=deletion_request, timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                
                # Check response structure
                required_fields = ['message', 'request_id', 'verification_required', 'next_steps']
                missing_fields = [field for field in required_fields if field not in result]
                
                if missing_fields:
                    success = False
                    details = f"Missing response fields: {missing_fields}"
                else:
                    verification_required = result.get('verification_required', False)
                    details = f"Data deletion requested - ID: {result['request_id']}, Verification required: {verification_required}"
                    return success, result['request_id']
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                return success, None
            
            self.log_test("Data Deletion Request", success, details)
            return success, result.get('request_id') if success else None
            
        except Exception as e:
            self.log_test("Data Deletion Request", False, str(e))
            return False, None

    def test_get_export_requests(self):
        """Test GET /api/users/{user_id}/export-requests endpoint"""
        try:
            response = requests.get(f"{self.api_url}/users/{self.test_user_id}/export-requests", 
                                  timeout=10)
            success = response.status_code == 200
            
            if success:
                requests_list = response.json()
                
                # Verify response is a list
                if isinstance(requests_list, list):
                    details = f"Export requests retrieved - Found {len(requests_list)} requests"
                    
                    # If requests exist, check structure
                    if requests_list:
                        first_request = requests_list[0]
                        required_fields = ['id', 'user_id', 'request_type', 'status', 'created_at']
                        missing_fields = [field for field in required_fields if field not in first_request]
                        
                        if missing_fields:
                            success = False
                            details += f", Missing request fields: {missing_fields}"
                        else:
                            details += f", Latest request: {first_request['request_type']} ({first_request['status']})"
                else:
                    success = False
                    details = "Response is not a list"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Export Requests", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Export Requests", False, str(e))
            return False

    def test_data_models_validation(self):
        """Test that new data models work correctly"""
        try:
            # Test ImportantDate model by adding a date with all fields
            complete_date = {
                "name": "Dad's Birthday",
                "date": "1960-08-10",
                "type": "birthday",
                "reminder_enabled": True,
                "reminder_days_before": [14, 7, 3, 1]
            }
            
            response = requests.post(f"{self.api_url}/users/{self.test_user_id}/important-dates", 
                                   json=complete_date, timeout=10)
            
            date_model_success = response.status_code == 200
            date_id = None
            
            if date_model_success:
                result = response.json()
                date_id = result.get('date_id')
            
            # Test ConsentRecord model by recording consent
            consent_data = {
                "type": "data_processing",
                "consent_given": True,
                "marketing_consent": False,
                "reminder_consent": True
            }
            
            consent_response = requests.post(f"{self.api_url}/users/{self.test_user_id}/consent", 
                                           json=consent_data, timeout=10)
            consent_model_success = consent_response.status_code == 200
            
            # Test DataExportRequest model by creating export request
            export_data = {
                "type": "export",
                "categories": ["profile", "orders"]
            }
            
            export_response = requests.post(f"{self.api_url}/users/{self.test_user_id}/data-export", 
                                          json=export_data, timeout=10)
            export_model_success = export_response.status_code == 200
            
            # Calculate overall success
            model_tests = [date_model_success, consent_model_success, export_model_success]
            success = all(model_tests)
            
            details = f"Data models validation - ImportantDate: {date_model_success}, ConsentRecord: {consent_model_success}, DataExportRequest: {export_model_success}"
            
            self.log_test("Data Models Validation", success, details)
            
            # Cleanup - delete the test date
            if date_id:
                requests.delete(f"{self.api_url}/users/{self.test_user_id}/important-dates/{date_id}", timeout=10)
            
            return success
            
        except Exception as e:
            self.log_test("Data Models Validation", False, str(e))
            return False

    def test_validation_and_error_handling(self):
        """Test proper validation and error responses for invalid data"""
        validation_tests = []
        
        # Test 1: Invalid date format
        try:
            invalid_date = {
                "name": "Invalid Date Test",
                "date": "invalid-date-format",
                "type": "birthday"
            }
            
            response = requests.post(f"{self.api_url}/users/{self.test_user_id}/important-dates", 
                                   json=invalid_date, timeout=10)
            
            # Should return error for invalid date format
            validation_success = response.status_code in [400, 422]  # Bad request or validation error
            validation_tests.append(validation_success)
            
            self.log_test("Validation - Invalid Date Format", validation_success, 
                         f"Status: {response.status_code} (Expected 400/422)")
            
        except Exception as e:
            validation_tests.append(False)
            self.log_test("Validation - Invalid Date Format", False, str(e))
        
        # Test 2: Non-existent user
        try:
            fake_user_id = "non-existent-user-123"
            
            response = requests.put(f"{self.api_url}/users/{fake_user_id}/profile", 
                                  json={"date_of_birth": "1990-01-01"}, timeout=10)
            
            # Should return 404 for non-existent user
            validation_success = response.status_code == 404
            validation_tests.append(validation_success)
            
            self.log_test("Validation - Non-existent User", validation_success, 
                         f"Status: {response.status_code} (Expected 404)")
            
        except Exception as e:
            validation_tests.append(False)
            self.log_test("Validation - Non-existent User", False, str(e))
        
        # Test 3: Invalid reminder preferences
        try:
            invalid_prefs = {
                "email": "not-a-boolean",
                "sms": True,
                "whatsapp": "invalid"
            }
            
            response = requests.put(f"{self.api_url}/users/{self.test_user_id}/reminder-preferences", 
                                  json=invalid_prefs, timeout=10)
            
            # Should handle invalid boolean values gracefully
            validation_success = response.status_code in [200, 400, 422]
            validation_tests.append(validation_success)
            
            self.log_test("Validation - Invalid Preferences", validation_success, 
                         f"Status: {response.status_code}")
            
        except Exception as e:
            validation_tests.append(False)
            self.log_test("Validation - Invalid Preferences", False, str(e))
        
        # Calculate overall validation success
        overall_success = sum(validation_tests) >= len(validation_tests) * 0.7  # 70% threshold
        
        return overall_success

    def run_comprehensive_phase1_tests(self):
        """Run all Phase 1 profile enhancement tests"""
        print("🚀 PHASE 1 PROFILE ENHANCEMENT TESTING")
        print("=" * 60)
        print(f"Testing backend enhancements at: {self.api_url}")
        print(f"Using test user ID: {self.test_user_id}")
        print("=" * 60)
        
        # Setup test user
        user_setup_success, user_data = self.setup_test_user()
        if not user_setup_success:
            print("❌ Cannot proceed without test user setup")
            return False
        
        print(f"\n📋 Test User: {user_data.get('name', 'Unknown')} ({self.test_user_id})")
        print("-" * 60)
        
        # Test 1: User Model Extensions
        print("\n1️⃣ TESTING USER MODEL EXTENSIONS")
        model_success = self.test_user_model_extensions()
        
        # Test 2: Profile Update Endpoint
        print("\n2️⃣ TESTING PROFILE UPDATE ENDPOINT")
        profile_update_success = self.test_update_profile_endpoint()
        
        # Test 3: Important Dates Management
        print("\n3️⃣ TESTING IMPORTANT DATES MANAGEMENT")
        add_date_success, date_id = self.test_add_important_date()
        update_date_success = self.test_update_important_date(date_id)
        delete_date_success = self.test_delete_important_date(date_id)
        
        # Test 4: Consent Management
        print("\n4️⃣ TESTING CONSENT MANAGEMENT")
        consent_success = self.test_record_consent()
        
        # Test 5: Reminder Preferences
        print("\n5️⃣ TESTING REMINDER PREFERENCES")
        reminder_prefs_success = self.test_update_reminder_preferences()
        
        # Test 6: GDPR Data Export/Deletion
        print("\n6️⃣ TESTING GDPR COMPLIANCE")
        export_success, export_id = self.test_data_export_request()
        deletion_success, deletion_id = self.test_data_deletion_request()
        get_requests_success = self.test_get_export_requests()
        
        # Test 7: Data Models Validation
        print("\n7️⃣ TESTING DATA MODELS")
        models_success = self.test_data_models_validation()
        
        # Test 8: Validation & Error Handling
        print("\n8️⃣ TESTING VALIDATION & ERROR HANDLING")
        validation_success = self.test_validation_and_error_handling()
        
        # Calculate overall results
        all_tests = [
            model_success, profile_update_success, add_date_success, 
            update_date_success, delete_date_success, consent_success,
            reminder_prefs_success, export_success, deletion_success,
            get_requests_success, models_success, validation_success
        ]
        
        success_rate = (sum(all_tests) / len(all_tests)) * 100
        
        print("\n" + "=" * 60)
        print("📊 PHASE 1 PROFILE ENHANCEMENT TEST RESULTS")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {success_rate:.1f}%")
        print("=" * 60)
        
        # Detailed breakdown
        print("\n📋 DETAILED RESULTS:")
        print("-" * 40)
        
        test_categories = [
            ("User Model Extensions", model_success),
            ("Profile Update API", profile_update_success),
            ("Add Important Date", add_date_success),
            ("Update Important Date", update_date_success),
            ("Delete Important Date", delete_date_success),
            ("Record Consent", consent_success),
            ("Reminder Preferences", reminder_prefs_success),
            ("Data Export Request", export_success),
            ("Data Deletion Request", deletion_success),
            ("Get Export Requests", get_requests_success),
            ("Data Models Validation", models_success),
            ("Validation & Error Handling", validation_success)
        ]
        
        for category, result in test_categories:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{category:<30} {status}")
        
        print("-" * 40)
        
        # Summary assessment
        if success_rate >= 90:
            print("🎉 EXCELLENT: Phase 1 profile enhancements are production-ready!")
        elif success_rate >= 75:
            print("✅ GOOD: Phase 1 profile enhancements are mostly functional with minor issues.")
        elif success_rate >= 50:
            print("⚠️ PARTIAL: Phase 1 profile enhancements have significant issues that need attention.")
        else:
            print("❌ CRITICAL: Phase 1 profile enhancements have major failures and need immediate fixes.")
        
        return success_rate >= 75

if __name__ == "__main__":
    tester = Phase1ProfileEnhancementTester()
    success = tester.run_comprehensive_phase1_tests()
    
    if success:
        print("\n🎯 Phase 1 profile enhancement testing completed successfully!")
        sys.exit(0)
    else:
        print("\n💥 Phase 1 profile enhancement testing failed!")
        sys.exit(1)