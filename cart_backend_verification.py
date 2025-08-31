#!/usr/bin/env python3
"""
Cart System Backend Verification Script
Focused testing for cart functionality backend support
"""

import requests
import json
import sys
from datetime import datetime

class CartBackendVerifier:
    def __init__(self, base_url="https://frameshop-repair.preview.emergentagent.com"):
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

    def test_backend_health_for_cart(self):
        """Test backend health specifically for cart support"""
        print("\n🏥 Backend Health Check for Cart System")
        print("-" * 50)
        
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Backend API responding: {data.get('message', 'OK')}"
            else:
                details = f"Backend not responding - Status: {response.status_code}"
            
            self.log_test("Backend Server Health", success, details)
            return success
            
        except Exception as e:
            self.log_test("Backend Server Health", False, str(e))
            return False

    def test_product_endpoints_for_cart(self):
        """Test product endpoints that cart system depends on"""
        print("\n📦 Product Endpoints for Cart System")
        print("-" * 50)
        
        # Test 1: Get all products
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            success = response.status_code == 200
            
            if success:
                products = response.json()
                success = len(products) > 0
                
                if success:
                    # Verify product structure for cart compatibility
                    first_product = products[0]
                    cart_required_fields = ['id', 'name', 'description', 'base_price', 'image_url', 'category']
                    missing_fields = [field for field in cart_required_fields if field not in first_product]
                    
                    if missing_fields:
                        success = False
                        details = f"Products missing cart-required fields: {missing_fields}"
                    else:
                        details = f"Found {len(products)} products with cart-compatible structure"
                        
                        # Check specific product data quality
                        valid_products = 0
                        for product in products:
                            if (product.get('base_price', 0) > 0 and 
                                product.get('name') and 
                                product.get('id')):
                                valid_products += 1
                        
                        details += f", {valid_products} products have valid cart data"
                else:
                    details = "No products found - cart cannot function"
            else:
                details = f"Products API failed - Status: {response.status_code}"
            
            self.log_test("Product Catalog API", success, details)
            return success, products if success else []
            
        except Exception as e:
            self.log_test("Product Catalog API", False, str(e))
            return False, []

    def test_product_search_for_cart(self):
        """Test product search/filtering for cart system"""
        print("\n🔍 Product Search for Cart System")
        print("-" * 50)
        
        categories = ['frames', 'mugs', 'acrylic', 't-shirts']
        search_success = True
        
        for category in categories:
            try:
                response = requests.get(f"{self.api_url}/products?category={category}", timeout=10)
                success = response.status_code == 200
                
                if success:
                    products = response.json()
                    # Verify category filtering works
                    category_match = all(p.get('category', '').lower() == category.lower() for p in products)
                    
                    details = f"Category '{category}': {len(products)} products, Filter working: {category_match}"
                    
                    if not category_match and len(products) > 0:
                        success = False
                        details += " - Category filter not working properly"
                else:
                    success = False
                    details = f"Category '{category}' search failed - Status: {response.status_code}"
                
                self.log_test(f"Product Search - {category.title()}", success, details)
                
                if not success:
                    search_success = False
                    
            except Exception as e:
                self.log_test(f"Product Search - {category.title()}", False, str(e))
                search_success = False
        
        return search_success

    def test_individual_product_retrieval(self, products):
        """Test individual product retrieval for cart item details"""
        print("\n🎯 Individual Product Retrieval")
        print("-" * 50)
        
        if not products:
            self.log_test("Individual Product Retrieval", False, "No products available for testing")
            return False
        
        # Test with first product
        test_product = products[0]
        product_id = test_product.get('id')
        
        try:
            response = requests.get(f"{self.api_url}/products/{product_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                product = response.json()
                # Verify product details match
                id_match = product.get('id') == product_id
                has_pricing = 'base_price' in product and product['base_price'] > 0
                has_options = 'sizes' in product and 'materials' in product and 'colors' in product
                
                details = f"Product {product_id}: ID match: {id_match}, Has pricing: {has_pricing}, Has options: {has_options}"
                
                if not (id_match and has_pricing):
                    success = False
                    details += " - Critical product data missing"
            else:
                details = f"Product retrieval failed - Status: {response.status_code}"
            
            self.log_test("Individual Product Retrieval", success, details)
            return success
            
        except Exception as e:
            self.log_test("Individual Product Retrieval", False, str(e))
            return False

    def test_cart_data_structure_compatibility(self, products):
        """Test if backend can handle cart data structures"""
        print("\n🛒 Cart Data Structure Compatibility")
        print("-" * 50)
        
        if not products:
            self.log_test("Cart Data Structure Test", False, "No products available for testing")
            return False
        
        # Create a test user first
        try:
            test_user = {
                "name": f"Cart Test User {datetime.now().strftime('%H%M%S')}",
                "email": f"cart_test_{datetime.now().strftime('%H%M%S')}@example.com",
                "phone": "+91 9876543210"
            }
            
            user_response = requests.post(f"{self.api_url}/users", json=test_user, timeout=10)
            if user_response.status_code != 200:
                self.log_test("Cart Data Structure Test", False, "Failed to create test user")
                return False
            
            user_data = user_response.json()
            user_id = user_data['id']
            
            # Test cart-like order structure
            test_product = products[0]
            cart_order = {
                "user_id": user_id,
                "items": [
                    {
                        "product_id": test_product['id'],
                        "name": test_product['name'],
                        "quantity": 2,
                        "price": test_product['base_price'],
                        "size": test_product['sizes'][0]['name'] if test_product.get('sizes') else "Standard",
                        "material": test_product['materials'][0]['name'] if test_product.get('materials') else "Standard",
                        "color": test_product['colors'][0]['name'] if test_product.get('colors') else "Standard",
                        "customizations": {
                            "size": test_product['sizes'][0]['name'] if test_product.get('sizes') else "Standard",
                            "material": test_product['materials'][0]['name'] if test_product.get('materials') else "Standard"
                        }
                    }
                ],
                "total_amount": test_product['base_price'] * 2,
                "delivery_type": "pickup",
                "pickup_slot": "2025-01-16 15:00"
            }
            
            response = requests.post(f"{self.api_url}/orders", json=cart_order, timeout=15)
            success = response.status_code == 200
            
            if success:
                order_data = response.json()
                required_fields = ['id', 'user_id', 'items', 'total_amount', 'status']
                missing_fields = [field for field in required_fields if field not in order_data]
                
                if missing_fields:
                    success = False
                    details = f"Order creation missing fields: {missing_fields}"
                else:
                    # Verify cart item structure is preserved
                    created_items = order_data.get('items', [])
                    item_structure_ok = len(created_items) > 0 and 'product_id' in created_items[0]
                    
                    details = f"Cart order created successfully - ID: {order_data['id']}, Items preserved: {item_structure_ok}"
                    
                    if not item_structure_ok:
                        success = False
                        details += " - Cart item structure not preserved"
            else:
                details = f"Cart order creation failed - Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Cart Data Structure Test", success, details)
            return success
            
        except Exception as e:
            self.log_test("Cart Data Structure Test", False, str(e))
            return False

    def test_backend_api_routes(self):
        """Test all API routes accessibility"""
        print("\n🛣️ API Routes Accessibility")
        print("-" * 50)
        
        critical_routes = [
            ("/", "Root API"),
            ("/products", "Products List"),
            ("/store-info", "Store Information"),
            ("/reviews/stats", "Reviews Statistics")
        ]
        
        routes_success = True
        
        for route, name in critical_routes:
            try:
                response = requests.get(f"{self.api_url}{route}", timeout=10)
                success = response.status_code == 200
                
                if success:
                    details = f"{name} accessible"
                else:
                    details = f"{name} not accessible - Status: {response.status_code}"
                    routes_success = False
                
                self.log_test(f"API Route - {name}", success, details)
                
            except Exception as e:
                self.log_test(f"API Route - {name}", False, str(e))
                routes_success = False
        
        return routes_success

    def test_database_connectivity(self):
        """Test MongoDB connectivity through backend"""
        print("\n🗄️ Database Connectivity")
        print("-" * 50)
        
        try:
            # Test database through products endpoint
            response = requests.get(f"{self.api_url}/products", timeout=10)
            success = response.status_code == 200
            
            if success:
                products = response.json()
                db_working = len(products) > 0
                
                if db_working:
                    details = f"Database connected - {len(products)} products loaded from MongoDB"
                else:
                    success = False
                    details = "Database connection issue - No products loaded"
            else:
                success = False
                details = f"Database connectivity test failed - Status: {response.status_code}"
            
            self.log_test("MongoDB Connectivity", success, details)
            return success
            
        except Exception as e:
            self.log_test("MongoDB Connectivity", False, str(e))
            return False

    def run_cart_backend_verification(self):
        """Run complete cart backend verification"""
        print("🛒 CART SYSTEM BACKEND VERIFICATION")
        print("=" * 60)
        print("Testing backend stability and cart system support...")
        print()
        
        # Test 1: Backend Health
        health_ok = self.test_backend_health_for_cart()
        
        # Test 2: Database Connectivity
        db_ok = self.test_database_connectivity()
        
        # Test 3: API Routes
        routes_ok = self.test_backend_api_routes()
        
        # Test 4: Product Endpoints
        products_ok, products = self.test_product_endpoints_for_cart()
        
        # Test 5: Product Search
        search_ok = self.test_product_search_for_cart()
        
        # Test 6: Individual Product Retrieval
        individual_ok = self.test_individual_product_retrieval(products)
        
        # Test 7: Cart Data Structure Compatibility
        cart_structure_ok = self.test_cart_data_structure_compatibility(products)
        
        # Calculate overall success
        all_tests = [health_ok, db_ok, routes_ok, products_ok, search_ok, individual_ok, cart_structure_ok]
        success_rate = sum(all_tests) / len(all_tests) * 100
        
        print("\n" + "=" * 60)
        print(f"📊 CART BACKEND VERIFICATION RESULTS")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 EXCELLENT: Backend fully ready for cart system")
        elif success_rate >= 75:
            print("✅ GOOD: Backend ready with minor issues")
        elif success_rate >= 60:
            print("⚠️ FAIR: Backend needs attention before cart deployment")
        else:
            print("❌ POOR: Backend has critical issues blocking cart system")
        
        print("\n🔍 DETAILED FINDINGS:")
        
        if health_ok and db_ok and routes_ok:
            print("✅ Backend infrastructure is stable and operational")
        else:
            print("❌ Backend infrastructure has critical issues")
        
        if products_ok and search_ok and individual_ok:
            print("✅ Product management APIs fully support cart functionality")
        else:
            print("❌ Product APIs have issues that may affect cart system")
        
        if cart_structure_ok:
            print("✅ Backend can handle cart data structures and order processing")
        else:
            print("❌ Backend cannot properly process cart data structures")
        
        print("\n📋 RECOMMENDATIONS:")
        
        if success_rate >= 90:
            print("• Backend is production-ready for cart system deployment")
            print("• Proceed with frontend cart bug fixes")
            print("• No backend changes required")
        elif success_rate >= 75:
            print("• Backend is mostly ready but monitor for issues")
            print("• Address any failed tests before full deployment")
            print("• Cart system should work with current backend")
        else:
            print("• Fix critical backend issues before cart deployment")
            print("• Review failed tests and implement fixes")
            print("• Consider backend stability improvements")
        
        return success_rate >= 75

if __name__ == "__main__":
    verifier = CartBackendVerifier()
    success = verifier.run_cart_backend_verification()
    sys.exit(0 if success else 1)