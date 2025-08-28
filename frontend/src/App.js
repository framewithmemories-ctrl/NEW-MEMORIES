import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { UserProfile } from "./components/UserProfile";
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// SEO Component with New Branding
const SEOHead = () => (
  <Helmet>
    <title>Memories - Photo Frames & Customized Gift Shop | Coimbatore | Frame with Love and Crafted with Care</title>
    <meta name="description" content="Memories - Premium photo frames & customized gifts in Coimbatore. Sublimation printing, custom mugs, t-shirts, corporate gifts. Visit 19B Kani Illam, Keeranatham Road. Call +91 81480 40148" />
    <meta name="keywords" content="memories photo frames, coimbatore gift shop, sublimation printing, custom mugs, personalized t-shirts, corporate gifts, keeranatham road, photo printing coimbatore" />
    <meta property="og:title" content="Memories - Photo Frames & Customized Gift Shop Coimbatore" />
    <meta property="og:description" content="Frame with Love and Crafted with Care - Premium photo frames and personalized gifts. Sublimation printing specialist in Coimbatore." />
    <meta property="og:image" content="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/t3qf6xi2_NAME.png" />
    <meta property="og:url" content="https://frameify-store.preview.emergentagent.com" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://frameify-store.preview.emergentagent.com" />
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
        "url": "https://frameify-store.preview.emergentagent.com",
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

// Cart Icon Component with Counter
const CartIcon = () => {
  const { cartCount } = useCart();
  
  return (
    <Button variant="ghost" size="icon" className="relative group">
      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {cartCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rose-500 animate-pulse">
          {cartCount}
        </Badge>
      )}
    </Button>
  );
};

// Enhanced Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-rose-50">
          <div className="flex items-center space-x-6 text-gray-600">
            <SmartCallButton className="flex items-center space-x-2 hover:text-rose-600 transition-colors cursor-pointer bg-transparent p-0 h-auto">
              <Phone className="w-3 h-3" />
              <span className="font-medium">+91 81480 40148</span>
            </SmartCallButton>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>Mon-Sat 9:30AM-9PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3" />
              <span>Keeranatham Road, Coimbatore</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
        
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <BusinessLogo size="w-12 h-12" />
              <BusinessName />
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#shop" className="text-gray-700 hover:text-rose-600 font-medium transition-colors relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#customizer" className="text-gray-700 hover:text-rose-600 font-medium transition-colors relative group">
                Customize
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#ai-finder" className="text-gray-700 hover:text-rose-600 font-medium transition-colors relative group">
                Gift Finder
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#about" className="text-gray-700 hover:text-rose-600 font-medium transition-colors relative group">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-600 transition-all group-hover:w-full"></span>
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <SearchComponent />
            </div>
            
            <Badge variant="secondary" className="bg-rose-100 text-rose-800 hidden sm:flex animate-pulse">
              <Gift className="w-3 h-3 mr-1" />
              Free Gift Wrap
            </Badge>
            
            <UserProfile />
            <CartIcon />
            
            <SmartCallButton className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hidden sm:flex">
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
          <div className="md:hidden py-4 border-t border-rose-100 bg-white/95 backdrop-blur-md">
            <div className="mb-4">
              <SearchComponent />
            </div>
            <nav className="flex flex-col space-y-3">
              <a href="#shop" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">Shop</a>
              <a href="#customizer" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">Customize</a>
              <a href="#ai-finder" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">Gift Finder</a>
              <a href="#about" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">About Us</a>
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

// Home component will be continued in next file due to length...