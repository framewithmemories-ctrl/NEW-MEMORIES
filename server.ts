import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// Secrets
const JWT_SECRET = process.env.JWT_SECRET || "memories_super_secret_jwt_key_2024";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "memories2024";

// In-Memory Data Store
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  sizes: Array<{ name: string; price_add: number }>;
  materials: Array<{ name: string; price_add: number }>;
  colors: Array<{ name: string; price_add: number }>;
  image_url: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: string;
  points: number;
  tier: string;
  wallet_balance: number;
  store_credits: number;
  total_spent: number;
  role: string;
  must_change_password: boolean;
  password_hash?: string;
  password_reset_at?: string;
  created_at: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  photos?: string[];
  product_id?: string;
  approved: boolean;
  pinned: boolean;
  created_at: string;
}

interface Order {
  id: string;
  user_id?: string;
  items: any[];
  total_amount: number;
  total?: number;
  status: string;
  delivery_type: string;
  delivery_address?: any;
  pickup_slot?: string;
  points_earned: number;
  created_at: string;
  updated_at?: string;
}

interface SavedPhoto {
  id: string;
  user_id: string;
  name: string;
  image_data: string;
  image_url?: string;
  dimensions: { width: number | string; height: number | string };
  size: number;
  tags: string[];
  notes?: string;
  favorite: boolean;
  usage_count: number;
  last_used?: string;
  created_at: string;
}

interface WalletTransaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  order_id?: string;
  status: string;
  balance_after: number;
  is_points?: boolean;
  credit_earned?: number;
  created_at: string;
}

interface CustomDesign {
  id: string;
  user_id: string;
  product_id: string;
  image_data: string;
  customizations: any;
  preview_url?: string;
  created_at: string;
}

// Initial Sample Data
const sampleProducts: Product[] = [
  {
    id: "prod_1",
    name: "Premium Wooden Photo Frame",
    description: "Handcrafted wooden frame perfect for your precious memories",
    category: "frames",
    base_price: 899.0,
    sizes: [
      { name: "8x10", price_add: 0 },
      { name: "12x16", price_add: 300 },
      { name: "16x20", price_add: 600 },
      { name: "20x24", price_add: 1000 },
    ],
    materials: [
      { name: "Teak Wood", price_add: 0 },
      { name: "Mahogany", price_add: 200 },
      { name: "Oak Wood", price_add: 150 },
    ],
    colors: [
      { name: "Natural Wood", price_add: 0 },
      { name: "Dark Brown", price_add: 50 },
      { name: "Black Finish", price_add: 75 },
    ],
    image_url: "https://images.unsplash.com/photo-1465161191540-aac346fcbaff",
    created_at: new Date().toISOString(),
  },
  {
    id: "prod_2",
    name: "Crystal Clear Acrylic Frame",
    description: "Modern acrylic frame with crystal-clear transparency",
    category: "acrylic",
    base_price: 1299.0,
    sizes: [
      { name: "8x10", price_add: 0 },
      { name: "12x16", price_add: 400 },
      { name: "16x20", price_add: 700 },
      { name: "20x24", price_add: 1100 },
    ],
    materials: [
      { name: "Premium Acrylic", price_add: 0 },
      { name: "UV Protected", price_add: 300 },
    ],
    colors: [
      { name: "Crystal Clear", price_add: 0 },
      { name: "Frosted", price_add: 150 },
    ],
    image_url: "https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f",
    created_at: new Date().toISOString(),
  },
  {
    id: "prod_3",
    name: "Personalized Photo Mug",
    description: "Custom ceramic mug with sublimation printing - perfect gift",
    category: "mugs",
    base_price: 299.0,
    sizes: [
      { name: "11oz Standard", price_add: 0 },
      { name: "15oz Large", price_add: 100 },
      { name: "Magic Color Changing", price_add: 200 },
    ],
    materials: [
      { name: "Ceramic", price_add: 0 },
      { name: "Premium Ceramic", price_add: 100 },
    ],
    colors: [
      { name: "White", price_add: 0 },
      { name: "Black", price_add: 50 },
      { name: "Colored Handle", price_add: 75 },
    ],
    image_url: "https://images.unsplash.com/photo-1628313388777-9b9a751dfc6a",
    created_at: new Date().toISOString(),
  },
  {
    id: "prod_4",
    name: "Custom T-Shirt Printing",
    description: "High-quality sublimation printed t-shirts with your design",
    category: "t-shirts",
    base_price: 399.0,
    sizes: [
      { name: "S", price_add: 0 },
      { name: "M", price_add: 0 },
      { name: "L", price_add: 50 },
      { name: "XL", price_add: 100 },
      { name: "XXL", price_add: 150 },
    ],
    materials: [
      { name: "100% Cotton", price_add: 0 },
      { name: "Cotton Blend", price_add: 50 },
      { name: "Premium Cotton", price_add: 150 },
    ],
    colors: [
      { name: "White", price_add: 0 },
      { name: "Black", price_add: 25 },
      { name: "Colored", price_add: 50 },
    ],
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    created_at: new Date().toISOString(),
  },
  {
    id: "prod_5",
    name: "Corporate Gift Package",
    description: "Professional corporate gifts with custom branding solutions",
    category: "corporate",
    base_price: 999.0,
    sizes: [
      { name: "Basic Package", price_add: 0 },
      { name: "Standard Package", price_add: 500 },
      { name: "Premium Package", price_add: 1000 },
    ],
    materials: [
      { name: "Standard Quality", price_add: 0 },
      { name: "Premium Quality", price_add: 300 },
    ],
    colors: [
      { name: "Corporate Theme", price_add: 0 },
      { name: "Custom Branding", price_add: 200 },
    ],
    image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a",
    created_at: new Date().toISOString(),
  },
];

const initialReviews: Review[] = [
  {
    id: "rev_1",
    name: "Priya Sharma",
    rating: 5,
    comment: "Ordered a wooden frame for my parents' 25th anniversary. The wood carving and print quality exceeded all expectations!",
    approved: true,
    pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "rev_2",
    name: "Arun Kumar",
    rating: 5,
    comment: "The magic photo mug was amazing. Sublimation quality is top notch and delivered right to Saravanampatti same day!",
    approved: true,
    pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "rev_3",
    name: "Kavitha R",
    rating: 5,
    comment: "Framed our family portrait in crystal acrylic with LED backing. It is the centerpiece of our living room now.",
    approved: true,
    pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
];

// Data state
const products: Product[] = [...sampleProducts];
const users: User[] = [
  {
    id: "user_demo",
    name: "Customer Demo",
    email: "customer@example.com",
    phone: "+91 9876543210",
    address: "12 Gandhi Road, Coimbatore",
    points: 350,
    tier: "Silver",
    wallet_balance: 500,
    store_credits: 50,
    total_spent: 1250,
    role: "user",
    must_change_password: false,
    password_hash: bcrypt.hashSync("secret123", 10),
    created_at: new Date().toISOString(),
  },
];
const reviews: Review[] = [...initialReviews];
const orders: Order[] = [];
const customDesigns: CustomDesign[] = [];
const userPhotos: SavedPhoto[] = [];
const walletTransactions: WalletTransaction[] = [];
const adminAuditLog: any[] = [];
const aiUsageLog: any[] = [];
const aiCache: Record<string, any> = {};

// Helper functions
const createToken = (sub: string, role: string, extra: any = {}) => {
  return jwt.sign({ sub, role, ...extra }, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
};

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== "user") {
    return res.status(401).json({ detail: "Invalid authentication token" });
  }
  const user = users.find((u) => u.id === payload.sub);
  if (!user) {
    return res.status(401).json({ detail: "User not found" });
  }
  (req as any).user = user;
  next();
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Admin authentication required" });
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return res.status(403).json({ detail: "Admin access required" });
  }
  (req as any).admin = payload;
  next();
};

const recordAiUsage = (feature: string, status: "live" | "cache_hit" | "error") => {
  const now = new Date();
  aiUsageLog.push({
    feature,
    status,
    date: now.toISOString().split("T")[0],
    created_at: now.toISOString(),
  });
};

// Gemini Helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

async function callGemini(prompt: string, system?: string): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) return null;
  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: system,
        temperature: 0.7,
      },
    });
    return response.text?.trim() || null;
  } catch (err) {
    console.error("Gemini call failed:", err);
    return null;
  }
}

// -------------------------------------------------------------
// API ROUTER
// -------------------------------------------------------------
const apiRouter = express.Router();

// Root
apiRouter.get("/", (req, res) => {
  res.json({ message: "Memories - Photo Frames & Customized Gift Shop API Ready! 📸🎁" });
});

// Config
apiRouter.get("/config", (req, res) => {
  res.json({
    shop_whatsapp: process.env.SHOP_WHATSAPP_NUMBER || "918148040148",
    business_name: "Memories",
  });
});

// Store Info
apiRouter.get("/store-info", (req, res) => {
  res.json({
    name: "Memories - Photo Frames & Customized Gift Shop",
    tagline: "Creating Beautiful Memories Since 2020",
    address: {
      street: "19B Kani Illam, Keeranatham Road",
      area: "Near Ruby School, Saravanampatti",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641035",
      landmark: "Near Ruby School",
    },
    contact: {
      phone: "+91 81480 40148",
      whatsapp: "+91 81480 40148",
      email: "memories@photogifthub.com",
    },
    hours: {
      monday_saturday: "9:30 AM - 9:00 PM",
      sunday: "Closed",
      note: "Extended hours during festive seasons",
    },
    services: [
      "Premium Photo Frames",
      "Sublimation Printing",
      "Custom Photo Mugs",
      "Personalized T-Shirts",
      "Corporate Gifts",
      "Bulk Orders",
      "Free Home Delivery",
    ],
    specialties: [
      "Handcrafted wooden frames",
      "Crystal clear acrylic frames",
      "High-quality sublimation printing",
      "Same-day printing services",
      "Corporate branding solutions",
    ],
    google_rating: "4.9/5",
    total_reviews: 263,
    established: 2020,
    google_maps: "https://maps.google.com/?q=19B+Kani+Illam+Keeranatham+Road+Coimbatore",
  });
});

// Google Reviews
apiRouter.get("/google-reviews", (req, res) => {
  res.json({
    configured: false,
    rating: 4.9,
    total: 263,
    google_url: "https://www.google.com/maps/search/Memories+Photo+Frames+Coimbatore",
    reviews: [
      {
        author_name: "Anitha R",
        rating: 5,
        text: "Beautiful photo frames and excellent service. Highly recommend Memories for gifts!",
        relative_time: "2 weeks ago",
        profile_photo_url: "",
      },
      {
        author_name: "Karthik S",
        rating: 5,
        text: "Got customized acrylic frames for my parents' anniversary. The quality is top notch.",
        relative_time: "1 month ago",
        profile_photo_url: "",
      },
      {
        author_name: "Deepa M",
        rating: 5,
        text: "Friendly staff and quick delivery. The LED frame looks stunning at home.",
        relative_time: "1 month ago",
        profile_photo_url: "",
      },
    ],
  });
});

// Products
apiRouter.get("/products", (req, res) => {
  const category = req.query.category as string | undefined;
  if (category && category !== "All") {
    const filtered = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    return res.json(filtered);
  }
  res.json(products);
});

apiRouter.get("/products/:product_id", (req, res) => {
  const product = products.find((p) => p.id === req.params.product_id);
  if (!product) return res.status(404).json({ detail: "Product not found" });
  res.json(product);
});

apiRouter.post("/products", (req, res) => {
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name: req.body.name || "Untitled Product",
    description: req.body.description || "",
    category: req.body.category || "frames",
    base_price: Number(req.body.base_price) || 499,
    sizes: req.body.sizes || [],
    materials: req.body.materials || [],
    colors: req.body.colors || [],
    image_url: req.body.image_url || "https://images.unsplash.com/photo-1465161191540-aac346fcbaff",
    created_at: new Date().toISOString(),
  };
  products.push(newProduct);
  res.json(newProduct);
});

// Users
apiRouter.post("/users", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const existing = users.find((u) => u.email === email);
  if (existing) {
    const { password_hash, ...rest } = existing;
    return res.json(rest);
  }
  const newUser: User = {
    id: `user_${Date.now()}`,
    name: req.body.name || "Customer",
    email,
    phone: req.body.phone,
    address: req.body.address,
    preferences: req.body.preferences,
    points: 0,
    tier: "Silver",
    wallet_balance: 0,
    store_credits: 0,
    total_spent: 0,
    role: "user",
    must_change_password: false,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  res.json(newUser);
});

apiRouter.get("/users/:user_id", (req, res) => {
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  const { password_hash, ...rest } = user;
  res.json(rest);
});

apiRouter.put("/users/:user_id", (req, res) => {
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  Object.assign(user, req.body);
  const { password_hash, ...rest } = user;
  res.json(rest);
});

// Authentication
apiRouter.post("/auth/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ detail: "Password must be at least 6 characters" });
  }
  const cleanEmail = (email || "").trim().toLowerCase();
  if (users.find((u) => u.email === cleanEmail)) {
    return res.status(400).json({ detail: "An account with this email already exists" });
  }
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: (name || "").trim(),
    email: cleanEmail,
    phone: phone || "",
    points: 100, // Welcome bonus points
    tier: "Silver",
    wallet_balance: 0,
    store_credits: 0,
    total_spent: 0,
    role: "user",
    must_change_password: false,
    password_hash: bcrypt.hashSync(password, 10),
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  const token = createToken(newUser.id, "user");
  const { password_hash, ...userData } = newUser;
  res.json({ token, user: userData });
});

apiRouter.post("/auth/login", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";
  const user = users.find((u) => u.email === email);
  if (!user || !user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ detail: "Invalid email or password" });
  }
  const token = createToken(user.id, "user");
  const { password_hash, ...userData } = user;
  res.json({ token, user: userData });
});

apiRouter.get("/auth/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { password_hash, ...userData } = user;
  res.json({ user: userData });
});

apiRouter.post("/auth/change-password", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { current_password, new_password } = req.body;
  if (!bcrypt.compareSync(current_password, user.password_hash || "")) {
    return res.status(401).json({ detail: "Current password is incorrect" });
  }
  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ detail: "Password must be at least 6 characters" });
  }
  user.password_hash = bcrypt.hashSync(new_password, 10);
  user.must_change_password = false;
  const { password_hash, ...userData } = user;
  res.json({ success: true, user: userData });
});

// Admin Auth & Endpoints
apiRouter.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ detail: "Invalid credentials" });
  }
  const token = createToken(username, "admin");
  const adminData = {
    id: "admin_001",
    username: ADMIN_USERNAME,
    email: "admin@memories.com",
    role: "super_admin",
    permissions: ["products", "reviews", "users", "orders", "analytics"],
    last_login: new Date().toISOString(),
  };
  res.json({ success: true, admin: adminData, token });
});

apiRouter.get("/admin/stats", requireAdmin, (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingReviews = reviews.filter((r) => !r.approved).length;

  const productAgg: Record<string, { name: string; sales: number; revenue: number }> = {};
  for (const order of orders) {
    for (const item of order.items || []) {
      const name = item.name || "Item";
      const qty = item.quantity || 1;
      const price = item.price || 0;
      if (!productAgg[name]) {
        productAgg[name] = { name, sales: 0, revenue: 0 };
      }
      productAgg[name].sales += qty;
      productAgg[name].revenue += price * qty;
    }
  }

  const topProducts = Object.values(productAgg)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const enrichedRecentOrders = orders
    .slice(-10)
    .reverse()
    .map((o) => {
      const user = users.find((u) => u.id === o.user_id);
      return {
        ...o,
        total: o.total_amount,
        customer: {
          name: o.delivery_address?.name || user?.name || "Guest Customer",
          email: o.delivery_address?.email || user?.email || "",
          phone: o.delivery_address?.phone || user?.phone || "",
        },
      };
    });

  res.json({
    total_users: users.length,
    total_orders: orders.length,
    total_revenue: totalRevenue,
    pending_reviews: pendingReviews,
    total_products: products.length,
    recent_orders: enrichedRecentOrders,
    top_products: topProducts.length ? topProducts : [
      { name: "Premium Wooden Frame (12x16)", sales: 42, revenue: 37758 },
      { name: "Crystal Acrylic Frame (16x20)", sales: 28, revenue: 36372 },
      { name: "Personalized Magic Mug", sales: 65, revenue: 19435 },
    ],
  });
});

apiRouter.get("/admin/reviews", requireAdmin, (req, res) => {
  const status = req.query.status as string;
  let list = [...reviews];
  if (status === "pending") list = list.filter((r) => !r.approved);
  if (status === "approved") list = list.filter((r) => r.approved);
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json({ reviews: list });
});

apiRouter.put("/admin/reviews/:review_id/approve", requireAdmin, (req, res) => {
  const review = reviews.find((r) => r.id === req.params.review_id);
  if (!review) return res.status(404).json({ detail: "Review not found" });
  review.approved = Boolean(req.body.approved);
  res.json({ success: true, approved: review.approved });
});

apiRouter.delete("/admin/reviews/:review_id", requireAdmin, (req, res) => {
  const index = reviews.findIndex((r) => r.id === req.params.review_id);
  if (index === -1) return res.status(404).json({ detail: "Review not found" });
  reviews.splice(index, 1);
  res.json({ success: true, deleted: true });
});

apiRouter.put("/admin/reviews/:review_id/pin", requireAdmin, (req, res) => {
  const review = reviews.find((r) => r.id === req.params.review_id);
  if (!review) return res.status(404).json({ detail: "Review not found" });
  review.pinned = Boolean(req.body.pinned);
  res.json({ success: true, pinned: review.pinned });
});

apiRouter.get("/admin/orders", requireAdmin, (req, res) => {
  const status = req.query.status as string;
  let list = [...orders];
  if (status && status !== "all") {
    list = list.filter((o) => o.status === status);
  }
  const enriched = list.reverse().map((o) => {
    const user = users.find((u) => u.id === o.user_id);
    return {
      ...o,
      total: o.total_amount,
      customer: {
        name: o.delivery_address?.name || user?.name || "Guest Customer",
        email: o.delivery_address?.email || user?.email || "",
        phone: o.delivery_address?.phone || user?.phone || "",
      },
    };
  });
  res.json({ orders: enriched });
});

apiRouter.put("/admin/orders/:order_id/status", requireAdmin, (req, res) => {
  const order = orders.find((o) => o.id === req.params.order_id);
  if (!order) return res.status(404).json({ detail: "Order not found" });
  order.status = req.body.status;
  order.updated_at = new Date().toISOString();
  res.json({ success: true, status: order.status });
});

apiRouter.get("/admin/users", requireAdmin, (req, res) => {
  const cleanUsers = users.map(({ password_hash, ...u }) => u);
  res.json({ users: cleanUsers });
});

apiRouter.post("/admin/users/:user_id/wallet/adjust", requireAdmin, (req, res) => {
  const { amount, type, reason } = req.body;
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  if (type !== "credit" && type !== "debit") {
    return res.status(400).json({ detail: "type must be credit or debit" });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ detail: "amount must be greater than 0" });
  }
  if (type === "debit" && user.wallet_balance < amount) {
    return res.status(400).json({ detail: "Cannot deduct more than the current balance" });
  }

  user.wallet_balance = type === "credit" ? user.wallet_balance + amount : user.wallet_balance - amount;

  const txn: WalletTransaction = {
    id: `txn_${Date.now()}`,
    user_id: user.id,
    type,
    amount,
    description: `Admin ${type}: ${reason || "Manual adjustment"}`,
    category: "admin_adjustment",
    status: "completed",
    balance_after: user.wallet_balance,
    created_at: new Date().toISOString(),
  };
  walletTransactions.push(txn);
  res.json({ success: true, new_balance: user.wallet_balance, transaction_id: txn.id });
});

apiRouter.post("/admin/users/:user_id/reset-password", requireAdmin, (req, res) => {
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });

  let newPassword = req.body.new_password;
  let generated = false;
  if (!newPassword) {
    newPassword = crypto.randomBytes(6).toString("hex");
    generated = true;
  }

  user.password_hash = bcrypt.hashSync(newPassword, 10);
  user.password_reset_at = new Date().toISOString();
  user.must_change_password = Boolean(req.body.force_change);

  adminAuditLog.push({
    id: `audit_${Date.now()}`,
    action: "password_reset",
    actor: "admin",
    target_user_id: user.id,
    target_user_email: user.email,
    generated,
    force_change: user.must_change_password,
    reason: req.body.reason || "Admin reset",
    created_at: new Date().toISOString(),
  });

  res.json({
    success: true,
    generated,
    force_change: user.must_change_password,
    temporary_password: generated ? newPassword : null,
    message: generated
      ? "Password reset successfully. Share the temporary password with the user."
      : "Password updated successfully.",
  });
});

apiRouter.get("/admin/audit-log", requireAdmin, (req, res) => {
  res.json({ entries: [...adminAuditLog].reverse() });
});

apiRouter.get("/admin/ai-usage", requireAdmin, (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = aiUsageLog.filter((l) => l.date === today);

  const counts = (logs: any[]) => ({
    live: logs.filter((l) => l.status === "live").length,
    cache_hit: logs.filter((l) => l.status === "cache_hit").length,
    error: logs.filter((l) => l.status === "error").length,
  });

  const todayCounts = counts(todayLogs);
  const allCounts = counts(aiUsageLog);

  res.json({
    ai_configured: Boolean(process.env.GEMINI_API_KEY),
    today: {
      ...todayCounts,
      total_calls: todayCounts.live + todayCounts.cache_hit,
      cache_hit_rate: todayCounts.live + todayCounts.cache_hit > 0
        ? Math.round((todayCounts.cache_hit / (todayCounts.live + todayCounts.cache_hit)) * 100)
        : 0,
    },
    all_time: {
      ...allCounts,
      total_calls: allCounts.live + allCounts.cache_hit,
      cache_hit_rate: allCounts.live + allCounts.cache_hit > 0
        ? Math.round((allCounts.cache_hit / (allCounts.live + allCounts.cache_hit)) * 100)
        : 0,
    },
    by_feature_today: {},
    daily_7d: [],
  });
});

apiRouter.post("/admin/products", requireAdmin, (req, res) => {
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name: req.body.name || "New Product",
    description: req.body.description || "",
    category: req.body.category || "frames",
    base_price: Number(req.body.base_price) || 499,
    sizes: req.body.sizes || [{ name: "Standard", price_add: 0 }],
    materials: req.body.materials || [{ name: "Standard", price_add: 0 }],
    colors: req.body.colors || [{ name: "Default", price_add: 0 }],
    image_url: req.body.image_url || "https://images.unsplash.com/photo-1465161191540-aac346fcbaff",
    created_at: new Date().toISOString(),
  };
  products.push(newProduct);
  res.json(newProduct);
});

apiRouter.post("/admin/products/generate-description", requireAdmin, async (req, res) => {
  const { name, category } = req.body;
  if (!name) return res.status(400).json({ detail: "Product name is required" });

  const prompt = `Write an SEO-friendly e-commerce product description (60-90 words) for a product at Memories Photo Frames & Custom Gift Shop (Coimbatore, India).
Product name: ${name}
Category: ${category || "gift"}
Tone: warm, premium, gift-focused. Mention personalization/customization and quality craftsmanship. Plain text only — no markdown headings, no surrounding quotes.`;

  const generated = await callGemini(prompt);
  if (generated) {
    recordAiUsage("product_description", "live");
    return res.json({ description: generated });
  }

  recordAiUsage("product_description", "error");
  // High quality template fallback
  const fallback = `Cherish your most memorable moments with our meticulously crafted ${name}. Handcrafted with premium grade materials at Memories Coimbatore, this piece blends timeless artistry with precision personalization. Whether celebrating an anniversary, milestone, or special occasion, our custom framing and sublimation printing ensure your treasured memories stay vivid for generations.`;
  res.json({ description: fallback });
});

apiRouter.put("/admin/products/:product_id", requireAdmin, (req, res) => {
  const product = products.find((p) => p.id === req.params.product_id);
  if (!product) return res.status(404).json({ detail: "Product not found" });
  Object.assign(product, req.body);
  res.json({ success: true, updated: true, product });
});

apiRouter.delete("/admin/products/:product_id", requireAdmin, (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.product_id);
  if (index === -1) return res.status(404).json({ detail: "Product not found" });
  products.splice(index, 1);
  res.json({ success: true, deleted: true });
});

// Image Upload
apiRouter.post("/upload-image", upload.single("file"), (req, res) => {
  let imageBase64 = "";
  let width = 2048;
  let height = 2048;

  if (req.file) {
    imageBase64 = req.file.buffer.toString("base64");
  } else if (req.body.image_data) {
    imageBase64 = req.body.image_data;
  } else {
    return res.status(400).json({ detail: "File must be an image (JPG, PNG, HEIC)" });
  }

  // Parse width / height if available
  if (req.body.width) width = parseInt(req.body.width, 10) || width;
  if (req.body.height) height = parseInt(req.body.height, 10) || height;

  const qualityWarning = width < 1500 || height < 1500;
  const message = qualityWarning
    ? `⚠️ Image resolution is ${width}x${height}px. For best print quality, we recommend minimum 2000x2000px. Current image is suitable for smaller sizes (8x10 or 12x16).`
    : `✅ Excellent quality image (${width}x${height}px) - Perfect for all frame sizes!`;

  res.json({
    success: true,
    image_data: imageBase64,
    dimensions: { width, height },
    quality_warning: qualityWarning,
    message,
    recommended_sizes: qualityWarning ? ["8x10", "12x16"] : ["8x10", "12x16", "16x20", "20x24"],
  });
});

// AI Gift Suggestions
apiRouter.post("/gift-suggestions", async (req, res) => {
  const answers = req.body.answers || {};
  const recipient = answers.recipient || req.body.recipient || "Friend";
  const occasion = answers.occasion || req.body.occasion || "Birthday";
  const budget = answers.budget || req.body.budget || "mid_range";
  const relationship = answers.relationship || req.body.relationship || "friend";
  const interests = answers.interests || req.body.interests || [];

  const catalogText = products.map((p) => `- ${p.name} (${p.category}, from ₹${p.base_price})`).join("\n");

  const prompt = `Customer preferences:
Recipient: ${recipient}
Occasion: ${occasion}
Budget: ${budget}
Relationship: ${relationship}
Interests: ${interests.join(", ") || "General"}

Our store product catalog:
${catalogText}

Recommend 3-4 specific gifts chosen from or inspired by our catalog. For each recommendation include: a bold product name with a personalization idea, a detailed reason it suits this recipient/occasion, an estimated price range in Rupees, a customization suggestion, and a Confidence score (1-100). Write in warm, friendly markdown. End with our store address (19B Kani Illam, Keeranatham Road, Coimbatore), phone (+91 81480 40148), and mention free home delivery.`;

  const systemMessage = `You are a gifting expert for "Memories - Photo Frames & Customized Gift Shop" located in Keeranatham Road, Coimbatore. We specialize in wooden/acrylic frames, sublimation mugs, custom t-shirts, and corporate gifts.`;

  let response = await callGemini(prompt, systemMessage);
  if (response) {
    recordAiUsage("gift_finder", "live");
    return res.json({
      suggestions: response,
      quiz_data: { recipient, occasion, budget, relationship, interests },
      enhanced: Boolean(req.body.aiEnhanced),
      shop_info: {
        name: "Memories - Photo Frames & Customized Gift Shop",
        phone: "+91 81480 40148",
        address: "19B Kani Illam, Keeranatham Road, Coimbatore",
      },
    });
  }

  recordAiUsage("gift_finder", "error");
  const fallback = `Based on your preferences for **${recipient}** on **${occasion}**:

🎁 **AI-Recommended Gifts from Memories Coimbatore:**

1. **Premium Wooden Photo Frame Set** (₹899 - ₹1,599) — **Confidence: 95%**
   - Perfect for celebrating ${occasion} with unforgettable moments.
   - Handcrafted teak/oak options with anti-glare finish.
   - *Customization:* Add personal dates or engraved golden plaques.

2. **Customized Sublimation Photo Mug** (₹299 - ₹499) — **Confidence: 90%**
   - Heat-activated color changing ceramic with high definition photo print.
   - Perfect practical everyday keepsake for your ${relationship}.

3. **Crystal Clear Acrylic Frame with LED Base** (₹1,299 - ₹2,199) — **Confidence: 92%**
   - Sleek modern look with ambient glow that highlights portrait details.

📍 **Visit Our Coimbatore Studio:** 19B Kani Illam, Keeranatham Road (Near Ruby School), Saravanampatti
📞 **Call / WhatsApp:** +91 81480 40148
🚚 **Free Home Delivery in Coimbatore!**`;

  res.json({
    suggestions: fallback,
    quiz_data: { recipient, occasion, budget, relationship, interests },
    enhanced: false,
    shop_info: {
      name: "Memories - Photo Frames & Customized Gift Shop",
      phone: "+91 81480 40148",
      address: "19B Kani Illam, Keeranatham Road, Coimbatore",
    },
  });
});

// Orders
apiRouter.post("/orders", (req, res) => {
  const { user_id, items, total_amount, delivery_type, delivery_address, pickup_slot } = req.body;
  const pointsEarned = Math.floor((total_amount || 0) * 0.03);

  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    user_id,
    items: items || [],
    total_amount: Number(total_amount) || 0,
    status: "pending",
    delivery_type: delivery_type || "delivery",
    delivery_address,
    pickup_slot,
    points_earned: pointsEarned,
    created_at: new Date().toISOString(),
  };
  orders.push(newOrder);

  if (user_id) {
    const user = users.find((u) => u.id === user_id);
    if (user) {
      user.points = (user.points || 0) + pointsEarned;
      user.total_spent = (user.total_spent || 0) + newOrder.total_amount;
      if (user.points >= 5000 || user.total_spent >= 10000) user.tier = "Platinum";
      else if (user.points >= 2000 || user.total_spent >= 5000) user.tier = "Gold";
      else user.tier = "Silver";
    }
  }

  res.json(newOrder);
});

apiRouter.get("/orders/:user_id", (req, res) => {
  const userOrders = orders.filter((o) => o.user_id === req.params.user_id);
  res.json(userOrders);
});

// Reviews
apiRouter.post("/reviews", (req, res) => {
  const newReview: Review = {
    id: `rev_${Date.now()}`,
    name: req.body.name || "Customer",
    rating: Number(req.body.rating) || 5,
    comment: req.body.comment || "",
    photos: req.body.photos || [],
    product_id: req.body.product_id,
    approved: true,
    pinned: false,
    created_at: new Date().toISOString(),
  };
  reviews.push(newReview);
  res.json(newReview);
});

apiRouter.get("/reviews", (req, res) => {
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const ratingFilter = req.query.rating_filter ? parseInt(req.query.rating_filter as string, 10) : null;

  let filtered = reviews.filter((r) => r.approved);
  if (ratingFilter) {
    filtered = filtered.filter((r) => r.rating === ratingFilter);
  }

  filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const paginated = filtered.slice(offset, offset + limit);
  const allApproved = reviews.filter((r) => r.approved);
  const avg = allApproved.length ? allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length : 5.0;

  const distribution: Record<string, number> = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  for (const r of allApproved) {
    const key = String(r.rating);
    if (distribution[key] !== undefined) distribution[key]++;
  }

  res.json({
    reviews: paginated,
    total_count: filtered.length,
    has_more: offset + limit < filtered.length,
    rating_stats: {
      total_reviews: allApproved.length,
      average_rating: Number(avg.toFixed(1)),
      rating_distribution: distribution,
    },
  });
});

apiRouter.get("/reviews/stats", (req, res) => {
  const allApproved = reviews.filter((r) => r.approved);
  const avg = allApproved.length ? allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length : 5.0;
  const distribution: Record<string, number> = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  for (const r of allApproved) {
    const key = String(r.rating);
    if (distribution[key] !== undefined) distribution[key]++;
  }
  res.json({
    total_reviews: allApproved.length,
    average_rating: Number(avg.toFixed(1)),
    rating_distribution: distribution,
  });
});

apiRouter.get("/reviews/highlights", (req, res) => {
  res.json({
    highlights: "- Exceptional frame craftsmanship and vibrant photo reproduction\n- Fast same-day delivery throughout Coimbatore\n- Personalized assistance and friendly customer care",
    cached: true,
  });
});

// Designs
apiRouter.post("/designs", (req, res) => {
  const design: CustomDesign = {
    id: `des_${Date.now()}`,
    user_id: req.body.user_id || "guest",
    product_id: req.body.product_id || "prod_1",
    image_data: req.body.image_data || "",
    customizations: req.body.customizations || {},
    preview_url: req.body.preview_url,
    created_at: new Date().toISOString(),
  };
  customDesigns.push(design);
  res.json(design);
});

apiRouter.get("/designs/:user_id", (req, res) => {
  const list = customDesigns.filter((d) => d.user_id === req.params.user_id);
  res.json(list);
});

// User Photos
apiRouter.post("/users/:user_id/photos", (req, res) => {
  const newPhoto: SavedPhoto = {
    id: `photo_${Date.now()}`,
    user_id: req.params.user_id,
    name: req.body.name || "Photo",
    image_data: req.body.image_data || "",
    image_url: req.body.image_url,
    dimensions: req.body.dimensions || { width: 1920, height: 1080 },
    size: Number(req.body.size) || 1.2,
    tags: req.body.tags || ["custom"],
    notes: req.body.notes || "",
    favorite: Boolean(req.body.favorite),
    usage_count: 0,
    created_at: new Date().toISOString(),
  };
  userPhotos.push(newPhoto);
  res.json(newPhoto);
});

apiRouter.get("/users/:user_id/photos", (req, res) => {
  const list = userPhotos.filter((p) => p.user_id === req.params.user_id);
  res.json(list);
});

apiRouter.delete("/users/:user_id/photos/:photo_id", (req, res) => {
  const idx = userPhotos.findIndex((p) => p.id === req.params.photo_id && p.user_id === req.params.user_id);
  if (idx === -1) return res.status(404).json({ detail: "Photo not found" });
  userPhotos.splice(idx, 1);
  res.json({ message: "Photo deleted successfully" });
});

apiRouter.put("/users/:user_id/photos/:photo_id/favorite", (req, res) => {
  const photo = userPhotos.find((p) => p.id === req.params.photo_id && p.user_id === req.params.user_id);
  if (!photo) return res.status(404).json({ detail: "Photo not found" });
  photo.favorite = !photo.favorite;
  res.json({ favorite: photo.favorite });
});

apiRouter.put("/users/:user_id/photos/:photo_id/use", (req, res) => {
  const photo = userPhotos.find((p) => p.id === req.params.photo_id && p.user_id === req.params.user_id);
  if (!photo) return res.status(404).json({ detail: "Photo not found" });
  photo.usage_count = (photo.usage_count || 0) + 1;
  photo.last_used = new Date().toISOString();
  res.json({ message: "Photo usage recorded" });
});

// Wallet
apiRouter.get("/users/:user_id/wallet", (req, res) => {
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  res.json({
    balance: user.wallet_balance || 0,
    reward_points: user.points || 0,
    store_credits: user.store_credits || 0,
    tier: user.tier || "Silver",
    total_spent: user.total_spent || 0,
  });
});

apiRouter.post("/users/:user_id/wallet/add-money", (req, res) => {
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  const amount = Number(req.body.amount) || 0;
  if (amount <= 0) return res.status(400).json({ detail: "Invalid amount" });

  user.wallet_balance = (user.wallet_balance || 0) + amount;
  const txn: WalletTransaction = {
    id: `txn_${Date.now()}`,
    user_id: user.id,
    type: "credit",
    amount,
    description: "Money added to wallet",
    category: "topup",
    status: "completed",
    balance_after: user.wallet_balance,
    created_at: new Date().toISOString(),
  };
  walletTransactions.push(txn);
  res.json({ new_balance: user.wallet_balance, transaction_id: txn.id });
});

apiRouter.post("/users/:user_id/wallet/convert-points", (req, res) => {
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  const points = parseInt(req.body.points, 10) || 0;
  if (points > (user.points || 0)) {
    return res.status(400).json({ detail: "Insufficient points" });
  }

  // 100 points = ₹10 store credit
  const creditValue = (points / 100) * 10;
  user.points -= points;
  user.store_credits = (user.store_credits || 0) + creditValue;

  const txn: WalletTransaction = {
    id: `txn_${Date.now()}`,
    user_id: user.id,
    type: "conversion",
    amount: points,
    description: `Converted ${points} points to ₹${creditValue} store credit`,
    category: "conversion",
    status: "completed",
    balance_after: user.wallet_balance || 0,
    is_points: true,
    credit_earned: creditValue,
    created_at: new Date().toISOString(),
  };
  walletTransactions.push(txn);

  res.json({
    points_remaining: user.points,
    store_credits: user.store_credits,
    credit_earned: creditValue,
  });
});

apiRouter.get("/users/:user_id/wallet/transactions", (req, res) => {
  const userTxns = walletTransactions
    .filter((t) => t.user_id === req.params.user_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(userTxns);
});

apiRouter.post("/users/:user_id/wallet/pay", (req, res) => {
  const user = users.find((u) => u.id === req.params.user_id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  const amount = Number(req.body.amount) || 0;
  if (amount > (user.wallet_balance || 0)) {
    return res.status(400).json({ detail: "Insufficient wallet balance" });
  }

  user.wallet_balance -= amount;
  user.total_spent = (user.total_spent || 0) + amount;
  if (user.total_spent >= 10000) user.tier = "Platinum";
  else if (user.total_spent >= 5000) user.tier = "Gold";

  const txn: WalletTransaction = {
    id: `txn_${Date.now()}`,
    user_id: user.id,
    type: "debit",
    amount,
    description: `Payment for order #${req.body.order_id || "direct"}`,
    category: "purchase",
    order_id: req.body.order_id,
    status: "completed",
    balance_after: user.wallet_balance,
    created_at: new Date().toISOString(),
  };
  walletTransactions.push(txn);

  res.json({
    payment_successful: true,
    new_balance: user.wallet_balance,
    tier: user.tier,
    transaction_id: txn.id,
  });
});

// Mount the API Router FIRST
app.use("/api", apiRouter);

// Start Server with Vite Middleware in Dev or Static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Memories Applet running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
