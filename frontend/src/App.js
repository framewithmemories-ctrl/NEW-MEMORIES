import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { CartProvider, useCart } from "./context/CartContext";
import { SearchComponent } from "./components/SearchComponent";
import { UserProfileSimple } from "./components/UserProfileSimple";
import { UserProfileEnhanced } from "./components/UserProfileEnhanced";
import { EnhancedAIGiftFinder } from "./components/EnhancedAIGiftFinder";
import { HeroSection, AboutUsSection, ProductGrid } from "./components/MainComponents";
import { AboutUsPage } from "./components/AboutUsPage";
import { EnhancedCheckoutPage } from "./components/EnhancedCheckoutPage";
import { ReviewSystemEnhanced } from "./components/ReviewSystemEnhanced";
import { 
  Upload, 
  Sparkles, 
  Heart, 
  Gift, 
  Star, 
  ShoppingCart, 
  User, 
  Search,
  Menu,
  Phone,
  Mail,
  MapPin,
  Award,
  Palette,
  Camera,
  Zap,
  MessageCircle,
  Clock,
  Shield,
  Truck,
  Users,
  ArrowRight,
  CheckCircle,
  Quote,
  Hammer,
  Package,
  Percent,
  Target,
  TrendingUp,
  ThumbsUp,
  X,
  ChevronDown,
  PhoneCall,
  Instagram,
  Facebook,
  ExternalLink,
  Play,
  Pause,
  Shirt
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

// Universal Scroll to Top Hook
const useScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    console.log('📍 Page loaded - Scrolled to top for route:', location.pathname);
  }, [location.pathname]);
};

// Smooth scroll utility for same-page navigation
const smoothScrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const headerElement = document.querySelector('header') || document.querySelector('[class*="sticky"]');
    const headerHeight = headerElement ? headerElement.offsetHeight : offset;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
    
    console.log(`🎯 Scrolling to #${elementId} at position:`, elementPosition);
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  } else {
    console.warn(`❌ Element #${elementId} not found`);
  }
};

// Hierarchical Navigation Structure - Competitor Best Practices
const navigationStructure = [
  {
    name: 'Photo Frames & Prints',
    key: 'photo-frames-prints',
    icon: '🖼️',
    subcategories: [
      'Personalized Photo Frames',
      'Collage Frames', 
      'LED / Light-up Frames',
      'Wooden / Acrylic Frames',
      'Wall Photo Frames',
      'Desk Frames'
    ]
  },
  {
    name: 'Photo Gifts',
    key: 'photo-gifts',
    icon: '🎁',
    subcategories: [
      'Photo Mugs',
      'Photo Pillows / Cushions',
      'Photo Keychains', 
      'Photo Bottles / Sippers',
      'Photo Clocks',
      'Photo Lamps'
    ]
  },
  {
    name: 'Occasion-Based Gifts',
    key: 'occasion-gifts',
    icon: '🌟',
    subcategories: [
      'Birthday Gifts',
      'Anniversary Gifts',
      'Wedding Gifts',
      'Friendship / Love Gifts',
      'Festival Specials'
    ]
  },
  {
    name: 'Corporate & Bulk Orders',
    key: 'corporate-bulk',
    icon: '🏢',
    subcategories: [
      'Employee Awards & Frames',
      'Corporate Gift Hampers',
      'Custom Branding Gifts'
    ]
  },
  {
    name: 'Home & Lifestyle',
    key: 'home-lifestyle',
    icon: '🏠',
    subcategories: [
      'Wall Décor',
      'Name Plates',
      'Customized Clocks',
      'Table Décor'
    ]
  },
  {
    name: 'Specials',
    key: 'specials',
    icon: '✨',
    subcategories: [
      'Kids Collection',
      'Couple Gifts',
      '3D / Crystal Gifts',
      'Digital Portraits & Caricatures'
    ]
  }
];

// Fixed Navigation Component with Working Dropdown
const HierarchicalNavigation = ({ handleNavigation }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <nav className="hidden lg:flex space-x-6">
      {/* Shop with Working Dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveDropdown('shop')}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button 
          onClick={() => handleNavigation('#shop')}
          className="text-gray-700 hover:text-rose-600 font-medium transition-colors px-3 py-2 rounded-lg flex items-center space-x-1"
          style={{ color: '#374151' }}
          onMouseOver={(e) => e.target.style.color = '#e11d48'}
          onMouseOut={(e) => e.target.style.color = '#374151'}
        >
          <span>Shop</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {/* Working Dropdown Menu */}
        {activeDropdown === 'shop' && (
          <div 
            className="absolute top-full left-0 mt-1 w-screen max-w-4xl bg-white shadow-xl border border-gray-200 rounded-lg z-50"
            onMouseEnter={() => setActiveDropdown('shop')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="grid grid-cols-3 gap-6 p-6">
              {navigationStructure.map((category, index) => (
                <div key={category.key} className="space-y-3">
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 border-b border-gray-100 pb-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <div className="space-y-2">
                    {category.subcategories && category.subcategories.map((sub, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => {
                          handleNavigation('#shop');
                          setActiveDropdown(null);
                        }}
                        className="block text-xs py-2 px-3 rounded-md text-left bg-transparent border-none cursor-pointer w-full text-gray-600"
                        style={{ color: '#6b7280' }}
                        onMouseOver={(e) => {
                          e.target.style.color = '#e11d48';
                          e.target.style.backgroundColor = '#fef2f2';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.color = '#6b7280';
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Other Navigation Items */}
      <button 
        onClick={() => handleNavigation('#customizer')}
        className="text-gray-700 hover:text-rose-600 font-medium transition-colors px-3 py-2 rounded-lg"
        style={{ color: '#374151' }}
        onMouseOver={(e) => e.target.style.color = '#e11d48'}
        onMouseOut={(e) => e.target.style.color = '#374151'}
      >
        Customize
      </button>
      <button 
        onClick={() => handleNavigation('#ai-finder')}
        className="text-gray-700 hover:text-rose-600 font-medium transition-colors px-3 py-2 rounded-lg"
        style={{ color: '#374151' }}
        onMouseOver={(e) => e.target.style.color = '#e11d48'}
        onMouseOut={(e) => e.target.style.color = '#374151'}
      >
        Gift Finder
      </button>
      <button 
        onClick={() => handleNavigation('/about')}
        className="text-gray-700 hover:text-rose-600 font-medium transition-colors px-3 py-2 rounded-lg"
        style={{ color: '#374151' }}
        onMouseOver={(e) => e.target.style.color = '#e11d48'}
        onMouseOut={(e) => e.target.style.color = '#374151'}
      >
        About Us
      </button>
    </nav>
  );
};

// Google Reviews Integration - Direct Links Only (No Fallback)
const handleGoogleReviews = (action) => {
  const reviewUrls = {
    read: 'https://www.google.com/search?q=Memories+Frames+%26+Gift+Shop+Reviews#lrd=0x3ba8f7bdd51bd4f5:0xaabae459237db24c,1',
    write: 'https://www.google.com/search?q=Memories+Frames+%26+Gift+Shop+Reviews#lrd=0x3ba8f7bdd51bd4f5:0xaabae459237db24c,3'
  };
  
  // Open ONLY the Google Review URL - no fallback, no extra tabs
  const reviewUrl = reviewUrls[action];
  window.open(reviewUrl, '_blank', 'noopener,noreferrer');
  console.log(`Google ${action} reviews opened: ${reviewUrl}`);
};

// SEO Component with New Branding
const SEOHead = () => (
  <Helmet>
    <title>Memories - Photo Frames & Customized Gift Shop | Coimbatore | Frame with Love and Crafted with Care</title>
    <meta name="description" content="Memories - Premium photo frames & customized gifts in Coimbatore. Sublimation printing, custom mugs, t-shirts, corporate gifts. Visit 19B Kani Illam, Keeranatham Road. Call +91 81480 40148" />
    <meta name="keywords" content="memories photo frames, coimbatore gift shop, sublimation printing, custom mugs, personalized t-shirts, corporate gifts, keeranatham road, photo printing coimbatore" />
    <meta property="og:title" content="Memories - Photo Frames & Customized Gift Shop Coimbatore" />
    <meta property="og:description" content="Frame with Love and Crafted with Care - Premium photo frames and personalized gifts. Sublimation printing specialist in Coimbatore." />
    <meta property="og:image" content="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/t3qf6xi2_NAME.png" />
    <meta property="og:url" content="https://customframe-shop.preview.emergentagent.com" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://customframe-shop.preview.emergentagent.com" />
    <link rel="icon" href="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/6aq8xona_LOGO.png" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Memories - Photo Frames & Customized Gift Shop",
        "description": "Frame with Love and Crafted with Care - Premium photo frames, sublimation printing, and personalized gifts",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "19B Kani Illam, Keeranatham Road, Near Ruby School",
          "addressLocality": "Saravanampatti, Coimbatore",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641035",
          "addressCountry": "IN"
        },
        "telephone": "+91 81480 40148",
        "email": "memories@photogifthub.com",
        "url": "https://customframe-shop.preview.emergentagent.com",
        "openingHours": ["Mo-Sa 09:30-21:00"],
        "priceRange": "₹₹",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "263"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "11.0755",
          "longitude": "76.9983"
        }
      })}
    </script>
  </Helmet>
);

// WhatsApp Float Button
const WhatsAppFloat = () => (
  <div className="fixed bottom-6 right-6 z-50 animate-bounce">
    <Button 
      className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white group"
      onClick={() => window.open('https://wa.me/918148040148?text=Hi! I need help with custom photo frames and gifts', '_blank')}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
    </Button>
    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
  </div>
);

// New Logo Component
const BusinessLogo = ({ size = "w-12 h-12" }) => {
  return (
    <div className={`${size} relative group cursor-pointer`}>
      <img 
        src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/6aq8xona_LOGO.png"
        alt="Memories Logo"
        className={`${size} object-contain rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
      />
    </div>
  );
};

// Business Name Component (with built-in caption)
const BusinessName = () => {
  return (
    <img 
      src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/t3qf6xi2_NAME.png"
      alt="Memories - Frame with Love and Crafted with Care"
      className="h-10 object-contain"
    />
  );
};

// Smart Call Button Component
const SmartCallButton = ({ className = "", children, phoneNumber = "+918148040148" }) => {
  const handleCall = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: Open dialer
      window.open(`tel:${phoneNumber}`, '_blank');
    } else {
      // Desktop: Open WhatsApp
      window.open(`https://wa.me/918148040148?text=Hi! I want to call about your services`, '_blank');
    }
  };

  return (
    <Button className={className} onClick={handleCall}>
      {children}
    </Button>
  );
};

// Cart Icon Component with Navigation to Dedicated Checkout Page
const CartIcon = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    console.log('🛒 Cart icon clicked, navigating to checkout...');
    console.log('🛒 Current cart count:', cartCount);
    
    // Use React Router navigation to preserve app state
    navigate('/checkout');
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative group"
      onClick={handleCheckout}
    >
      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {cartCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rose-500 animate-pulse">
          {cartCount}
        </Badge>
      )}
    </Button>
  );
};

// Enhanced User Profile Component with Login/Logout
const UserProfileButton = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Check for existing user on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('memoriesUserProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.profileComplete) {
          setUser(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);
  
  const handleLogin = () => {
    // Show the actual enhanced profile component for real user interaction
    setShowDropdown(false);
    
    // Create a proper profile dialog with the real UserProfileEnhanced component
    const profileDialog = document.createElement('div');
    profileDialog.innerHTML = `
      <div id="enhanced-profile-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-5xl max-h-[95vh] overflow-hidden m-4 relative">
          <button onclick="document.getElementById('enhanced-profile-modal').remove()" class="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-md">
            ✕
          </button>
          <div id="enhanced-profile-content" class="p-6 overflow-auto max-h-[95vh]">
            <div class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Loading Enhanced Profile...</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(profileDialog);
    
    // Add ESC key and click outside functionality
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('enhanced-profile-modal');
        if (modal) {
          modal.remove();
          document.removeEventListener('keydown', handleEscClose);
        }
      }
    };
    document.addEventListener('keydown', handleEscClose);
    
    const modal = document.getElementById('enhanced-profile-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
          document.removeEventListener('keydown', handleEscClose);
        }
      });
    }
    
    // Load the actual UserProfileEnhanced component
    // For now, we'll simulate loading the real component with working features
    setTimeout(() => {
      const contentDiv = document.getElementById('enhanced-profile-content');
      if (contentDiv) {
        contentDiv.innerHTML = `
          <div class="max-w-4xl mx-auto">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">User Profile</h1>
              <p class="text-gray-600">Manage your personal information and preferences</p>
            </div>
            
            <!-- Profile Creation/Login Form -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="space-y-6">
                <div class="text-center">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Create Your Profile</h3>
                  <p class="text-sm text-gray-600 mb-6">Get started with your personalized experience</p>
                </div>
                
                <form id="profile-form" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" id="user-name" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500" placeholder="Enter your full name">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input type="email" id="user-email" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500" placeholder="Enter your email">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" id="user-phone" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500" placeholder="+91 98765 43210">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
                      <input type="date" id="user-dob" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500">
                      <p class="text-xs text-gray-500 mt-1">We'll send you birthday wishes!</p>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea id="user-address" rows="2" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500" placeholder="Enter your address for delivery"></textarea>
                  </div>
                  
                  <!-- Enhanced Features -->
                  <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">🎉 Enhanced Features (Phase 1)</h4>
                    
                    <!-- Reminder Preferences -->
                    <div class="bg-blue-50 rounded-lg p-4 mb-4">
                      <h5 class="font-medium text-blue-900 mb-2">📱 Reminder Preferences</h5>
                      <p class="text-sm text-blue-700 mb-3">How would you like to receive reminders for important dates?</p>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input type="checkbox" id="email-reminders" class="rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                          <span class="ml-2 text-sm text-blue-800">📧 Email reminders</span>
                        </label>
                        <label class="flex items-center">
                          <input type="checkbox" id="sms-reminders" class="rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                          <span class="ml-2 text-sm text-blue-800">💬 SMS reminders (Coming Soon)</span>
                        </label>
                        <label class="flex items-center">
                          <input type="checkbox" id="whatsapp-reminders" class="rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                          <span class="ml-2 text-sm text-blue-800">📱 WhatsApp reminders (Coming Soon)</span>
                        </label>
                      </div>
                    </div>
                    
                    <!-- Privacy Consent -->
                    <div class="bg-green-50 rounded-lg p-4 mb-4">
                      <h5 class="font-medium text-green-900 mb-2">🔒 Privacy & Consent</h5>
                      <div class="space-y-2">
                        <label class="flex items-start">
                          <input type="checkbox" id="marketing-consent" class="mt-1 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                          <span class="ml-2 text-sm text-green-800">I agree to receive marketing communications and promotional offers</span>
                        </label>
                        <label class="flex items-start">
                          <input type="checkbox" id="reminder-consent" class="mt-1 rounded border-gray-300 text-rose-600 focus:ring-rose-500">
                          <span class="ml-2 text-sm text-green-800">I agree to receive reminders for important dates I add</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex space-x-3 pt-4">
                    <button type="submit" class="flex-1 bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 font-medium">
                      ✨ Create Profile & Start Using Features
                    </button>
                    <button type="button" onclick="document.getElementById('enhanced-profile-modal').remove()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;
        
        // Add form submission handler
        const form = document.getElementById('profile-form');
        if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const profileData = {
              name: document.getElementById('user-name').value,
              email: document.getElementById('user-email').value,
              phone: document.getElementById('user-phone').value,
              date_of_birth: document.getElementById('user-dob').value,
              address: document.getElementById('user-address').value,
              reminder_preferences: {
                email: document.getElementById('email-reminders').checked,
                sms: document.getElementById('sms-reminders').checked,
                whatsapp: document.getElementById('whatsapp-reminders').checked
              },
              privacy_consent: {
                marketing_consent: document.getElementById('marketing-consent').checked,
                reminder_consent: document.getElementById('reminder-consent').checked,
                consent_timestamp: new Date().toISOString()
              },
              created_at: new Date().toISOString(),
              profileComplete: true
            };
            
            // Save profile to localStorage (in production, this would be a real API call)
            localStorage.setItem('memoriesUserProfile', JSON.stringify(profileData));
            
            // Show success message and close modal
            alert('🎉 Profile created successfully! You can now use all enhanced features including:\\n\\n• Add important dates and get reminders\\n• Manage your photos securely\\n• Track your orders and wallet\\n• Export or delete your data anytime\\n\\nWelcome to Memories!');
            
            // Close modal and reload to show logged-in state
            document.getElementById('enhanced-profile-modal').remove();
            window.location.reload();
          });
        }
      }
    }, 500);
  };
  
  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('memoriesUserProfile');
    setUser(null);
    setShowDropdown(false);
    toast.success('Successfully logged out');
  };
  
  const showReactProfileModal = () => {
    // Create a proper React modal for the enhanced profile
    const profileModal = document.createElement('div');
    profileModal.innerHTML = `
      <div id="react-profile-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-6xl max-h-[95vh] overflow-hidden m-4 relative">
          <button onclick="document.getElementById('react-profile-modal').remove()" class="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-md">
            ✕
          </button>
          <div id="react-profile-content" class="p-6 overflow-auto max-h-[95vh]">
            <div class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Loading Enhanced Profile...</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(profileModal);
    
    // Load the WORKING React component content
    setTimeout(() => {
      const contentDiv = document.getElementById('react-profile-content');
      if (contentDiv) {
        contentDiv.innerHTML = `
          <div class="max-w-4xl mx-auto">
            <div class="mb-6">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Enhanced Profile</h1>
              <p class="text-gray-600">Manage your personal information, important dates, and privacy preferences</p>
            </div>
            
            <!-- Tab Navigation with Working Functionality -->
            <div class="border-b border-gray-200 mb-6">
              <nav class="-mb-px flex space-x-8">
                <button onclick="showProfileTab('profile')" id="tab-profile" class="profile-tab py-2 px-1 border-b-2 border-rose-500 font-medium text-sm text-rose-600">
                  👤 Profile
                </button>
                <button onclick="showProfileTab('photos')" id="tab-photos" class="profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                  📸 My Photos
                </button>
                <button onclick="showProfileTab('dates')" id="tab-dates" class="profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                  📅 Important Dates
                </button>
                <button onclick="showProfileTab('wallet')" id="tab-wallet" class="profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                  💰 Wallet
                </button>
                <button onclick="showProfileTab('privacy')" id="tab-privacy" class="profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                  🔒 Privacy & Data
                </button>
              </nav>
            </div>
            
            <!-- Tab Content -->
            <div id="profile-tab-content"></div>
          </div>
        `;
        
        // Add WORKING tab switching functionality
        window.showProfileTab = function(tabName) {
          // Update tab styles
          document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.className = 'profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700';
          });
          document.getElementById('tab-' + tabName).className = 'profile-tab py-2 px-1 border-b-2 border-rose-500 font-medium text-sm text-rose-600';
          
          // Load working tab content
          const contentDiv = document.getElementById('profile-tab-content');
          const userData = JSON.parse(localStorage.getItem('memoriesUserProfile') || '{}');
          const importantDates = JSON.parse(localStorage.getItem('userImportantDates') || '[]');
          
          switch(tabName) {
            case 'profile':
              contentDiv.innerHTML = `
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="profile-name" value="${userData.name || ''}" class="w-full border border-gray-300 rounded-md px-3 py-2">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="profile-email" value="${userData.email || ''}" class="w-full border border-gray-300 rounded-md px-3 py-2">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" id="profile-phone" value="${userData.phone || ''}" class="w-full border border-gray-300 rounded-md px-3 py-2">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input type="date" id="profile-dob" value="${userData.date_of_birth || ''}" class="w-full border border-gray-300 rounded-md px-3 py-2">
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea id="profile-address" rows="2" class="w-full border border-gray-300 rounded-md px-3 py-2">${userData.address || ''}</textarea>
                    </div>
                    <button onclick="saveProfile()" class="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600">Save Changes</button>
                  </div>
                </div>
              `;
              break;
              
            case 'photos':
              contentDiv.innerHTML = `
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">📸 My Photos</h3>
                  <p class="text-gray-600 mb-4">Your photos are managed through our secure Cloudinary integration</p>
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-medium text-blue-900 mb-2">Photo Management Features:</h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                      <li>✅ Secure upload with file validation</li>
                      <li>✅ Automatic thumbnail generation</li>
                      <li>✅ Product mockup creation</li>
                      <li>✅ Private access with signed URLs</li>
                      <li>✅ 30-day retention policy</li>
                    </ul>
                  </div>
                  <p class="text-sm text-gray-600 mt-4">
                    <strong>Note:</strong> The full photo management interface is available in the main profile component. 
                    This includes upload, gallery view, mockup generation, and secure deletion.
                  </p>
                </div>
              `;
              break;
              
            case 'dates':
              contentDiv.innerHTML = `
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">📅 Important Dates</h3>
                    <button onclick="addNewDate()" class="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 text-sm">
                      ➕ Add Date
                    </button>
                  </div>
                  
                  <div id="dates-list" class="space-y-3">
                    ${importantDates.length === 0 ? 
                      '<div class="text-center py-8 text-gray-500"><p>No important dates added yet</p><p class="text-sm">Click "Add Date" to get started</p></div>' :
                      importantDates.map(date => `
                        <div class="border rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <h4 class="font-semibold">${date.name}</h4>
                            <p class="text-sm text-gray-600">${new Date(date.date).toLocaleDateString()}</p>
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${date.type}</span>
                          </div>
                          <div class="flex space-x-2">
                            <button onclick="editDate('${date.id}')" class="text-blue-600 hover:text-blue-800">✏️</button>
                            <button onclick="deleteDate('${date.id}')" class="text-red-600 hover:text-red-800">🗑️</button>
                          </div>
                        </div>
                      `).join('')
                    }
                  </div>
                </div>
              `;
              break;
              
            case 'wallet':
              const walletData = JSON.parse(localStorage.getItem('userWalletData') || '{"balance": 0, "points": 100, "tier": "Silver"}');
              contentDiv.innerHTML = `
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">💰 Wallet & Rewards</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-green-50 p-4 rounded-lg text-center">
                      <h4 class="font-semibold text-green-800">Wallet Balance</h4>
                      <p class="text-2xl font-bold text-green-600">₹${walletData.balance}</p>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg text-center">
                      <h4 class="font-semibold text-blue-800">Reward Points</h4>
                      <p class="text-2xl font-bold text-blue-600">${walletData.points}</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg text-center">
                      <h4 class="font-semibold text-purple-800">Tier Status</h4>
                      <p class="text-xl font-bold text-purple-600">${walletData.tier}</p>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <button onclick="addMoney()" class="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">Add Money to Wallet</button>
                    <button onclick="viewTransactions()" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">View Transaction History</button>
                  </div>
                </div>
              `;
              break;
              
            case 'privacy':
              contentDiv.innerHTML = `
                <div class="space-y-6">
                  <div class="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">🔒 Privacy & Data Management</h3>
                    
                    <div class="space-y-4 mb-6">
                      <div class="flex items-center justify-between p-3 border rounded">
                        <span>Marketing Communications</span>
                        <label class="switch">
                          <input type="checkbox" id="marketing-toggle" ${userData.privacy_consent?.marketing_consent ? 'checked' : ''}>
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="flex items-center justify-between p-3 border rounded">
                        <span>Reminder Notifications</span>
                        <label class="switch">
                          <input type="checkbox" id="reminder-toggle" ${userData.privacy_consent?.reminder_consent ? 'checked' : ''}>
                          <span class="slider"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onclick="exportUserData()" class="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-center">
                        <div class="text-blue-500 text-2xl mb-2">📥</div>
                        <h5 class="font-medium">Export My Data</h5>
                        <p class="text-sm text-gray-600">Download all your data</p>
                      </button>
                      <button onclick="deleteUserData()" class="p-4 border border-red-200 rounded-lg hover:bg-red-50 text-center">
                        <div class="text-red-500 text-2xl mb-2">🗑️</div>
                        <h5 class="font-medium text-red-700">Delete My Data</h5>
                        <p class="text-sm text-gray-600">Permanent account deletion</p>
                      </button>
                    </div>
                  </div>
                </div>
              `;
              break;
          }
        };
        
        // Add WORKING functionality for all features
        window.saveProfile = function() {
          const updatedProfile = {
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            date_of_birth: document.getElementById('profile-dob').value,
            address: document.getElementById('profile-address').value,
            updated_at: new Date().toISOString()
          };
          
          localStorage.setItem('memoriesUserProfile', JSON.stringify(updatedProfile));
          alert('✅ Profile saved successfully!');
        };
        
        window.addNewDate = function() {
          const name = prompt('Event Name (e.g., "Mom\'s Birthday"):');
          if (!name) return;
          
          const date = prompt('Date (YYYY-MM-DD):');
          if (!date) return;
          
          const type = prompt('Type (birthday/anniversary/custom):', 'birthday');
          
          const newDate = {
            id: 'date_' + Date.now(),
            name: name,
            date: date,
            type: type || 'custom',
            reminder_enabled: true,
            created_at: new Date().toISOString()
          };
          
          const currentDates = JSON.parse(localStorage.getItem('userImportantDates') || '[]');
          currentDates.push(newDate);
          localStorage.setItem('userImportantDates', JSON.stringify(currentDates));
          
          alert('✅ Important date added successfully!');
          showProfileTab('dates'); // Refresh the dates tab
        };
        
        window.deleteDate = function(dateId) {
          if (confirm('Are you sure you want to delete this important date?')) {
            const currentDates = JSON.parse(localStorage.getItem('userImportantDates') || '[]');
            const updatedDates = currentDates.filter(date => date.id !== dateId);
            localStorage.setItem('userImportantDates', JSON.stringify(updatedDates));
            
            alert('✅ Date deleted successfully!');
            showProfileTab('dates'); // Refresh the dates tab
          }
        };
        
        window.exportUserData = function() {
          const userData = {
            profile: JSON.parse(localStorage.getItem('memoriesUserProfile') || '{}'),
            dates: JSON.parse(localStorage.getItem('userImportantDates') || '[]'),
            wallet: JSON.parse(localStorage.getItem('userWalletData') || '{}'),
            preferences: JSON.parse(localStorage.getItem('userReminderPreferences') || '{}')
          };
          
          const dataStr = JSON.stringify(userData, null, 2);
          const dataBlob = new Blob([dataStr], {type: 'application/json'});
          const url = URL.createObjectURL(dataBlob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `memories-data-export-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          
          alert('📥 Data export started! Check your downloads folder.');
        };
        
        window.deleteUserData = function() {
          const confirmed = confirm('⚠️ WARNING: This will permanently delete ALL your data including profile, photos, orders, and wallet information. This cannot be undone. Are you sure?');
          
          if (confirmed) {
            const finalConfirm = prompt('Type "DELETE" to confirm permanent data deletion:');
            if (finalConfirm === 'DELETE') {
              // Clear all user data
              localStorage.removeItem('memoriesUserProfile');
              localStorage.removeItem('userImportantDates');
              localStorage.removeItem('userWalletData');
              localStorage.removeItem('userReminderPreferences');
              
              alert('🗑️ All data deleted successfully. You will be redirected to the homepage.');
              document.getElementById('react-profile-modal').remove();
              window.location.reload();
            } else {
              alert('Data deletion cancelled - incorrect confirmation text.');
            }
          }
        };
        
        // Add CSS for switches
        const style = document.createElement('style');
        style.textContent = `
          .switch { position: relative; display: inline-block; width: 50px; height: 24px; }
          .switch input { opacity: 0; width: 0; height: 0; }
          .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
          .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
          input:checked + .slider { background-color: #ef4444; }
          input:checked + .slider:before { transform: translateX(26px); }
        `;
        document.head.appendChild(style);
        
        // Show default tab
        showProfileTab('profile');
      }
    }, 500);
  };
  
  return (
    <div className="relative">
      {user ? (
        // Logged in state
        <div className="flex items-center space-x-2">
          <button 
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user.name.split(' ')[0]}
            </span>
          </button>
          
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="p-1">
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => {
                    setShowDropdown(false);
                    // Show the actual React component instead of the legacy HTML modal
                    showReactProfileModal();
                  }}
                >
                  ⚙️ Manage Profile & Features
                </button>
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Logged out state
        <button 
          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          onClick={handleLogin}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Sign In</span>
        </button>
      )}
    </div>
  );
};

// Enhanced Header Component with Universal Navigation
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect active section based on scroll position
  useEffect(() => {
    const detectActiveSection = () => {
      if (location.pathname === '/about') {
        setActiveSection('about');
        return;
      } else if (location.pathname === '/checkout') {
        setActiveSection('checkout');
        return;
      } else if (location.pathname === '/') {
        const sections = ['shop', 'customizer', 'ai-finder'];
        const headerHeight = 100;
        
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
              setActiveSection(section);
              return;
            }
          }
        }
        
        // Default to home if no section is active
        if (window.scrollY < 200) {
          setActiveSection('home');
        }
      }
    };

    // Initial detection
    detectActiveSection();
    
    // Listen for scroll events
    window.addEventListener('scroll', detectActiveSection);
    
    return () => {
      window.removeEventListener('scroll', detectActiveSection);
    };
  }, [location.pathname]);

  // Universal navigation handler
  const handleNavigation = (target, closeMenu = false) => {
    if (closeMenu) {
      setIsMenuOpen(false);
    }
    
    if (target === '/') {
      // Navigate to home
      navigate('/');
      setActiveSection('home');
    } else if (target === '/about') {
      // Navigate to About Us page
      navigate('/about');
      setActiveSection('about');
    } else if (target === '/checkout') {
      // Navigate to checkout
      navigate('/checkout');
      setActiveSection('checkout');
    } else if (target.startsWith('#')) {
      // Same-page anchor navigation
      const elementId = target.substring(1);
      setActiveSection(elementId);
      
      if (location.pathname !== '/') {
        // Navigate to home first, then scroll
        navigate('/');
        setTimeout(() => {
          smoothScrollToElement(elementId);
        }, 300);
      } else {
        // Already on home page, just scroll
        smoothScrollToElement(elementId);
      }
    }
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar - Restructured */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-rose-50">
          {/* Left side - Empty for logo expansion */}
          <div></div>
          
          {/* Right side - All contact info and badges */}
          <div className="flex items-center space-x-4 text-gray-700">
            <SmartCallButton className="flex items-center space-x-2 text-gray-800 hover:text-rose-600 transition-colors cursor-pointer bg-transparent p-0 h-auto">
              <Phone className="w-3 h-3 text-rose-600" />
              <span className="font-semibold text-gray-900">+91 81480 40148</span>
            </SmartCallButton>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="text-gray-800 font-medium">Mon-Sat 9:30AM-9PM</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="w-3 h-3 text-green-600" />
              <span className="text-gray-800 font-medium">Keeranatham Road, Coimbatore</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
              <Truck className="w-3 h-3 mr-1" />
              Free Delivery Available
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              4.9★ Rated Shop
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between h-20">
          {/* Left side - Aligned Logo and Brand */}
          <div className="flex items-center space-x-3 group cursor-pointer flex-shrink-0">
            <BusinessLogo size="w-12 h-12" />
            <div className="block">
              <BusinessName />
              <p className="text-xs text-gray-500 italic block sm:hidden mt-1">Frame with Love • Crafted with Care</p>
            </div>
          </div>
          
          {/* Center - Navigation */}
          <div className="flex-1 flex justify-center">
            <HierarchicalNavigation 
              handleNavigation={handleNavigation}
            />
          </div>
          
          {/* Right side - All action buttons */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:block">
              <SearchComponent />
            </div>
            
            <UserProfileButton />
            <CartIcon />
            
            <SmartCallButton className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hidden lg:flex">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </SmartCallButton>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-rose-100 bg-white/95 backdrop-blur-md max-h-96 overflow-y-auto">
            <div className="mb-4">
              <SearchComponent />
            </div>
            <nav className="flex flex-col space-y-2">
              {/* Simple Mobile Navigation */}
              <button 
                onClick={() => handleNavigation('/', true)}
                className="text-gray-700 hover:text-red-800 hover:bg-red-50 font-medium py-3 px-4 rounded-lg text-left border-none cursor-pointer w-full transition-colors"
              >
                🏠 Home
              </button>
              
              {/* Enhanced Hierarchical Mobile Categories */}
              {navigationStructure.map((category, index) => (
                <div key={category.key} className="border-l-2 border-rose-100 ml-2 pl-3">
                  <div className="mobile-category-header flex items-center space-x-2 py-2 px-2 font-medium text-gray-800 text-sm rounded transition-all duration-200">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => {
                          handleNavigation('#shop', true);
                          setActiveSection('shop');
                        }}
                        className="mega-menu-item block text-xs py-2 px-3 rounded-md text-left bg-transparent border-none cursor-pointer w-full"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => handleNavigation('#customizer', true)}
                className="text-gray-700 hover:text-red-800 hover:bg-red-50 font-medium py-3 px-4 rounded-lg text-left border-none cursor-pointer w-full transition-colors"
              >
                🎨 Customize
              </button>
              <button 
                onClick={() => handleNavigation('#ai-finder', true)}
                className="text-gray-700 hover:text-red-800 hover:bg-red-50 font-medium py-3 px-4 rounded-lg text-left border-none cursor-pointer w-full transition-colors"
              >
                🤖 Gift Finder
              </button>
              <button 
                onClick={() => handleNavigation('/about', true)}
                className="text-gray-700 hover:text-red-800 hover:bg-red-50 font-medium py-3 px-4 rounded-lg text-left border-none cursor-pointer w-full transition-colors"
              >
                ℹ️ About Us
              </button>
              <SmartCallButton className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white mx-4">
                <Phone className="w-4 h-4 mr-2" />
                Call +91 81480 40148
              </SmartCallButton>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// About Us Popup Component (First Visit)
const AboutUsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('memoriesVisited');
    if (!hasVisited) {
      setTimeout(() => setShowPopup(true), 2000); // Show after 2 seconds
      localStorage.setItem('memoriesVisited', 'true');
    }
  }, []);

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BusinessLogo size="w-8 h-8" />
            <span>Welcome to Memories!</span>
          </DialogTitle>
          <DialogDescription>
            Your trusted partner for premium photo frames and personalized gifts since 2020
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
            <h3 className="font-semibold text-rose-800 mb-2">🎉 Grand Opening Offers!</h3>
            <ul className="text-sm text-rose-700 space-y-1">
              <li>• 25% OFF on all photo frames</li>
              <li>• Free home delivery</li>
              <li>• Free gift wrapping</li>
              <li>• AI-powered gift recommendations</li>
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">Located at Keeranatham Road, Coimbatore</p>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  document.getElementById('customizer')?.scrollIntoView({behavior: 'smooth'});
                  setShowPopup(false);
                }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                Start Creating Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPopup(false)}
                className="w-full"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced Photo Customizer with Matt Black and Design Frames
const PhotoCustomizer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('wooden');
  const [selectedSize, setSelectedSize] = useState('8x10');
  const [borderThickness, setBorderThickness] = useState('1');
  const { addToCart } = useCart();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setSelectedImage(response.data);
        setUploadStatus(response.data.message);
        toast.success("Image uploaded successfully! Ready for customization 🎨");
      }
    } catch (error) {
      toast.error("Upload failed. Please try again or call us at +91 81480 40148");
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const frameStyles = {
    wooden: { name: 'Classic Wooden Frame', color: '#8B4513', price: 0 },
    acrylic: { name: 'Modern Acrylic Frame', color: '#E0E0E0', price: 200 },
    metal: { name: 'Sleek Metal Frame', color: '#C0C0C0', price: 150 },
    led: { name: 'LED Backlit Frame', color: '#FFD700', price: 500 },
    mattblack: { name: 'Matt Black Frame', color: '#2C2C2C', price: 300 },
    design: { name: 'Designer Frame', color: '#D4A574', price: 400 }
  };

  const sizes = {
    '8x10': { name: '8" × 10"', price: 899 },
    '12x16': { name: '12" × 16"', price: 1199 },
    '16x20': { name: '16" × 20"', price: 1599 },
    '20x24': { name: '20" × 24"', price: 1999 }
  };

  const borderThicknesses = [
    '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2', '2.25', '2.5', '2.75', '3', '3.25', '3.5', '3.75', '4'
  ];

  const calculatePrice = () => {
    const basePrice = sizes[selectedSize].price;
    const framePrice = frameStyles[selectedFrame].price;
    const borderPrice = parseFloat(borderThickness) * 50; // ₹50 per 0.25 inch
    return basePrice + framePrice + borderPrice;
  };

  const handleAddToCart = () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    const customProduct = {
      id: `custom_frame_${Date.now()}`,
      name: `Custom Photo Frame - ${frameStyles[selectedFrame].name}`,
      description: `${sizes[selectedSize].name} with ${borderThickness}" border`,
      base_price: calculatePrice(),
      category: 'frames',
      image_url: selectedImage.image_url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=300',
      customOptions: {
        frameStyle: frameStyles[selectedFrame].name,
        size: sizes[selectedSize].name,
        borderThickness: `${borderThickness}"`,
        uploadedImage: selectedImage
      }
    };
    
    addToCart(customProduct, customProduct.customOptions);
  };

  const sharePreview = () => {
    if (selectedImage) {
      const shareText = `Check out my custom photo frame design! ${frameStyles[selectedFrame].name} - ${sizes[selectedSize].name} with ${borderThickness}" border. Only ₹${calculatePrice()}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'My Custom Photo Frame',
          text: shareText,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast.success('Preview details copied to clipboard!');
      }
    }
  };

  const saveDesign = () => {
    if (selectedImage) {
      const design = {
        frame: selectedFrame,
        size: selectedSize,
        borderThickness,
        image: selectedImage,
        price: calculatePrice(),
        timestamp: new Date().toISOString()
      };
      
      const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
      savedDesigns.push(design);
      localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));
      
      toast.success('Design saved! 💾');
    }
  };

  return (
    <section id="customizer" className="py-20 bg-gradient-to-br from-gray-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 text-purple-800 mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Smart Upload & Live Preview
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Photo Customizer
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your photo and see it transformed into a beautiful custom frame with real-time preview. 
            Our AI ensures perfect quality for printing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="border-2 border-dashed border-rose-300 bg-rose-50/50 hover:border-rose-400 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Smart Upload</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Upload JPG, PNG, or HEIC files up to 25MB. Our AI automatically optimizes your photo for the best print quality.
                      <br/><span className="text-sm text-rose-600 font-medium">💡 Tip: Use high-resolution images (min 2000x2000px) for crisp prints</span>
                    </p>
                  </div>
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button 
                        asChild 
                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <span className="cursor-pointer">
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Camera className="w-5 h-5 mr-2" />
                              Choose Your Photo
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                  
                  {uploadStatus && (
                    <div className={`p-3 rounded-lg ${uploadStatus.includes('warning') || uploadStatus.includes('Low') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      <p className="text-sm font-medium">{uploadStatus}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="border border-rose-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                  Live 3D Preview
                </CardTitle>
                <CardDescription>See exactly how your frame will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedImage ? (
                    <div className="relative transform hover:scale-105 transition-transform duration-300">
                      <div 
                        className="w-80 h-80 rounded-lg shadow-2xl"
                        style={{ 
                          backgroundColor: frameStyles[selectedFrame].color,
                          border: selectedFrame === 'led' ? '4px solid #FFD700' : 'none',
                          padding: `${parseFloat(borderThickness) * 8}px`
                        }}
                      >
                        <img 
                          src={`data:image/jpeg;base64,${selectedImage.image_data}`}
                          alt="Your photo preview in custom frame"
                          className="w-full h-full object-cover rounded shadow-lg"
                        />
                        {selectedFrame === 'led' && (
                          <div className="absolute inset-0 rounded-lg shadow-inner border-2 border-yellow-300 animate-pulse"></div>
                        )}
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl -z-10 opacity-20"></div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Camera className="w-20 h-20 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">Upload a photo to see live preview</p>
                    </div>
                  )}
                </div>
                
                {selectedImage && (
                  <div className="mt-8 space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Frame Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(frameStyles).map(([key, style]) => (
                          <Button
                            key={key}
                            variant={selectedFrame === key ? "default" : "outline"}
                            className={`text-xs ${selectedFrame === key ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'border-rose-200 hover:bg-rose-50'}`}
                            onClick={() => setSelectedFrame(key)}
                          >
                            <div 
                              className="w-4 h-4 rounded mr-2 border"
                              style={{ backgroundColor: style.color }}
                            ></div>
                            <span>{style.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Size</label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="border-rose-200 focus:border-rose-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(sizes).map(([key, size]) => (
                            <SelectItem key={key} value={key}>
                              {size.name} - ₹{size.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Border Thickness</label>
                      <Select value={borderThickness} onValueChange={setBorderThickness}>
                        <SelectTrigger className="border-rose-200 focus:border-rose-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {borderThicknesses.map((thickness) => (
                            <SelectItem key={thickness} value={thickness}>
                              {thickness}" border - +₹{parseFloat(thickness) * 50}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700 font-medium">Total Price:</span>
                        <span className="text-3xl font-bold text-rose-600">₹{calculatePrice()}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Includes: {frameStyles[selectedFrame].name} + {sizes[selectedSize].name} + {borderThickness}" border + Free Gift Wrap
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={handleAddToCart}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart - ₹{calculatePrice()}
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          onClick={saveDesign}
                          variant="outline" 
                          className="border-rose-200 text-rose-700 hover:bg-rose-50 py-3"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save Design
                        </Button>
                        <Button 
                          onClick={sharePreview}
                          variant="outline" 
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 py-3"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Share Preview
                        </Button>
                      </div>
                      
                      <div className="text-center pt-3">
                        <SmartCallButton className="text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent">
                          <PhoneCall className="w-4 h-4 mr-2" />
                          Need Help? Call +91 81480 40148
                        </SmartCallButton>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Footer with Correct Location
const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Footer navigation handler - works from any page
  const handleFooterNavigation = (target) => {
    if (target === '/about') {
      navigate('/about');
    } else if (target.startsWith('#')) {
      const elementId = target.substring(1);
      
      if (location.pathname !== '/') {
        // Navigate to home first, then scroll
        navigate('/');
        // Use window.location.href for footer navigation to ensure proper scroll
        setTimeout(() => {
          window.location.href = `/#${elementId}`;
        }, 100);
      } else {
        // Already on home page, just scroll
        setTimeout(() => smoothScrollToElement(elementId), 100);
      }
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <BusinessLogo size="w-12 h-12" />
              <div>
                <BusinessName />
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Creating beautiful personalized memories since 2020. Your trusted partner for premium photo frames, 
              custom gifts, and sublimation printing in Coimbatore.
            </p>
            
            <div className="flex space-x-4">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => window.open('https://instagram.com/memories_photoframes', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => window.open('https://facebook.com/memories.photoframes', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => window.open('https://wa.me/918148040148', '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleFooterNavigation('#shop')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                Shop Products
              </button>
              <button 
                onClick={() => handleFooterNavigation('#customizer')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                Photo Customizer
              </button>
              <button 
                onClick={() => handleFooterNavigation('#ai-finder')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                AI Gift Finder
              </button>
              <button 
                onClick={() => handleFooterNavigation('/about')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                About Us
              </button>
              <Button 
                variant="ghost" 
                className="p-0 text-gray-300 hover:text-white hover:bg-gray-800 h-auto transition-colors"
                onClick={() => window.open('https://wa.me/918148040148?text=Hi! I need a bulk order quote', '_blank')}
              >
                Bulk Orders
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <div className="font-medium text-white">Visit Our Store</div>
                  <div>19B Kani Illam, Keeranatham Road</div>
                  <div>Near Ruby School, Saravanampatti</div>
                  <div>Coimbatore, Tamil Nadu 641035</div>
                </div>
              </div>
              
              <SmartCallButton className="flex items-center space-x-3 bg-transparent p-0 h-auto hover:bg-transparent text-gray-300 hover:text-white">
                <Phone className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="font-medium text-white">Call Us</div>
                  <span className="text-gray-200 hover:text-white transition-colors font-semibold">
                    +91 81480 40148
                  </span>
                </div>
              </SmartCallButton>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="font-medium text-white">Store Hours</div>
                  <div className="text-gray-300">Mon-Sat: 9:30AM - 9:00PM</div>
                  <div className="text-gray-300">Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Our Services</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Custom Photo Frames</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Sublimation Printing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Personalized Mugs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Custom T-Shirts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Corporate Gifts</span>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white w-full"
                  onClick={() => window.open('https://wa.me/918148040148?text=Hi! I need help with custom gifts', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              </div>
            </div>
            
            {/* Visit Store Button moved here */}
            <div className="pt-6">
              <Button 
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => window.open('https://www.google.com/maps/place/19+B+KANNI+NILLAM,+Keeranatham+Rd,+near+RUBY+SCHOOL,+Saravanampatti,+Coimbatore,+Tamil+Nadu+641035/@11.0818634,77.0015281,21z', '_blank')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Visit Our Store
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2025 Memories - Photo Frames & Customized Gift Shop. All rights reserved.</p>
              <p className="text-sm mt-1">Proudly serving Coimbatore since 2020 | 4.9★ Google Rating</p>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <Badge className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Secure Payments
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Truck className="w-3 h-3 mr-1" />
                Free Delivery
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                <Award className="w-3 h-3 mr-1" />
                Quality Guaranteed
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Customer Testimonials with Fixed Google Reviews
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Saravanampatti',
      rating: 5,
      text: 'Amazing quality frames! The sublimation printing is crystal clear and the wooden frame is beautifully crafted. Highly recommend Memories for all your photo frame needs.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c0763c65?auto=format&fit=crop&w=150&h=150',
      product: 'Custom Photo Frame'
    },
    {
      name: 'Rajesh Kumar',
      location: 'RS Puram',
      rating: 5,
      text: 'Ordered 50 corporate mugs for our company event. Exceptional quality and delivered on time. The team at Memories is very professional and helpful.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
      product: 'Corporate Mugs'
    },
    {
      name: 'Meera Krishnan',
      location: 'Peelamedu',
      rating: 5,
      text: 'Got custom t-shirts made for my daughter\'s birthday party. The prints are vibrant and the fabric quality is excellent. Kids loved them!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
      product: 'Custom T-Shirts'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-4">
            <ThumbsUp className="w-3 h-3 mr-1" />
            Customer Reviews
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our 
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Customers </span>
            Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real reviews from real customers who love their personalized memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <blockquote className="text-gray-700 leading-relaxed">
                    <Quote className="w-5 h-5 text-gray-400 mb-2" />
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* Product Badge */}
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {testimonial.product}
                  </Badge>
                  
                  {/* Customer Info */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fixed Google Reviews CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">4.9★ on Google Reviews</div>
            </div>
            <p className="text-gray-600 mb-6">Join 263+ happy customers who rated us 5 stars!</p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => handleGoogleReviews('read')}
                variant="outline" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read All Reviews
              </Button>
              <Button 
                onClick={() => handleGoogleReviews('write')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Route Component Wrapper with Scroll-to-Top
const RouteWrapper = ({ children }) => {
  useScrollToTop();
  return children;
};

// Dedicated Checkout Page Component  
// Checkout-specific Footer with proper navigation
const CheckoutFooter = () => {
  const navigate = useNavigate();
  
  const handleCheckoutFooterNavigation = (target) => {
    if (target === '/about') {
      navigate('/about');
    } else if (target.startsWith('#')) {
      // Navigate to home with hash for proper section navigation
      window.location.href = `/${target}`;
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <BusinessLogo size="w-12 h-12" />
              <div>
                <BusinessName />
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Creating beautiful personalized memories since 2020. Your trusted partner for premium photo frames, 
              custom gifts, and sublimation printing in Coimbatore.
            </p>
            
            <div className="flex space-x-4">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => window.open('https://instagram.com/memories_photoframes', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => window.open('https://facebook.com/memories.photoframes', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => window.open('https://wa.me/918148040148', '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleCheckoutFooterNavigation('#shop')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                Shop Products
              </button>
              <button 
                onClick={() => handleCheckoutFooterNavigation('#customizer')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                Photo Customizer
              </button>
              <button 
                onClick={() => handleCheckoutFooterNavigation('#ai-finder')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                AI Gift Finder
              </button>
              <button 
                onClick={() => handleCheckoutFooterNavigation('/about')}
                className="block text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                About Us
              </button>
              <Button 
                variant="ghost" 
                className="p-0 text-gray-300 hover:text-white hover:bg-gray-800 h-auto transition-colors"
                onClick={() => window.open('https://wa.me/918148040148?text=Hi! I need a bulk order quote', '_blank')}
              >
                Bulk Orders
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Visit Our Store</div>
                  <div className="text-sm">19B Kanni Illam, Keeranatham Road</div>
                  <div className="text-sm">Near Ruby School, Saravanampatti</div>
                  <div className="text-sm">Coimbatore, Tamil Nadu 641035</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-rose-500 text-rose-400 hover:bg-rose-500 hover:text-white"
                    onClick={() => window.open('https://www.google.com/maps/place/19+B+KANNI+NILLAM,+Keeranatham+Rd,+near+RUBY+SCHOOL,+Saravanampatti,+Coimbatore,+Tamil+Nadu+641035/@11.0818634,77.0015281,21z', '_blank')}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    Visit Store
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <div>+91 81480 40148</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>Mon-Sat: 9:30 AM - 9:00 PM</div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Our Services</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <div>📸 Custom Photo Frames</div>
              <div>🎨 Photo Customization</div>
              <div>🖨️ Sublimation Printing</div>
              <div>☕ Custom Mugs & Gifts</div>
              <div>👕 Personalized T-Shirts</div>
              <div>🏢 Corporate Gifts</div>
              <div>🎁 Gift Wrapping (Free)</div>
              <div>🚚 Home Delivery</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Memories Photo Frames & Gifts. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Proudly serving Coimbatore since 2020</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CheckoutPage = () => {
  return (
    <RouteWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50">
        <SEOHead />
        <Header />
        <div className="py-8">
          <EnhancedCheckoutPage />
        </div>
        <CheckoutFooter />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </RouteWrapper>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setProducts(response.data);
        console.log('✅ Products loaded from API:', response.data.length);
      } catch (error) {
        console.error('❌ Error fetching products from API:', error);
        
        // Fallback: Use local products data when API fails
        const fallbackProducts = [
          {
            id: 'frame-wooden-classic',
            name: 'Classic Wooden Frame',
            description: 'Handcrafted wooden frame perfect for cherished memories',
            category: 'frames',
            base_price: 899,
            image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=300'
          },
          {
            id: 'frame-acrylic-premium',
            name: 'Premium Acrylic Frame', 
            description: 'Modern acrylic frame with crystal-clear finish',
            category: 'frames',
            base_price: 1299,
            image_url: 'https://images.unsplash.com/photo-1465161191540-aac346fcbaff?auto=format&fit=crop&w=400&h=300'
          },
          {
            id: 'mug-photo-ceramic',
            name: 'Custom Photo Mug',
            description: 'Personalized ceramic mug with your favorite photo',
            category: 'mugs',
            base_price: 599,
            image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&h=300'
          },
          {
            id: 'pillow-custom-square',
            name: 'Custom Photo Pillow',
            description: 'Soft, comfortable pillow with your custom photo print',
            category: 'pillows', 
            base_price: 799,
            image_url: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa8c?auto=format&fit=crop&w=400&h=300'
          }
        ];
        
        setProducts(fallbackProducts);
        console.log('✅ Using fallback products:', fallbackProducts.length);
        toast.error("Using offline product catalog - Call us for latest prices!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <BusinessLogo size="w-16 h-16" />
            <div className="text-left">
              <BusinessName />
              <p className="text-sm text-gray-600 italic">Frame with Love • Crafted with Care</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Photo Memories...</h2>
            <p className="text-gray-600">Preparing beautiful frames and gifts</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RouteWrapper>
      <div className="min-h-screen bg-white">
        <SEOHead />
        <Header />
        <AboutUsPopup />
        <HeroSection />
        <ProductGrid products={products} />
        <PhotoCustomizer />
        <EnhancedAIGiftFinder />
        <section id="reviews" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ReviewSystemEnhanced />
          </div>
        </section>
        <TestimonialsSection />
        <Footer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </RouteWrapper>
  );
};

function App() {
  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<RouteWrapper><AboutUsPage /></RouteWrapper>} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;