import requests
import sys
import json
import base64
from datetime import datetime
from io import BytesIO
from PIL import Image

class PhotoGiftHubAPITester:
    def __init__(self, base_url="https://memories-shop.preview.emergentagent.com"):
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
                    expected_points = int(899.0 * 0.03)  # 3% of order value
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
        """Test AI gift suggestions - Basic functionality"""
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
            
            self.log_test("AI Gift Suggestions - Basic", success, details)
            return success
            
        except Exception as e:
            self.log_test("AI Gift Suggestions - Basic", False, str(e))
            return False

    def test_enhanced_ai_gift_suggestions(self):
        """Test Enhanced AI Gift Finder with contextual answers and aiEnhanced flag"""
        try:
            # Enhanced payload as sent by frontend
            enhanced_payload = {
                "answers": {
                    "occasion": "anniversary",
                    "recipient": "romantic_partner", 
                    "budget": "premium",
                    "style_preference": "classic_traditional"
                },
                "contextual": True,
                "aiEnhanced": True,
                "previewPhoto": None
            }
            
            response = requests.post(f"{self.api_url}/gift-suggestions", json=enhanced_payload, timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                has_suggestions = 'suggestions' in data and data['suggestions']
                
                if has_suggestions:
                    details = f"Enhanced AI suggestions received, Length: {len(str(data['suggestions']))}"
                    # Check for enhanced features
                    if isinstance(data['suggestions'], list):
                        details += f", Structured suggestions: {len(data['suggestions'])} items"
                    else:
                        details += ", Text-based suggestions"
                else:
                    success = False
                    details = "Missing suggestions in enhanced response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Enhanced AI Gift Suggestions", success, details)
            return success
            
        except Exception as e:
            self.log_test("Enhanced AI Gift Suggestions", False, str(e))
            return False

    def test_ai_gift_suggestions_with_photo(self):
        """Test AI Gift Finder with preview photo data"""
        try:
            # Create test image data for preview photo
            test_image = self.create_test_image()
            image_base64 = base64.b64encode(test_image.getvalue()).decode('utf-8')
            
            # Enhanced payload with photo preview
            photo_payload = {
                "answers": {
                    "occasion": "birthday",
                    "recipient": "family_parent",
                    "budget": "mid_range", 
                    "style_preference": "modern_trendy"
                },
                "contextual": True,
                "aiEnhanced": True,
                "previewPhoto": {
                    "url": f"data:image/jpeg;base64,{image_base64[:100]}...",  # Truncated for test
                    "dimensions": {"width": 800, "height": 600},
                    "analysis": "landscape photo with warm colors"
                }
            }
            
            response = requests.post(f"{self.api_url}/gift-suggestions", json=photo_payload, timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                has_suggestions = 'suggestions' in data and data['suggestions']
                
                if has_suggestions:
                    details = f"Photo-enhanced AI suggestions received, Length: {len(str(data['suggestions']))}"
                    # Check if photo context was considered
                    suggestions_text = str(data['suggestions']).lower()
                    if 'photo' in suggestions_text or 'landscape' in suggestions_text or 'frame' in suggestions_text:
                        details += ", Photo context detected in suggestions"
                    else:
                        details += ", Photo context not clearly reflected"
                else:
                    success = False
                    details = "Missing suggestions in photo-enhanced response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("AI Gift Suggestions with Photo", success, details)
            return success
            
        except Exception as e:
            self.log_test("AI Gift Suggestions with Photo", False, str(e))
            return False

    def test_ai_confidence_and_reasoning(self):
        """Test if AI suggestions include confidence scores and reasoning"""
        try:
            # Test payload for structured response
            test_payload = {
                "answers": {
                    "occasion": "corporate",
                    "recipient": "colleague",
                    "budget": "luxury",
                    "style_preference": "luxury_premium"
                },
                "contextual": True,
                "aiEnhanced": True,
                "previewPhoto": None
            }
            
            response = requests.post(f"{self.api_url}/gift-suggestions", json=test_payload, timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                has_suggestions = 'suggestions' in data and data['suggestions']
                
                if has_suggestions:
                    suggestions_text = str(data['suggestions']).lower()
                    
                    # Check for confidence indicators
                    has_confidence = any(indicator in suggestions_text for indicator in [
                        'confidence', 'score', 'match', 'perfect', 'ideal', 'recommended'
                    ])
                    
                    # Check for reasoning indicators  
                    has_reasoning = any(indicator in suggestions_text for indicator in [
                        'because', 'perfect for', 'ideal for', 'great for', 'suitable', 'matches'
                    ])
                    
                    details = f"AI suggestions analyzed - Confidence indicators: {has_confidence}, Reasoning indicators: {has_reasoning}"
                    
                    if not (has_confidence or has_reasoning):
                        success = False
                        details += " - Missing confidence scores and reasoning"
                else:
                    success = False
                    details = "Missing suggestions for confidence/reasoning analysis"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("AI Confidence & Reasoning", success, details)
            return success
            
        except Exception as e:
            self.log_test("AI Confidence & Reasoning", False, str(e))
            return False

    def test_enhanced_user_profile_update(self, user_id):
        """Test enhanced user profile update with new fields"""
        if not user_id:
            self.log_test("Enhanced User Profile Update", False, "No user ID available")
            return False
            
        try:
            profile_data = {
                "address": "123 Memory Lane, Coimbatore, Tamil Nadu",
                "preferences": "Wooden frames, vintage style, warm colors",
                "wallet_balance": 500.0,
                "store_credits": 100.0,
                "total_spent": 2500.0
            }
            
            response = requests.put(f"{self.api_url}/users/{user_id}", json=profile_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                user_data = response.json()
                # Check if all new fields are present and updated
                expected_fields = ['address', 'preferences', 'wallet_balance', 'store_credits', 'total_spent']
                missing_fields = [field for field in expected_fields if field not in user_data]
                
                if missing_fields:
                    success = False
                    details = f"Missing enhanced profile fields: {missing_fields}"
                else:
                    # Verify values were updated correctly
                    values_correct = all(user_data.get(field) == profile_data[field] for field in expected_fields)
                    details = f"Profile updated successfully. Values correct: {values_correct}"
                    if not values_correct:
                        success = False
                        details += " - Some values not updated correctly"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Enhanced User Profile Update", success, details)
            return success
            
        except Exception as e:
            self.log_test("Enhanced User Profile Update", False, str(e))
            return False

    def test_user_wallet_info(self, user_id):
        """Test getting user wallet information"""
        if not user_id:
            self.log_test("User Wallet Info", False, "No user ID available")
            return False
            
        try:
            response = requests.get(f"{self.api_url}/users/{user_id}/wallet", timeout=10)
            success = response.status_code == 200
            
            if success:
                wallet_data = response.json()
                required_fields = ['balance', 'reward_points', 'store_credits', 'tier', 'total_spent']
                missing_fields = [field for field in required_fields if field not in wallet_data]
                
                if missing_fields:
                    success = False
                    details = f"Missing wallet fields: {missing_fields}"
                else:
                    details = f"Wallet info retrieved - Balance: ₹{wallet_data['balance']}, Points: {wallet_data['reward_points']}, Credits: ₹{wallet_data['store_credits']}, Tier: {wallet_data['tier']}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("User Wallet Info", success, details)
            return success
            
        except Exception as e:
            self.log_test("User Wallet Info", False, str(e))
            return False

    def test_save_user_photo(self, user_id):
        """Test saving photo to user profile"""
        if not user_id:
            self.log_test("Save User Photo", False, "No user ID available")
            return False, None
            
        try:
            # Create test image data
            test_image = self.create_test_image()
            image_base64 = base64.b64encode(test_image.getvalue()).decode('utf-8')
            
            photo_data = {
                "user_id": user_id,
                "name": f"Family Vacation Photo {datetime.now().strftime('%H%M%S')}",
                "image_data": image_base64,
                "dimensions": {"width": 800, "height": 600},
                "size": 0.5,
                "tags": ["family", "vacation", "memories"],
                "notes": "Beautiful family moment from our trip"
            }
            
            response = requests.post(f"{self.api_url}/users/{user_id}/photos", json=photo_data, timeout=15)
            success = response.status_code == 200
            
            if success:
                saved_photo = response.json()
                required_fields = ['id', 'user_id', 'name', 'image_data', 'dimensions', 'tags', 'favorite', 'usage_count']
                missing_fields = [field for field in required_fields if field not in saved_photo]
                
                if missing_fields:
                    success = False
                    details = f"Missing photo fields: {missing_fields}"
                    photo_id = None
                else:
                    photo_id = saved_photo['id']
                    details = f"Photo saved successfully - ID: {photo_id}, Name: {saved_photo['name']}, Tags: {saved_photo['tags']}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                photo_id = None
            
            self.log_test("Save User Photo", success, details)
            return success, photo_id
            
        except Exception as e:
            self.log_test("Save User Photo", False, str(e))
            return False, None

    def test_get_user_photos(self, user_id):
        """Test retrieving user's saved photos"""
        if not user_id:
            self.log_test("Get User Photos", False, "No user ID available")
            return False
            
        try:
            response = requests.get(f"{self.api_url}/users/{user_id}/photos", timeout=10)
            success = response.status_code == 200
            
            if success:
                photos = response.json()
                details = f"Retrieved {len(photos)} photos for user"
                
                # If photos exist, check structure
                if photos:
                    first_photo = photos[0]
                    required_fields = ['id', 'user_id', 'name', 'image_data', 'dimensions', 'tags', 'favorite', 'usage_count']
                    missing_fields = [field for field in required_fields if field not in first_photo]
                    
                    if missing_fields:
                        success = False
                        details += f", Missing fields in photo: {missing_fields}"
                    else:
                        details += f", First photo: {first_photo['name']}, Favorite: {first_photo['favorite']}, Usage: {first_photo['usage_count']}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get User Photos", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get User Photos", False, str(e))
            return False

    def test_toggle_photo_favorite(self, user_id, photo_id):
        """Test toggling photo favorite status"""
        if not user_id or not photo_id:
            self.log_test("Toggle Photo Favorite", False, "Missing user ID or photo ID")
            return False
            
        try:
            response = requests.put(f"{self.api_url}/users/{user_id}/photos/{photo_id}/favorite", timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                has_favorite_field = 'favorite' in result
                
                if has_favorite_field:
                    details = f"Photo favorite status toggled to: {result['favorite']}"
                else:
                    success = False
                    details = "Missing favorite field in response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Toggle Photo Favorite", success, details)
            return success
            
        except Exception as e:
            self.log_test("Toggle Photo Favorite", False, str(e))
            return False

    def test_record_photo_usage(self, user_id, photo_id):
        """Test recording photo usage"""
        if not user_id or not photo_id:
            self.log_test("Record Photo Usage", False, "Missing user ID or photo ID")
            return False
            
        try:
            response = requests.put(f"{self.api_url}/users/{user_id}/photos/{photo_id}/use", timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                has_message = 'message' in result
                
                if has_message:
                    details = f"Photo usage recorded: {result['message']}"
                else:
                    success = False
                    details = "Missing message field in response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Record Photo Usage", success, details)
            return success
            
        except Exception as e:
            self.log_test("Record Photo Usage", False, str(e))
            return False

    def test_add_money_to_wallet(self, user_id):
        """Test adding money to user wallet"""
        if not user_id:
            self.log_test("Add Money to Wallet", False, "No user ID available")
            return False
            
        try:
            amount = 1000.0
            response = requests.post(f"{self.api_url}/users/{user_id}/wallet/add-money?amount={amount}", 
                                   timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                required_fields = ['new_balance', 'transaction_id']
                missing_fields = [field for field in required_fields if field not in result]
                
                if missing_fields:
                    success = False
                    details = f"Missing wallet response fields: {missing_fields}"
                else:
                    details = f"Money added successfully - New balance: ₹{result['new_balance']}, Transaction ID: {result['transaction_id']}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Add Money to Wallet", success, details)
            return success
            
        except Exception as e:
            self.log_test("Add Money to Wallet", False, str(e))
            return False

    def test_convert_points_to_credits(self, user_id):
        """Test converting reward points to store credits"""
        if not user_id:
            self.log_test("Convert Points to Credits", False, "No user ID available")
            return False
            
        try:
            # First, ensure user has enough points by updating their profile
            points_update = {"points": 500}  # Give user 500 points
            update_response = requests.put(f"{self.api_url}/users/{user_id}", json=points_update, timeout=10)
            
            if update_response.status_code != 200:
                self.log_test("Convert Points to Credits", False, "Failed to add points to user for testing")
                return False
            
            points_to_convert = 200  # Should give ₹20 store credit
            response = requests.post(f"{self.api_url}/users/{user_id}/wallet/convert-points?points={points_to_convert}", 
                                   timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                required_fields = ['points_remaining', 'store_credits', 'credit_earned']
                missing_fields = [field for field in required_fields if field not in result]
                
                if missing_fields:
                    success = False
                    details = f"Missing conversion response fields: {missing_fields}"
                else:
                    expected_credit = (points_to_convert / 100) * 10  # 200 points = ₹20
                    credit_correct = result['credit_earned'] == expected_credit
                    details = f"Points converted - Remaining: {result['points_remaining']}, Credits earned: ₹{result['credit_earned']}, Store credits: ₹{result['store_credits']}, Calculation correct: {credit_correct}"
                    if not credit_correct:
                        success = False
                        details += f" - Expected ₹{expected_credit} but got ₹{result['credit_earned']}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Convert Points to Credits", success, details)
            return success
            
        except Exception as e:
            self.log_test("Convert Points to Credits", False, str(e))
            return False

    def test_get_wallet_transactions(self, user_id):
        """Test getting wallet transaction history"""
        if not user_id:
            self.log_test("Get Wallet Transactions", False, "No user ID available")
            return False
            
        try:
            response = requests.get(f"{self.api_url}/users/{user_id}/wallet/transactions", timeout=10)
            success = response.status_code == 200
            
            if success:
                transactions = response.json()
                details = f"Retrieved {len(transactions)} transactions"
                
                # If transactions exist, check structure
                if transactions:
                    first_txn = transactions[0]
                    required_fields = ['id', 'user_id', 'type', 'amount', 'description', 'category', 'balance_after', 'created_at']
                    missing_fields = [field for field in required_fields if field not in first_txn]
                    
                    if missing_fields:
                        success = False
                        details += f", Missing transaction fields: {missing_fields}"
                    else:
                        details += f", Latest transaction: {first_txn['type']} ₹{first_txn['amount']} - {first_txn['description']}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Wallet Transactions", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Wallet Transactions", False, str(e))
            return False

    def test_wallet_payment(self, user_id):
        """Test making payment using wallet balance"""
        if not user_id:
            self.log_test("Wallet Payment", False, "No user ID available")
            return False
            
        try:
            amount = 299.0
            order_id = f"ORDER_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            response = requests.post(f"{self.api_url}/users/{user_id}/wallet/pay?amount={amount}&order_id={order_id}", 
                                   timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                required_fields = ['payment_successful', 'new_balance', 'tier', 'transaction_id']
                missing_fields = [field for field in required_fields if field not in result]
                
                if missing_fields:
                    success = False
                    details = f"Missing payment response fields: {missing_fields}"
                else:
                    payment_success = result['payment_successful']
                    details = f"Payment processed - Success: {payment_success}, New balance: ₹{result['new_balance']}, Tier: {result['tier']}, Transaction ID: {result['transaction_id']}"
                    if not payment_success:
                        success = False
                        details += " - Payment marked as unsuccessful"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Wallet Payment", success, details)
            return success
            
        except Exception as e:
            self.log_test("Wallet Payment", False, str(e))
            return False

    def test_delete_user_photo(self, user_id, photo_id):
        """Test deleting user photo"""
        if not user_id or not photo_id:
            self.log_test("Delete User Photo", False, "Missing user ID or photo ID")
            return False
            
        try:
            response = requests.delete(f"{self.api_url}/users/{user_id}/photos/{photo_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                has_message = 'message' in result
                
                if has_message:
                    details = f"Photo deleted: {result['message']}"
                else:
                    success = False
                    details = "Missing message field in response"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Delete User Photo", success, details)
            return success
            
        except Exception as e:
            self.log_test("Delete User Photo", False, str(e))
            return False

    def test_create_review(self):
        """Test creating a new review"""
        try:
            review_data = {
                "name": f"Sarah Johnson {datetime.now().strftime('%H%M%S')}",
                "rating": 5,
                "comment": "Absolutely love my custom photo frame! The quality is exceptional and the wooden finish is beautiful. The team at Memories did an amazing job bringing my family photo to life. Highly recommend for anyone looking for premium photo frames in Coimbatore!",
                "photos": ["https://images.unsplash.com/photo-1465161191540-aac346fcbaff"],
                "product_id": "premium-wooden-frame"
            }
            
            response = requests.post(f"{self.api_url}/reviews", json=review_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                review = response.json()
                required_fields = ['id', 'name', 'rating', 'comment', 'approved', 'created_at']
                missing_fields = [field for field in required_fields if field not in review]
                
                if missing_fields:
                    success = False
                    details = f"Missing review fields: {missing_fields}"
                else:
                    # Check if review is auto-approved
                    auto_approved = review.get('approved', False)
                    details = f"Review created - ID: {review['id']}, Rating: {review['rating']}/5, Auto-approved: {auto_approved}, Name: {review['name']}"
                    if not auto_approved:
                        details += " (Warning: Review not auto-approved)"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Create Review", success, details)
            return success, review.get('id') if success else None
            
        except Exception as e:
            self.log_test("Create Review", False, str(e))
            return False, None

    def test_get_reviews_basic(self):
        """Test getting reviews with basic parameters"""
        try:
            response = requests.get(f"{self.api_url}/reviews", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ['reviews', 'total_count', 'has_more', 'rating_stats']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    success = False
                    details = f"Missing response fields: {missing_fields}"
                else:
                    reviews = data['reviews']
                    total_count = data['total_count']
                    has_more = data['has_more']
                    rating_stats = data['rating_stats']
                    
                    details = f"Retrieved {len(reviews)} reviews, Total: {total_count}, Has more: {has_more}"
                    
                    # Check rating stats structure
                    if 'total_reviews' in rating_stats and 'average_rating' in rating_stats and 'rating_distribution' in rating_stats:
                        details += f", Avg rating: {rating_stats['average_rating']}, Total reviews in stats: {rating_stats['total_reviews']}"
                    else:
                        success = False
                        details += " - Invalid rating stats structure"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Reviews - Basic", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Reviews - Basic", False, str(e))
            return False

    def test_get_reviews_with_pagination(self):
        """Test getting reviews with pagination parameters"""
        try:
            # Test with limit and offset
            params = {"limit": 5, "offset": 0}
            response = requests.get(f"{self.api_url}/reviews", params=params, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                reviews = data.get('reviews', [])
                total_count = data.get('total_count', 0)
                has_more = data.get('has_more', False)
                
                # Check pagination logic
                expected_has_more = total_count > 5
                pagination_correct = (len(reviews) <= 5) and (has_more == expected_has_more or total_count <= 5)
                
                details = f"Pagination test - Limit: 5, Retrieved: {len(reviews)}, Total: {total_count}, Has more: {has_more}, Logic correct: {pagination_correct}"
                
                if not pagination_correct:
                    success = False
                    details += " - Pagination logic error"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Reviews - Pagination", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Reviews - Pagination", False, str(e))
            return False

    def test_get_reviews_with_filters(self):
        """Test getting reviews with rating filter"""
        try:
            # Test with rating filter
            params = {"rating_filter": 5, "approved_only": True}
            response = requests.get(f"{self.api_url}/reviews", params=params, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                reviews = data.get('reviews', [])
                
                # Check if all reviews have rating 5
                rating_filter_correct = all(review.get('rating') == 5 for review in reviews) if reviews else True
                approved_filter_correct = all(review.get('approved', False) for review in reviews) if reviews else True
                
                details = f"Filter test - Rating filter: 5, Retrieved: {len(reviews)} reviews, Rating filter correct: {rating_filter_correct}, Approved filter correct: {approved_filter_correct}"
                
                if not (rating_filter_correct and approved_filter_correct):
                    success = False
                    details += " - Filter logic error"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Reviews - Filters", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Reviews - Filters", False, str(e))
            return False

    def test_get_review_stats(self):
        """Test getting review statistics"""
        try:
            response = requests.get(f"{self.api_url}/reviews/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                stats = response.json()
                required_fields = ['total_reviews', 'average_rating', 'rating_distribution']
                missing_fields = [field for field in required_fields if field not in stats]
                
                if missing_fields:
                    success = False
                    details = f"Missing stats fields: {missing_fields}"
                else:
                    total_reviews = stats['total_reviews']
                    average_rating = stats['average_rating']
                    rating_dist = stats['rating_distribution']
                    
                    # Check rating distribution structure
                    expected_ratings = ['1', '2', '3', '4', '5']
                    dist_complete = all(rating in rating_dist for rating in expected_ratings)
                    
                    details = f"Stats retrieved - Total: {total_reviews}, Avg: {average_rating}, Distribution complete: {dist_complete}"
                    
                    if not dist_complete:
                        success = False
                        details += " - Incomplete rating distribution"
                    
                    # Validate average rating range
                    if total_reviews > 0 and not (0 <= average_rating <= 5):
                        success = False
                        details += f" - Invalid average rating: {average_rating}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Review Stats", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Review Stats", False, str(e))
            return False

    def test_reviews_workflow(self):
        """Test complete reviews API workflow"""
        print("\n⭐ Testing Reviews API Workflow")
        print("-" * 50)
        
        # Step 1: Create multiple test reviews
        review_creation_success = []
        review_ids = []
        
        # Create 3 test reviews with different ratings
        test_reviews = [
            {
                "name": f"Emily Chen {datetime.now().strftime('%H%M%S')}",
                "rating": 5,
                "comment": "Outstanding service! My custom photo mug turned out perfect. The sublimation printing quality is top-notch and the colors are vibrant. Will definitely order again from Memories!",
                "photos": ["https://images.unsplash.com/photo-1628313388777-9b9a751dfc6a"],
                "product_id": "photo-mug"
            },
            {
                "name": f"Rajesh Kumar {datetime.now().strftime('%H%M%S')}",
                "rating": 4,
                "comment": "Great quality frames and fast delivery. The wooden frame looks elegant and the photo quality is excellent. Minor delay in delivery but overall satisfied with the service.",
                "photos": [],
                "product_id": "wooden-frame"
            },
            {
                "name": f"Priya Sharma {datetime.now().strftime('%H%M%S')}",
                "rating": 5,
                "comment": "Absolutely love the acrylic frame! Crystal clear and modern design. Perfect for our office space. The team was very helpful with customization options.",
                "photos": ["https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f"],
                "product_id": "acrylic-frame"
            }
        ]
        
        for i, review_data in enumerate(test_reviews):
            try:
                response = requests.post(f"{self.api_url}/reviews", json=review_data, timeout=10)
                success = response.status_code == 200
                review_creation_success.append(success)
                
                if success:
                    review = response.json()
                    review_ids.append(review.get('id'))
                    print(f"✅ Created review {i+1}: {review_data['name']} - {review_data['rating']} stars")
                else:
                    print(f"❌ Failed to create review {i+1}: {response.status_code}")
                    
            except Exception as e:
                review_creation_success.append(False)
                print(f"❌ Error creating review {i+1}: {str(e)}")
        
        # Step 2: Test all review endpoints
        basic_get_success = self.test_get_reviews_basic()
        pagination_success = self.test_get_reviews_with_pagination()
        filter_success = self.test_get_reviews_with_filters()
        stats_success = self.test_get_review_stats()
        
        # Calculate workflow success
        workflow_tests = review_creation_success + [basic_get_success, pagination_success, filter_success, stats_success]
        workflow_success_rate = sum(workflow_tests) / len(workflow_tests) * 100
        
        print(f"\n📊 Reviews API Workflow Success Rate: {workflow_success_rate:.1f}%")
        
        return workflow_success_rate > 80

    def test_enhanced_ai_gift_finder_workflow(self):
        """Test complete Enhanced AI Gift Finder workflow"""
        print("\n🧠 Testing Enhanced AI Gift Finder Workflow")
        print("-" * 50)
        
        # Test 1: Basic AI functionality (current backend)
        basic_ai_success = self.test_ai_gift_suggestions()
        
        # Test 2: Enhanced AI with contextual answers
        enhanced_ai_success = self.test_enhanced_ai_gift_suggestions()
        
        # Test 3: AI with photo preview data
        photo_ai_success = self.test_ai_gift_suggestions_with_photo()
        
        # Test 4: Confidence scores and reasoning
        confidence_success = self.test_ai_confidence_and_reasoning()
        
        # Calculate workflow success
        ai_tests = [basic_ai_success, enhanced_ai_success, photo_ai_success, confidence_success]
        ai_success_rate = sum(ai_tests) / len(ai_tests) * 100
        
        print(f"\n📊 Enhanced AI Gift Finder Success Rate: {ai_success_rate:.1f}%")
        
        # Detailed analysis
        if basic_ai_success and not enhanced_ai_success:
            print("⚠️  Backend supports basic AI but not enhanced contextual format")
        if enhanced_ai_success and not photo_ai_success:
            print("⚠️  Enhanced AI works but photo integration needs improvement")
        if not confidence_success:
            print("⚠️  AI suggestions lack confidence scores and detailed reasoning")
        
    def test_profile_enhancement_workflow(self):
        """Test complete profile enhancement workflow"""
        print("\n🔧 Testing Profile Enhancement APIs Workflow")
        print("-" * 50)
        
        # Step 1: Create a test user
        user_success, user_id = self.test_create_user()
        if not user_success:
            return False
        
        # Step 2: Test enhanced profile update
        profile_success = self.test_enhanced_user_profile_update(user_id)
        
        # Step 3: Test wallet info retrieval
        wallet_info_success = self.test_user_wallet_info(user_id)
        
        # Step 4: Test photo storage workflow
        photo_save_success, photo_id = self.test_save_user_photo(user_id)
        photo_get_success = self.test_get_user_photos(user_id)
        
        if photo_id:
            favorite_success = self.test_toggle_photo_favorite(user_id, photo_id)
            usage_success = self.test_record_photo_usage(user_id, photo_id)
        else:
            favorite_success = usage_success = False
        
        # Step 5: Test wallet operations
        add_money_success = self.test_add_money_to_wallet(user_id)
        convert_points_success = self.test_convert_points_to_credits(user_id)
        transactions_success = self.test_get_wallet_transactions(user_id)
        payment_success = self.test_wallet_payment(user_id)
        
        # Step 6: Test photo deletion (cleanup)
        if photo_id:
            delete_success = self.test_delete_user_photo(user_id, photo_id)
        else:
            delete_success = False
        
        # Calculate workflow success
        workflow_tests = [
            profile_success, wallet_info_success, photo_save_success, photo_get_success,
            favorite_success, usage_success, add_money_success, convert_points_success,
            transactions_success, payment_success, delete_success
        ]
        
        workflow_success_rate = sum(workflow_tests) / len(workflow_tests) * 100
        
        print(f"\n📊 Profile Enhancement Workflow Success Rate: {workflow_success_rate:.1f}%")
        
        return workflow_success_rate > 80

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
        
        # Test AI functionality - Enhanced AI Gift Finder
        self.test_enhanced_ai_gift_finder_workflow()
        
        # Test Profile Enhancement APIs
        self.test_profile_enhancement_workflow()
        
        # Test Reviews API System
        self.test_reviews_workflow()
        
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