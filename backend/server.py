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
    points: int = 0
    tier: str = "Silver"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

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
    interests: List[str]
    budget: str
    relationship: str

# Initialize sample products
sample_products = [
    {
        "name": "Classic Wooden Frame",
        "description": "Handcrafted wooden frame perfect for cherished memories",
        "category": "frames",
        "base_price": 899.0,
        "sizes": [
            {"name": "8x10", "price_add": 0},
            {"name": "12x16", "price_add": 200},
            {"name": "16x20", "price_add": 400}
        ],
        "materials": [
            {"name": "Oak", "price_add": 0},
            {"name": "Teak", "price_add": 300},
            {"name": "Mahogany", "price_add": 500}
        ],
        "colors": [
            {"name": "Natural", "price_add": 0},
            {"name": "Dark Brown", "price_add": 50},
            {"name": "Black", "price_add": 50}
        ],
        "image_url": "https://images.unsplash.com/photo-1465161191540-aac346fcbaff"
    },
    {
        "name": "Premium Acrylic Frame",
        "description": "Modern acrylic frame with crystal-clear finish",
        "category": "frames",
        "base_price": 1299.0,
        "sizes": [
            {"name": "8x10", "price_add": 0},
            {"name": "12x16", "price_add": 300},
            {"name": "16x20", "price_add": 600}
        ],
        "materials": [
            {"name": "Clear Acrylic", "price_add": 0},
            {"name": "Frosted Acrylic", "price_add": 200}
        ],
        "colors": [
            {"name": "Clear", "price_add": 0},
            {"name": "Smoky", "price_add": 100}
        ],
        "image_url": "https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f"
    },
    {
        "name": "Custom Photo Mug",
        "description": "Personalized ceramic mug with your favorite photo",
        "category": "mugs",
        "base_price": 349.0,
        "sizes": [
            {"name": "11oz", "price_add": 0},
            {"name": "15oz", "price_add": 100}
        ],
        "materials": [
            {"name": "Ceramic", "price_add": 0},
            {"name": "Magic Mug", "price_add": 200}
        ],
        "colors": [
            {"name": "White", "price_add": 0},
            {"name": "Black", "price_add": 50},
            {"name": "Blue", "price_add": 50}
        ],
        "image_url": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a"
    },
    {
        "name": "LED Photo Frame",
        "description": "Illuminated frame that brings your photos to life",
        "category": "led",
        "base_price": 1999.0,
        "sizes": [
            {"name": "8x10", "price_add": 0},
            {"name": "12x16", "price_add": 500}
        ],
        "materials": [
            {"name": "LED Backlit", "price_add": 0},
            {"name": "RGB LED", "price_add": 800}
        ],
        "colors": [
            {"name": "White Light", "price_add": 0},
            {"name": "Warm Light", "price_add": 0},
            {"name": "Cool Light", "price_add": 0}
        ],
        "image_url": "https://images.unsplash.com/photo-1510284876186-b1a84b94418f"
    }
]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "PhotoGiftHub API Ready!"}

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    
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
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read and process image
    contents = await file.read()
    
    # Convert to base64 for storage/preview
    image_base64 = base64.b64encode(contents).decode('utf-8')
    
    # Basic image validation
    try:
        image = Image.open(io.BytesIO(contents))
        width, height = image.size
        
        # Quality warning if too small
        quality_warning = width < 1000 or height < 1000
        
        return {
            "success": True,
            "image_data": image_base64,
            "dimensions": {"width": width, "height": height},
            "quality_warning": quality_warning,
            "message": "Low resolution detected. Consider a larger image for best print quality." if quality_warning else "Image uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file")

@api_router.post("/gift-suggestions")
async def get_gift_suggestions(quiz_data: GiftQuizResponse):
    try:
        # Initialize LLM chat for gift suggestions
        emergent_key = os.environ.get('EMERGENT_LLM_KEY', '')
        if not emergent_key:
            raise HTTPException(status_code=500, detail="LLM service not configured")
        
        chat = LlmChat(
            api_key=emergent_key,
            session_id=f"gift_quiz_{uuid.uuid4()}",
            system_message="""You are a gifting expert for PhotoGiftHub, a premium photo frames and custom gifts shop. 
            Based on user's quiz responses, suggest 3-4 personalized gift recommendations from these categories:
            - Photo Frames (wooden, acrylic, LED)
            - Custom Mugs 
            - Photo Collages
            - Personalized Gifts
            
            For each suggestion, provide:
            1. Product name and brief description
            2. Why it's perfect for this recipient/occasion
            3. Personalization ideas
            4. Estimated price range
            
            Keep suggestions warm, personal, and focused on preserving memories."""
        ).with_model("openai", "gpt-4o-mini")
        
        quiz_text = f"""
        Gift recipient: {quiz_data.recipient}
        Occasion: {quiz_data.occasion}
        Age group: {quiz_data.age_group}
        Interests: {', '.join(quiz_data.interests)}
        Budget: {quiz_data.budget}
        Relationship: {quiz_data.relationship}
        """
        
        user_message = UserMessage(text=f"Based on this information, suggest personalized photo gifts: {quiz_text}")
        response = await chat.send_message(user_message)
        
        return {
            "suggestions": response,
            "quiz_data": quiz_data.dict()
        }
        
    except Exception as e:
        return {
            "suggestions": "I'd recommend a beautiful wooden photo frame or a custom photo mug based on your preferences. Our team can help you create something special!",
            "error": str(e)
        }

@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    # Calculate points earned (2% of order value)
    points_earned = int(order.total_amount * 0.02)
    
    order_dict = order.dict()
    order_dict["points_earned"] = points_earned
    order_obj = Order(**order_dict)
    
    await db.orders.insert_one(order_obj.dict())
    
    # Update user points
    if order.user_id:
        user = await db.users.find_one({"id": order.user_id})
        if user:
            new_points = user.get("points", 0) + points_earned
            await db.users.update_one(
                {"id": order.user_id},
                {"$set": {"points": new_points}}
            )
    
    return order_obj

@api_router.get("/orders/{user_id}")
async def get_user_orders(user_id: str):
    orders = await db.orders.find({"user_id": user_id}).to_list(50)
    return [Order(**order) for order in orders]

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