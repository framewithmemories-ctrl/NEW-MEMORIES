import requests
import sys
import json
import base64
from datetime import datetime
from io import BytesIO
from PIL import Image

class PhotoGiftHubAPITester:
    def __init__(self, base_url="https://photogifthub.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

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

    def test_api_health(self):
        """Test API health check"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.json() if success else response.text}"
            self.log_test("API Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("API Health Check", False, str(e))
            return False

    def test_get_products(self):
        """Test fetching products"""
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            success = response.status_code == 200
            
            if success:
                products = response.json()
                success = len(products) > 0
                details = f"Found {len(products)} products"
                
                # Check if sample products are properly structured
                if products:
                    first_product = products[0]
                    required_fields = ['id', 'name', 'description', 'category', 'base_price', 'sizes', 'materials', 'colors', 'image_url']
                    missing_fields = [field for field in required_fields if field not in first_product]
                    if missing_fields:
                        success = False
                        details += f", Missing fields: {missing_fields}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Products", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("Get Products", False, str(e))
            return False, []

    def test_get_products_by_category(self):
        """Test fetching products by category"""
        categories = ['frames', 'mugs', 'led', 'acrylic']
        all_success = True
        
        for category in categories:
            try:
                response = requests.get(f"{self.api_url}/products?category={category}", timeout=10)
                success = response.status_code == 200
                
                if success:
                    products = response.json()
                    # Check if all products belong to the requested category
                    category_match = all(p.get('category') == category for p in products)
                    success = category_match
                    details = f"Category: {category}, Found {len(products)} products, Category match: {category_match}"
                else:
                    details = f"Status: {response.status_code}"
                
                self.log_test(f"Get Products - Category: {category}", success, details)
                if not success:
                    all_success = False
                    
            except Exception as e:
                self.log_test(f"Get Products - Category: {category}", False, str(e))
                all_success = False
        
        return all_success

    def create_test_image(self):
        """Create a test image for upload testing"""
        # Create a simple test image
        img = Image.new('RGB', (800, 600), color='red')
        img_buffer = BytesIO()
        img.save(img_buffer, format='JPEG')
        img_buffer.seek(0)
        return img_buffer

    def test_image_upload(self):
        """Test image upload functionality"""
        try:
            # Create test image
            test_image = self.create_test_image()
            
            files = {'file': ('test_image.jpg', test_image, 'image/jpeg')}
            response = requests.post(f"{self.api_url}/upload-image", files=files, timeout=15)
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ['success', 'image_data', 'dimensions', 'quality_warning', 'message']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    success = False
                    details = f"Missing response fields: {missing_fields}"
                else:
                    details = f"Upload successful, Dimensions: {data['dimensions']}, Quality warning: {data['quality_warning']}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Image Upload", success, details)
            return success
            
        except Exception as e:
            self.log_test("Image Upload", False, str(e))
            return False

    def test_create_user(self):
        """Test user creation"""
        try:
            test_user = {
                "name": f"Test User {datetime.now().strftime('%H%M%S')}",
                "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
                "phone": "+91 9876543210"
            }
            
            response = requests.post(f"{self.api_url}/users", json=test_user, timeout=10)
            success = response.status_code == 200
            
            if success:
                user_data = response.json()
                required_fields = ['id', 'name', 'email', 'points', 'tier', 'created_at']
                missing_fields = [field for field in required_fields if field not in user_data]
                
                if missing_fields:
                    success = False
                    details = f"Missing user fields: {missing_fields}"
                else:
                    details = f"User created with ID: {user_data['id']}, Points: {user_data['points']}, Tier: {user_data['tier']}"
                    return success, user_data['id']
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Create User", success, details)
            return success, None
            
        except Exception as e:
            self.log_test("Create User", False, str(e))
            return False, None

    def test_create_order(self, user_id):
        """Test order creation"""
        if not user_id:
            self.log_test("Create Order", False, "No user ID available")
            return False
            
        try:
            test_order = {
                "user_id": user_id,
                "items": [
                    {
                        "product_id": "test-product-1",
                        "name": "Classic Wooden Frame",
                        "quantity": 1,
                        "price": 899.0,
                        "customizations": {"size": "8x10", "material": "Oak"}
                    }
                ],
                "total_amount": 899.0,
                "delivery_type": "pickup",
                "pickup_slot": "2025-01-15 10:00"
            }
            
            response = requests.post(f"{self.api_url}/orders", json=test_order, timeout=10)
            success = response.status_code == 200
            
            if success:
                order_data = response.json()
                required_fields = ['id', 'user_id', 'items', 'total_amount', 'status', 'points_earned', 'created_at']
                missing_fields = [field for field in required_fields if field not in order_data]
                
                if missing_fields:
                    success = False
                    details = f"Missing order fields: {missing_fields}"
                else:
                    expected_points = int(899.0 * 0.02)  # 2% of order value
                    points_correct = order_data['points_earned'] == expected_points
                    details = f"Order created with ID: {order_data['id']}, Points earned: {order_data['points_earned']} (expected: {expected_points}), Points calculation correct: {points_correct}"
                    if not points_correct:
                        success = False
                        details += " - Points calculation error"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Create Order", success, details)
            return success
            
        except Exception as e:
            self.log_test("Create Order", False, str(e))
            return False

    def test_ai_gift_suggestions(self):
        """Test AI gift suggestions"""
        try:
            quiz_data = {
                "recipient": "Mom",
                "occasion": "Birthday",
                "age_group": "Adult (31-50)",
                "interests": ["Photography", "Art"],
                "budget": "₹1000-2000",
                "relationship": "Family"
            }
            
            response = requests.post(f"{self.api_url}/gift-suggestions", json=quiz_data, timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                has_suggestions = 'suggestions' in data and data['suggestions']
                has_quiz_data = 'quiz_data' in data
                
                if has_suggestions and has_quiz_data:
                    details = f"AI suggestions received, Length: {len(str(data['suggestions']))}"
                    # Check if it's an error fallback or actual AI response
                    if "error" in data:
                        details += f", Error occurred: {data['error']}"
                else:
                    success = False
                    details = "Missing suggestions or quiz_data in response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("AI Gift Suggestions", success, details)
            return success
            
        except Exception as e:
            self.log_test("AI Gift Suggestions", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting PhotoGiftHub Backend API Tests")
        print("=" * 50)
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Test products endpoints
        products_success, products = self.test_get_products()
        self.test_get_products_by_category()
        
        # Test image upload
        self.test_image_upload()
        
        # Test user creation and orders
        user_success, user_id = self.test_create_user()
        if user_success:
            self.test_create_order(user_id)
        
        # Test AI functionality
        self.test_ai_gift_suggestions()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        # Print failed tests details
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return success_rate > 80  # Consider successful if >80% tests pass

def main():
    tester = PhotoGiftHubAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())