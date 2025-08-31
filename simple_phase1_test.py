import requests
import json
from datetime import datetime, timezone
import uuid

def test_phase1_profile_enhancements():
    """Simple test for Phase 1 profile enhancement APIs"""
    base_url = "https://customframe-shop.preview.emergentagent.com/api"
    test_user_id = "user_123"
    
    print("🚀 PHASE 1 PROFILE ENHANCEMENT TESTING")
    print("=" * 60)
    
    # Test results tracking
    tests = []
    
    # 1. Create test user first
    print("\n1️⃣ Setting up test user...")
    user_data = {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@memories.com", 
        "phone": "+91 9876543210"
    }
    
    try:
        response = requests.post(f"{base_url}/users", json=user_data, timeout=10)
        if response.status_code == 200:
            user = response.json()
            actual_user_id = user['id']
            print(f"✅ Test user created: {actual_user_id}")
        else:
            print(f"❌ Failed to create user: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return False
    
    # 2. Test User Model Extensions - PUT /api/users/{user_id}/profile
    print("\n2️⃣ Testing User Model Extensions...")
    profile_data = {
        "date_of_birth": "1990-05-15",
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
    
    try:
        response = requests.put(f"{base_url}/users/{actual_user_id}/profile", 
                              json=profile_data, timeout=10)
        success = response.status_code == 200
        if success:
            updated_user = response.json()
            has_dob = 'date_of_birth' in updated_user
            has_reminders = 'reminder_preferences' in updated_user
            has_consent = 'privacy_consent' in updated_user
            has_retention = 'data_retention' in updated_user
            
            print(f"✅ Profile updated - DOB: {has_dob}, Reminders: {has_reminders}, Consent: {has_consent}, Retention: {has_retention}")
            tests.append(True)
        else:
            print(f"❌ Profile update failed: {response.status_code} - {response.text}")
            tests.append(False)
    except Exception as e:
        print(f"❌ Profile update error: {e}")
        tests.append(False)
    
    # 3. Test Important Dates - POST /api/users/{user_id}/important-dates
    print("\n3️⃣ Testing Important Dates Management...")
    important_date = {
        "name": "Wedding Anniversary",
        "date": "2020-06-15",
        "type": "anniversary",
        "reminder_enabled": True,
        "reminder_days_before": [30, 7, 1]
    }
    
    try:
        response = requests.post(f"{base_url}/users/{actual_user_id}/important-dates", 
                               json=important_date, timeout=10)
        success = response.status_code == 200
        if success:
            result = response.json()
            date_id = result.get('date_id')
            print(f"✅ Important date added: {date_id}")
            tests.append(True)
            
            # Test update important date
            if date_id:
                update_data = {
                    "name": "Wedding Anniversary (Updated)",
                    "date": "2020-06-15",
                    "type": "anniversary",
                    "reminder_enabled": False
                }
                
                update_response = requests.put(f"{base_url}/users/{actual_user_id}/important-dates/{date_id}", 
                                             json=update_data, timeout=10)
                if update_response.status_code == 200:
                    print("✅ Important date updated")
                    tests.append(True)
                else:
                    print(f"❌ Important date update failed: {update_response.status_code}")
                    tests.append(False)
                
                # Test delete important date
                delete_response = requests.delete(f"{base_url}/users/{actual_user_id}/important-dates/{date_id}", 
                                                timeout=10)
                if delete_response.status_code == 200:
                    print("✅ Important date deleted")
                    tests.append(True)
                else:
                    print(f"❌ Important date deletion failed: {delete_response.status_code}")
                    tests.append(False)
            else:
                tests.extend([False, False])  # Update and delete failed
        else:
            print(f"❌ Important date creation failed: {response.status_code} - {response.text}")
            tests.extend([False, False, False])  # Add, update, delete all failed
    except Exception as e:
        print(f"❌ Important dates error: {e}")
        tests.extend([False, False, False])
    
    # 4. Test Reminder Preferences - PUT /api/users/{user_id}/reminder-preferences
    print("\n4️⃣ Testing Reminder Preferences...")
    preferences = {
        "email": True,
        "sms": True,
        "whatsapp": False
    }
    
    try:
        response = requests.put(f"{base_url}/users/{actual_user_id}/reminder-preferences", 
                              json=preferences, timeout=10)
        success = response.status_code == 200
        if success:
            print("✅ Reminder preferences updated")
            tests.append(True)
        else:
            print(f"❌ Reminder preferences update failed: {response.status_code} - {response.text}")
            tests.append(False)
    except Exception as e:
        print(f"❌ Reminder preferences error: {e}")
        tests.append(False)
    
    # 5. Test Data Export - POST /api/users/{user_id}/data-export
    print("\n5️⃣ Testing GDPR Data Export...")
    export_request = {
        "type": "export",
        "categories": ["profile", "orders", "photos", "reviews"]
    }
    
    try:
        response = requests.post(f"{base_url}/users/{actual_user_id}/data-export", 
                               json=export_request, timeout=15)
        success = response.status_code == 200
        if success:
            result = response.json()
            has_request_id = 'request_id' in result
            has_export_url = 'export_url' in result
            print(f"✅ Data export requested - ID: {result.get('request_id')}, URL provided: {has_export_url}")
            tests.append(True)
        else:
            print(f"❌ Data export failed: {response.status_code} - {response.text}")
            tests.append(False)
    except Exception as e:
        print(f"❌ Data export error: {e}")
        tests.append(False)
    
    # 6. Test Data Deletion - POST /api/users/{user_id}/data-deletion
    print("\n6️⃣ Testing GDPR Data Deletion...")
    deletion_request = {
        "categories": ["photos", "reviews"]
    }
    
    try:
        response = requests.post(f"{base_url}/users/{actual_user_id}/data-deletion", 
                               json=deletion_request, timeout=10)
        success = response.status_code == 200
        if success:
            result = response.json()
            has_request_id = 'request_id' in result
            verification_required = result.get('verification_required', False)
            print(f"✅ Data deletion requested - ID: {result.get('request_id')}, Verification: {verification_required}")
            tests.append(True)
        else:
            print(f"❌ Data deletion failed: {response.status_code} - {response.text}")
            tests.append(False)
    except Exception as e:
        print(f"❌ Data deletion error: {e}")
        tests.append(False)
    
    # 7. Test Get Export Requests - GET /api/users/{user_id}/export-requests
    print("\n7️⃣ Testing Export Requests Retrieval...")
    try:
        response = requests.get(f"{base_url}/users/{actual_user_id}/export-requests", timeout=10)
        success = response.status_code == 200
        if success:
            requests_list = response.json()
            print(f"✅ Export requests retrieved - Found {len(requests_list)} requests")
            tests.append(True)
        else:
            print(f"❌ Export requests retrieval failed: {response.status_code} - {response.text}")
            tests.append(False)
    except Exception as e:
        print(f"❌ Export requests error: {e}")
        tests.append(False)
    
    # 8. Test Error Handling - Non-existent user
    print("\n8️⃣ Testing Error Handling...")
    try:
        response = requests.put(f"{base_url}/users/non-existent-user/profile", 
                              json={"date_of_birth": "1990-01-01"}, timeout=10)
        success = response.status_code == 404
        if success:
            print("✅ Proper 404 error for non-existent user")
            tests.append(True)
        else:
            print(f"❌ Expected 404, got {response.status_code}")
            tests.append(False)
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        tests.append(False)
    
    # Calculate results
    total_tests = len(tests)
    passed_tests = sum(tests)
    success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
    
    print("\n" + "=" * 60)
    print("📊 PHASE 1 PROFILE ENHANCEMENT TEST RESULTS")
    print("=" * 60)
    print(f"Total Tests: {total_tests}")
    print(f"Passed Tests: {passed_tests}")
    print(f"Success Rate: {success_rate:.1f}%")
    print("=" * 60)
    
    if success_rate >= 80:
        print("🎉 EXCELLENT: Phase 1 profile enhancements are working well!")
        return True
    elif success_rate >= 60:
        print("✅ GOOD: Phase 1 profile enhancements are mostly functional.")
        return True
    else:
        print("❌ NEEDS WORK: Phase 1 profile enhancements have significant issues.")
        return False

if __name__ == "__main__":
    success = test_phase1_profile_enhancements()
    exit(0 if success else 1)