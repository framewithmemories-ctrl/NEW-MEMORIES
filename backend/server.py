from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage
import base64
import io
from PIL import Image


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    rating: int = Field(ge=1, le=5)
    comment: str
    photos: Optional[List[str]] = []
    product_id: Optional[str] = None
    approved: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    name: str
    rating: int = Field(ge=1, le=5)
    comment: str
    photos: Optional[List[str]] = []
    product_id: Optional[str] = None

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str
    base_price: float
    sizes: List[dict]
    materials: List[dict]
    colors: List[dict]
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    base_price: float
    sizes: List[dict]
    materials: List[dict]
    colors: List[dict]
    image_url: str

class CustomDesign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    image_data: str
    customizations: dict
    preview_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomDesignCreate(BaseModel):
    user_id: str
    product_id: str
    image_data: str
    customizations: dict

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    preferences: Optional[str] = None
    points: int = 0
    tier: str = "Silver"
    wallet_balance: float = 0.0
    store_credits: float = 0.0
    total_spent: float = 0.0
    
    # New Profile Enhancement Fields
    date_of_birth: Optional[str] = None  # Format: YYYY-MM-DD
    important_dates: List[dict] = []  # [{name, date, type, reminder_enabled}]
    reminder_preferences: dict = {
        "email": False,
        "sms": False, 
        "whatsapp": False
    }
    privacy_consent: dict = {
        "marketing_consent": False,
        "data_processing_consent": True,
        "reminder_consent": False,
        "consent_timestamp": None
    }
    data_retention: dict = {
        "auto_delete_photos": True,
        "retention_period_months": 24,
        "last_activity": None
    }
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    preferences: Optional[str] = None

class SavedPhoto(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    image_data: str
    image_url: Optional[str] = None
    dimensions: dict
    size: float  # in MB
    tags: List[str] = []
    notes: Optional[str] = None
    favorite: bool = False
    usage_count: int = 0
    last_used: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SavedPhotoCreate(BaseModel):
    user_id: str
    name: str
    image_data: str
    image_url: Optional[str] = None
    dimensions: dict
    size: float
    tags: List[str] = []
    notes: Optional[str] = None

class WalletTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # 'credit', 'debit', 'conversion'
    amount: float
    description: str
    category: str  # 'topup', 'purchase', 'rewards', 'conversion'
    order_id: Optional[str] = None
    status: str = "completed"
    balance_after: float
    is_points: bool = False
    credit_earned: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WalletTransactionCreate(BaseModel):
    user_id: str
    type: str
    amount: float
    description: str
    category: str
    order_id: Optional[str] = None
    balance_after: float
    is_points: bool = False
    credit_earned: Optional[float] = None

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[dict]
    total_amount: float
    status: str = "pending"
    delivery_type: str  # "pickup" or "delivery"
    delivery_address: Optional[dict] = None
    pickup_slot: Optional[str] = None
    points_earned: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    user_id: str
    items: List[dict]
    total_amount: float
    delivery_type: str
    delivery_address: Optional[dict] = None
    pickup_slot: Optional[str] = None

class GiftQuizResponse(BaseModel):
    recipient: str
    occasion: str
    age_group: str
    interests: List[str] = []
    budget: str
    relationship: str

class EnhancedGiftRequest(BaseModel):
    answers: Optional[dict] = None
    contextual: Optional[bool] = False
    aiEnhanced: Optional[bool] = False
    previewPhoto: Optional[dict] = None
    # Support legacy format
    recipient: Optional[str] = None
    occasion: Optional[str] = None
    age_group: Optional[str] = None
    interests: Optional[List[str]] = []
    budget: Optional[str] = None
    relationship: Optional[str] = None

# Initialize sample products for Memories
sample_products = [
    {
        "name": "Premium Wooden Photo Frame",
        "description": "Handcrafted wooden frame perfect for your precious memories",
        "category": "frames",
        "base_price": 899.0,
        "sizes": [
            {"name": "8x10", "price_add": 0},
            {"name": "12x16", "price_add": 300},
            {"name": "16x20", "price_add": 600},
            {"name": "20x24", "price_add": 1000}
        ],
        "materials": [
            {"name": "Teak Wood", "price_add": 0},
            {"name": "Mahogany", "price_add": 200},
            {"name": "Oak Wood", "price_add": 150}
        ],
        "colors": [
            {"name": "Natural Wood", "price_add": 0},
            {"name": "Dark Brown", "price_add": 50},
            {"name": "Black Finish", "price_add": 75}
        ],
        "image_url": "https://images.unsplash.com/photo-1465161191540-aac346fcbaff"
    },
    {
        "name": "Crystal Clear Acrylic Frame",
        "description": "Modern acrylic frame with crystal-clear transparency",
        "category": "acrylic",
        "base_price": 1299.0,
        "sizes": [
            {"name": "8x10", "price_add": 0},
            {"name": "12x16", "price_add": 400},
            {"name": "16x20", "price_add": 700},
            {"name": "20x24", "price_add": 1100}
        ],
        "materials": [
            {"name": "Premium Acrylic", "price_add": 0},
            {"name": "UV Protected", "price_add": 300}
        ],
        "colors": [
            {"name": "Crystal Clear", "price_add": 0},
            {"name": "Frosted", "price_add": 150}
        ],
        "image_url": "https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f"
    },
    {
        "name": "Personalized Photo Mug",
        "description": "Custom ceramic mug with sublimation printing - perfect gift",
        "category": "mugs",
        "base_price": 299.0,
        "sizes": [
            {"name": "11oz Standard", "price_add": 0},
            {"name": "15oz Large", "price_add": 100},
            {"name": "Magic Color Changing", "price_add": 200}
        ],
        "materials": [
            {"name": "Ceramic", "price_add": 0},
            {"name": "Premium Ceramic", "price_add": 100}
        ],
        "colors": [
            {"name": "White", "price_add": 0},
            {"name": "Black", "price_add": 50},
            {"name": "Colored Handle", "price_add": 75}
        ],
        "image_url": "https://images.unsplash.com/photo-1628313388777-9b9a751dfc6a"
    },
    {
        "name": "Custom T-Shirt Printing",
        "description": "High-quality sublimation printed t-shirts with your design",
        "category": "t-shirts",
        "base_price": 399.0,
        "sizes": [
            {"name": "S", "price_add": 0},
            {"name": "M", "price_add": 0},
            {"name": "L", "price_add": 50},
            {"name": "XL", "price_add": 100},
            {"name": "XXL", "price_add": 150}
        ],
        "materials": [
            {"name": "100% Cotton", "price_add": 0},
            {"name": "Cotton Blend", "price_add": 50},
            {"name": "Premium Cotton", "price_add": 150}
        ],
        "colors": [
            {"name": "White", "price_add": 0},
            {"name": "Black", "price_add": 25},
            {"name": "Colored", "price_add": 50}
        ],
        "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27"
    },
    {
        "name": "Corporate Gift Package",
        "description": "Professional corporate gifts with custom branding solutions",
        "category": "corporate",
        "base_price": 999.0,
        "sizes": [
            {"name": "Basic Package", "price_add": 0},
            {"name": "Standard Package", "price_add": 500},
            {"name": "Premium Package", "price_add": 1000}
        ],
        "materials": [
            {"name": "Standard Quality", "price_add": 0},
            {"name": "Premium Quality", "price_add": 300}
        ],
        "colors": [
            {"name": "Corporate Theme", "price_add": 0},
            {"name": "Custom Branding", "price_add": 200}
        ],
        "image_url": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a"
    }
]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Memories - Photo Frames & Customized Gift Shop API Ready! 📸🎁"}

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {}
    if category and category != 'All':
        query["category"] = category.lower()
    
    products = await db.products.find(query).to_list(100)
    if not products:
        # Initialize with sample products if empty
        for product_data in sample_products:
            product = Product(**product_data)
            await db.products.insert_one(product.dict())
        products = await db.products.find(query).to_list(100)
    
    return [Product(**product) for product in products]

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_obj = Product(**product.dict())
    await db.products.insert_one(product_obj.dict())
    return product_obj

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        return User(**existing_user)
    
    user_obj = User(**user.dict())
    await db.users.insert_one(user_obj.dict())
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.post("/designs", response_model=CustomDesign)
async def create_design(design: CustomDesignCreate):
    design_obj = CustomDesign(**design.dict())
    await db.designs.insert_one(design_obj.dict())
    return design_obj

@api_router.get("/designs/{user_id}")
async def get_user_designs(user_id: str):
    designs = await db.designs.find({"user_id": user_id}).to_list(50)
    return [CustomDesign(**design) for design in designs]

@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image (JPG, PNG, HEIC)")
    
    # Read and process image
    contents = await file.read()
    
    # Convert to base64 for storage/preview
    image_base64 = base64.b64encode(contents).decode('utf-8')
    
    # Basic image validation with enhanced feedback
    try:
        image = Image.open(io.BytesIO(contents))
        width, height = image.size
        
        # Quality warning with specific recommendations
        quality_warning = width < 1500 or height < 1500
        
        if quality_warning:
            message = f"⚠️ Image resolution is {width}x{height}px. For best print quality, we recommend minimum 2000x2000px. Current image is suitable for smaller sizes (8x10 or 12x16)."
        else:
            message = f"✅ Excellent quality image ({width}x{height}px) - Perfect for all frame sizes!"
        
        return {
            "success": True,
            "image_data": image_base64,
            "dimensions": {"width": width, "height": height},
            "quality_warning": quality_warning,
            "message": message,
            "recommended_sizes": ["8x10", "12x16"] if quality_warning else ["8x10", "12x16", "16x20", "20x24"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file. Please upload JPG, PNG, or HEIC format.")

@api_router.post("/gift-suggestions")
async def get_gift_suggestions(request: EnhancedGiftRequest):
    try:
        # Handle both legacy and enhanced formats
        if request.answers:
            # Enhanced format - extract data from answers
            quiz_data = GiftQuizResponse(
                recipient=request.answers.get('recipient', 'Friend'),
                occasion=request.answers.get('occasion', 'birthday'),
                age_group=request.answers.get('age_group', 'Adult (31-50)'),
                interests=request.answers.get('interests', []),
                budget=request.answers.get('budget', 'mid_range'),
                relationship=request.answers.get('relationship', 'friend')
            )
            
            # Enhanced AI processing with photo analysis
            enhanced_processing = request.aiEnhanced
            photo_data = request.previewPhoto
            
        else:
            # Legacy format - use direct fields
            quiz_data = GiftQuizResponse(
                recipient=request.recipient or 'Friend',
                occasion=request.occasion or 'birthday',
                age_group=request.age_group or 'Adult (31-50)',
                interests=request.interests or [],
                budget=request.budget or 'mid_range',
                relationship=request.relationship or 'friend'
            )
            enhanced_processing = False
            photo_data = None
        
        # Initialize LLM chat for gift suggestions
        emergent_key = os.environ.get('EMERGENT_LLM_KEY', '')
        if not emergent_key:
            raise HTTPException(status_code=500, detail="AI service temporarily unavailable")
        
        # Enhanced system message for contextual AI
        system_message = """You are a gifting expert for "Memories - Photo Frames & Customized Gift Shop" located in Coimbatore. 
        We specialize in:
        - Premium Photo Frames (wooden, acrylic, LED)
        - Sublimation Printing (mugs, t-shirts)
        - Corporate Gifts & Bulk Orders
        - Personalized Memory Products
        
        Based on the user's preferences, suggest 3-4 specific gift recommendations with:
        1. Product name with personalization ideas
        2. Why it's perfect for this recipient/occasion (detailed reasoning)
        3. Estimated price range
        4. Customization suggestions
        5. Confidence score (1-100) for each recommendation
        
        Keep suggestions warm, personal, and focused on creating lasting memories. Always mention we're located in Keeranatham Road, Coimbatore and offer free home delivery."""
        
        if enhanced_processing and photo_data:
            system_message += f"""
            
            PHOTO ANALYSIS CONTEXT:
            The user has uploaded a preview photo with dimensions {photo_data.get('dimensions', {})} and analysis: {photo_data.get('analysis', 'No analysis available')}.
            Consider the photo's aspect ratio and style when making frame recommendations.
            """
        
        chat = LlmChat(
            api_key=emergent_key,
            session_id=f"memories_gift_quiz_{uuid.uuid4()}",
            system_message=system_message
        ).with_model("openai", "gpt-4o-mini")
        
        # Enhanced quiz text with photo context
        quiz_text = f"""
        Gift recipient: {quiz_data.recipient}
        Occasion: {quiz_data.occasion}
        Age group: {quiz_data.age_group}
        Interests: {', '.join(quiz_data.interests) if quiz_data.interests else 'Not specified'}
        Budget: {quiz_data.budget}
        Relationship: {quiz_data.relationship}
        """
        
        if enhanced_processing and photo_data:
            quiz_text += f"""
            Photo Context: User uploaded a preview photo ({photo_data.get('dimensions', {}).get('width', 'unknown')}x{photo_data.get('dimensions', {}).get('height', 'unknown')}px)
            Photo Analysis: {photo_data.get('analysis', 'No analysis available')}
            """
        
        if enhanced_processing:
            quiz_text += "\nPlease provide enhanced recommendations with confidence scores and detailed reasoning for each suggestion."
        
        user_message = UserMessage(text=f"Based on this information, suggest personalized gifts from Memories shop: {quiz_text}")
        response = await chat.send_message(user_message)
        
        return {
            "suggestions": response,
            "quiz_data": quiz_data.dict(),
            "enhanced": enhanced_processing,
            "photo_analyzed": photo_data is not None,
            "shop_info": {
                "name": "Memories - Photo Frames & Customized Gift Shop",
                "phone": "+91 81480 40148",
                "address": "19B Kani Illam, Keeranatham Road, Coimbatore",
                "specialties": ["Photo Frames", "Sublimation Printing", "Corporate Gifts"]
            }
        }
        
    except Exception as e:
        # Enhanced fallback suggestions based on quiz data
        fallback_suggestions = f"""Based on your preferences for {quiz_data.recipient} on {quiz_data.occasion}:

🎁 **AI-Recommended Gifts from Memories:**

1. **Premium Photo Frame Set** (₹899-1599) - **Confidence: 95%**
   - Perfect for showcasing precious memories
   - Available in wooden, acrylic, and LED options
   - Ideal for {quiz_data.occasion} celebrations
   - **Why AI chose this:** Frames are universally appreciated and perfect for creating lasting memories

2. **Custom Photo Mug** (₹299-499) - **Confidence: 88%**
   - Personalized with favorite photos
   - Great for daily use and memories
   - Sublimation printing for durability
   - **Why AI chose this:** Practical gift that brings joy every day, perfect for {quiz_data.relationship} relationship

3. **Personalized T-Shirt** (₹399-599) - **Confidence: 82%**
   - Custom design with photos or text
   - High-quality sublimation printing
   - Perfect casual gift
   - **Why AI chose this:** Trendy and personal, great for expressing creativity"""
        
        if enhanced_processing and photo_data:
            fallback_suggestions += f"""

4. **Custom Frame for Your Photo** (₹899-1899) - **Confidence: 92%**
   - Specifically designed for your uploaded photo ({photo_data.get('dimensions', {}).get('width', 'unknown')}x{photo_data.get('dimensions', {}).get('height', 'unknown')}px)
   - Perfect aspect ratio match
   - **Why AI chose this:** Your photo analysis shows {photo_data.get('analysis', 'great potential')} - ideal for framing"""

        fallback_suggestions += f"""

📍 **Visit Us:** 19B Kani Illam, Keeranatham Road, Coimbatore
📞 **Call:** +91 81480 40148
🚚 **Free Home Delivery Available!**

*We specialize in creating lasting memories through quality craftsmanship.*"""
        
        return {
            "suggestions": fallback_suggestions,
            "quiz_data": quiz_data.dict(),
            "enhanced": enhanced_processing,
            "photo_analyzed": photo_data is not None,
            "note": "Generated using our enhanced AI recommendations with confidence scoring"
        }

@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    # Calculate points earned (3% of order value for Memories customers)
    points_earned = int(order.total_amount * 0.03)
    
    order_dict = order.dict()
    order_dict["points_earned"] = points_earned
    order_obj = Order(**order_dict)
    
    await db.orders.insert_one(order_obj.dict())
    
    # Update user points
    if order.user_id:
        user = await db.users.find_one({"id": order.user_id})
        if user:
            new_points = user.get("points", 0) + points_earned
            # Update tier based on total points
            new_tier = "Platinum" if new_points >= 5000 else "Gold" if new_points >= 2000 else "Silver"
            
            await db.users.update_one(
                {"id": order.user_id},
                {"$set": {"points": new_points, "tier": new_tier}}
            )
    
    return order_obj

@api_router.get("/orders/{user_id}")
async def get_user_orders(user_id: str):
    orders = await db.orders.find({"user_id": user_id}).to_list(50)
    return [Order(**order) for order in orders]

# Review Management Endpoints
@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    """Create a new customer review"""
    try:
        review_obj = Review(**review.dict())
        
        # For now, auto-approve all reviews (can add moderation later)
        review_obj.approved = True
        
        await db.reviews.insert_one(review_obj.dict())
        return review_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create review")

@api_router.get("/reviews")
async def get_reviews(
    limit: int = 10,
    offset: int = 0,
    rating_filter: Optional[int] = None,
    approved_only: bool = True
):
    """Get reviews with pagination and filtering"""
    try:
        # Build filter query
        filter_query = {}
        if approved_only:
            filter_query["approved"] = True
        if rating_filter:
            filter_query["rating"] = rating_filter
        
        # Get total count
        total_count = await db.reviews.count_documents(filter_query)
        
        # Get reviews with pagination, sorted by newest first
        reviews = await db.reviews.find(filter_query).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
        
        # Calculate rating statistics
        all_reviews = await db.reviews.find({"approved": True}).to_list(1000)
        rating_stats = {
            "total_reviews": len(all_reviews),
            "average_rating": sum(r["rating"] for r in all_reviews) / len(all_reviews) if all_reviews else 0,
            "rating_distribution": {
                "5": len([r for r in all_reviews if r["rating"] == 5]),
                "4": len([r for r in all_reviews if r["rating"] == 4]),
                "3": len([r for r in all_reviews if r["rating"] == 3]),
                "2": len([r for r in all_reviews if r["rating"] == 2]),
                "1": len([r for r in all_reviews if r["rating"] == 1]),
            }
        }
        
        return {
            "reviews": [Review(**review) for review in reviews],
            "total_count": total_count,
            "has_more": (offset + limit) < total_count,
            "rating_stats": rating_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch reviews")

@api_router.get("/reviews/stats")
async def get_review_stats():
    """Get review statistics for display"""
    try:
        all_reviews = await db.reviews.find({"approved": True}).to_list(1000)
        
        if not all_reviews:
            return {
                "total_reviews": 0,
                "average_rating": 0,
                "rating_distribution": {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
            }
        
        average_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        
        return {
            "total_reviews": len(all_reviews),
            "average_rating": round(average_rating, 1),
            "rating_distribution": {
                "5": len([r for r in all_reviews if r["rating"] == 5]),
                "4": len([r for r in all_reviews if r["rating"] == 4]),
                "3": len([r for r in all_reviews if r["rating"] == 3]),
                "2": len([r for r in all_reviews if r["rating"] == 2]),
                "1": len([r for r in all_reviews if r["rating"] == 1]),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch review statistics")

@api_router.get("/store-info")
async def get_store_info():
    return {
        "name": "Memories - Photo Frames & Customized Gift Shop",
        "tagline": "Creating Beautiful Memories Since 2020",
        "address": {
            "street": "19B Kani Illam, Keeranatham Road",
            "area": "Near Ruby School, Saravanampatti",
            "city": "Coimbatore",
            "state": "Tamil Nadu",
            "pincode": "641035",
            "landmark": "Near Ruby School"
        },
        "contact": {
            "phone": "+91 81480 40148",
            "whatsapp": "+91 81480 40148",
            "email": "memories@photogifthub.com"
        },
        "hours": {
            "monday_saturday": "9:30 AM - 9:00 PM",
            "sunday": "Closed",
            "note": "Extended hours during festive seasons"
        },
        "services": [
            "Premium Photo Frames",
            "Sublimation Printing",
            "Custom Photo Mugs",
            "Personalized T-Shirts",
            "Corporate Gifts",
            "Bulk Orders",
            "Free Home Delivery"
        ],
        "specialties": [
            "Handcrafted wooden frames",
            "Crystal clear acrylic frames", 
            "High-quality sublimation printing",
            "Same-day printing services",
            "Corporate branding solutions"
        ],
        "google_rating": "4.9/5",
        "total_reviews": 263,
        "established": 2020,
        "google_maps": "https://maps.google.com/?q=19B+Kani+Illam+Keeranatham+Road+Coimbatore"
    }

# Enhanced User Profile Endpoints
@api_router.put("/users/{user_id}")
async def update_user(user_id: str, user_data: dict):
    await db.users.update_one(
        {"id": user_id},
        {"$set": user_data}
    )
    updated_user = await db.users.find_one({"id": user_id})
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**updated_user)

# Photo Storage Endpoints
@api_router.post("/users/{user_id}/photos", response_model=SavedPhoto)
async def save_user_photo(user_id: str, photo: SavedPhotoCreate):
    photo_obj = SavedPhoto(**photo.dict())
    await db.user_photos.insert_one(photo_obj.dict())
    return photo_obj

@api_router.get("/users/{user_id}/photos")
async def get_user_photos(user_id: str):
    photos = await db.user_photos.find({"user_id": user_id}).to_list(100)
    return [SavedPhoto(**photo) for photo in photos]

@api_router.delete("/users/{user_id}/photos/{photo_id}")
async def delete_user_photo(user_id: str, photo_id: str):
    result = await db.user_photos.delete_one({"id": photo_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}

@api_router.put("/users/{user_id}/photos/{photo_id}/favorite")
async def toggle_photo_favorite(user_id: str, photo_id: str):
    photo = await db.user_photos.find_one({"id": photo_id, "user_id": user_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    new_favorite_status = not photo.get("favorite", False)
    await db.user_photos.update_one(
        {"id": photo_id, "user_id": user_id},
        {"$set": {"favorite": new_favorite_status}}
    )
    return {"favorite": new_favorite_status}

@api_router.put("/users/{user_id}/photos/{photo_id}/use")
async def use_photo_for_order(user_id: str, photo_id: str):
    await db.user_photos.update_one(
        {"id": photo_id, "user_id": user_id},
        {
            "$inc": {"usage_count": 1},
            "$set": {"last_used": datetime.now(timezone.utc)}
        }
    )
    return {"message": "Photo usage recorded"}

# Wallet Endpoints
@api_router.get("/users/{user_id}/wallet")
async def get_user_wallet(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "balance": user.get("wallet_balance", 0.0),
        "reward_points": user.get("points", 0),
        "store_credits": user.get("store_credits", 0.0),
        "tier": user.get("tier", "Silver"),
        "total_spent": user.get("total_spent", 0.0)
    }

@api_router.post("/users/{user_id}/wallet/add-money")
async def add_money_to_wallet(user_id: str, amount: float):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_balance = user.get("wallet_balance", 0.0) + amount
    
    # Update user wallet
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"wallet_balance": new_balance}}
    )
    
    # Record transaction
    transaction = WalletTransaction(
        user_id=user_id,
        type="credit",
        amount=amount,
        description="Money added to wallet",
        category="topup",
        balance_after=new_balance
    )
    await db.wallet_transactions.insert_one(transaction.dict())
    
    return {"new_balance": new_balance, "transaction_id": transaction.id}

@api_router.post("/users/{user_id}/wallet/convert-points")
async def convert_points_to_credits(user_id: str, points: int):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_points = user.get("points", 0)
    if points > current_points:
        raise HTTPException(status_code=400, detail="Insufficient points")
    
    # 100 points = ₹10 store credit
    credit_value = (points / 100) * 10
    new_points = current_points - points
    new_store_credits = user.get("store_credits", 0.0) + credit_value
    
    # Update user
    await db.users.update_one(
        {"id": user_id},
        {
            "$set": {
                "points": new_points,
                "store_credits": new_store_credits
            }
        }
    )
    
    # Record transaction
    transaction = WalletTransaction(
        user_id=user_id,
        type="conversion",
        amount=points,
        description=f"Converted {points} points to ₹{credit_value} store credit",
        category="conversion",
        balance_after=user.get("wallet_balance", 0.0),
        is_points=True,
        credit_earned=credit_value
    )
    await db.wallet_transactions.insert_one(transaction.dict())
    
    return {
        "points_remaining": new_points,
        "store_credits": new_store_credits,
        "credit_earned": credit_value
    }

@api_router.get("/users/{user_id}/wallet/transactions")
async def get_wallet_transactions(user_id: str, limit: int = 50):
    transactions = await db.wallet_transactions.find(
        {"user_id": user_id}
    ).sort("created_at", -1).to_list(limit)
    
    return [WalletTransaction(**txn) for txn in transactions]

@api_router.post("/users/{user_id}/wallet/pay")
async def pay_with_wallet(user_id: str, amount: float, order_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_balance = user.get("wallet_balance", 0.0)
    if amount > current_balance:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")
    
    new_balance = current_balance - amount
    new_total_spent = user.get("total_spent", 0.0) + amount
    
    # Update tier based on total spent
    new_tier = "Silver"
    if new_total_spent >= 10000:
        new_tier = "Platinum"
    elif new_total_spent >= 5000:
        new_tier = "Gold"
    
    # Update user
    await db.users.update_one(
        {"id": user_id},
        {
            "$set": {
                "wallet_balance": new_balance,
                "total_spent": new_total_spent,
                "tier": new_tier
            }
        }
    )
    
    # Record transaction
    transaction = WalletTransaction(
        user_id=user_id,
        type="debit",
        amount=amount,
        description=f"Payment for order #{order_id}",
        category="purchase",
        order_id=order_id,
        balance_after=new_balance
    )
    await db.wallet_transactions.insert_one(transaction.dict())
    
    return {
        "payment_successful": True,
        "new_balance": new_balance,
        "tier": new_tier,
        "transaction_id": transaction.id
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()