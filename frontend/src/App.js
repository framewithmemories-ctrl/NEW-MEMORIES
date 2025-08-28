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

// SEO Component
const SEOHead = () => (
  <Helmet>
    <title>Memories - Photo Frames & Customized Gift Shop | Coimbatore | Premium Quality Frames</title>
    <meta name="description" content="Memories - Premium photo frames & customized gifts in Coimbatore. Sublimation printing, custom mugs, t-shirts, corporate gifts. Visit 19B Kani Illam, Keeranatham Road. Call +91 81480 40148" />
    <meta name="keywords" content="memories photo frames, coimbatore gift shop, sublimation printing, custom mugs, personalized t-shirts, corporate gifts, keeranatham road, photo printing coimbatore" />
    <meta property="og:title" content="Memories - Photo Frames & Customized Gift Shop Coimbatore" />
    <meta property="og:description" content="Premium photo frames and personalized gifts. Sublimation printing specialist in Coimbatore." />
    <meta property="og:image" content="https://customer-assets.emergentagent.com/job_photogifthub/artifacts/kma6onzm_Memories%20Business%20Card-KEERTHANA.png" />
    <meta property="og:url" content="https://frameify-store.preview.emergentagent.com" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://frameify-store.preview.emergentagent.com" />
    <link rel="icon" href="https://customer-assets.emergentagent.com/job_photogifthub/artifacts/kma6onzm_Memories%20Business%20Card-KEERTHANA.png" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Memories - Photo Frames & Customized Gift Shop",
        "description": "Premium photo frames, sublimation printing, and personalized gifts",
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

// Animated Logo Component with New Branding
const AnimatedLogo = ({ size = "w-12 h-12" }) => {
  return (
    <div className={`${size} relative group cursor-pointer`}>
      <img 
        src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/6aq8xona_LOGO.png"
        alt="Logo"
        className={`${size} object-contain rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
      />
    </div>
  );
};

// Business Name Component
const BusinessName = ({ size = "text-2xl" }) => {
  return (
    <img 
      src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/t3qf6xi2_NAME.png"
      alt="Business Name"
      className="h-8 object-contain"
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

// Header Component Enhanced
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-rose-50">
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2 hover:text-rose-600 transition-colors cursor-pointer"
                 onClick={() => window.open('tel:+918148040148', '_blank')}>
              <Phone className="w-3 h-3" />
              <span className="font-medium">+91 81480 40148</span>
            </div>
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
              <AnimatedLogo size="w-12 h-12" />
              <div className="flex flex-col">
                <BusinessName />
                <span className="text-xs text-gray-500 -mt-1">Frame with Love and Crafted with Care</span>
              </div>
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
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search frames, mugs, t-shirts..." 
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
            
            <Badge variant="secondary" className="bg-rose-100 text-rose-800 hidden sm:flex animate-pulse">
              <Gift className="w-3 h-3 mr-1" />
              Free Gift Wrap
            </Badge>
            
            <Button variant="ghost" size="icon" className="relative group">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rose-500 animate-pulse">
                0
              </Badge>
            </Button>
            
            <SmartCallButton 
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hidden sm:flex"
            >
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
            <nav className="flex flex-col space-y-3">
              <a href="#shop" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">Shop</a>
              <a href="#customizer" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">Customize</a>
              <a href="#ai-finder" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">Gift Finder</a>
              <a href="#about" className="text-gray-700 hover:text-rose-600 font-medium py-2 px-4 hover:bg-rose-50 rounded-lg transition-all">About Us</a>
              <Button 
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white mx-4"
                onClick={() => window.open('tel:+918148040148', '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call +91 81480 40148
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Enhanced Hero Section with Business Branding
const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1465161191540-aac346fcbaff?auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f?auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1628313388777-9b9a751dfc6a?auto=format&fit=crop&w=600&h=400"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[700px] bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      {/* Urgent Offer Banner */}
      <div className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white py-3 text-center animate-gradient">
        <div className="flex items-center justify-center space-x-3 text-sm font-semibold">
          <Percent className="w-4 h-4 animate-spin" />
          <span>🎉 Grand Opening Offer: 25% OFF All Frames + Free Home Delivery! 🎉</span>
          <Target className="w-4 h-4 animate-bounce" />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fadeInUp">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Badge className="bg-rose-100 text-rose-800 border-rose-200 animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Since 2020 - Trusted by 1000+ Customers
                </Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  4.9★ Google Rating
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Create 
                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"> Beautiful </span>
                Memories with 
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Custom </span>
                Photo Frames
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                <strong>Memories - Photo Frames & Customized Gift Shop</strong><br/>
                Sublimation Printing Specialists • Custom Mugs • T-Shirts • Corporate Gifts<br/>
                <span className="text-rose-600 font-semibold">Located at Keeranatham Road, Coimbatore</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                onClick={() => document.getElementById('customizer').scrollIntoView({behavior: 'smooth'})}
              >
                <Upload className="w-6 h-6 mr-3" />
                Start Creating Now
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-rose-300 text-rose-700 hover:bg-rose-50 font-bold px-8 py-6 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
                onClick={() => document.getElementById('ai-finder').scrollIntoView({behavior: 'smooth'})}
              >
                <Sparkles className="w-6 h-6 mr-3" />
                AI Gift Finder
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-rose-600">1000+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-rose-600">4.9★</div>
                <div className="text-gray-600 font-medium">Google Rating</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open('https://wa.me/918148040148?text=Hi! I want to create custom photo frames', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl"
                onClick={() => window.open('https://maps.google.com/?q=19B+Kani+Illam+Keeranatham+Road+Coimbatore', '_blank')}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Visit Store
              </Button>
            </div>
          </div>
          
          <div className="relative animate-slideInRight">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="aspect-square bg-gradient-to-br from-white to-rose-50 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700">
                <img 
                  src={heroImages[currentImageIndex]}
                  alt="Beautiful custom photo frames showcase"
                  className="w-full h-full object-cover rounded-2xl shadow-lg transition-all duration-1000"
                />
                
                {/* Image Navigation Dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-rose-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <span className="text-white font-bold text-sm">25% OFF</span>
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <div className="text-center">
                  <div className="text-white font-bold text-xs">FREE</div>
                  <div className="text-white font-bold text-xs">DELIVERY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Us Section
const AboutUsSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-rose-100 text-rose-800 mb-4">
            <Heart className="w-3 h-3 mr-1" />
            Our Story
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About 
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Memories </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Welcome to Memories Photo Frames and Gifts
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Where cherished memories come to life! Since 2020, we've been Coimbatore's trusted destination 
                for premium photo frames and personalized gifts. Located at <strong>19B Kani Illam, Keeranatham Road, 
                Near Ruby School, Saravanampatti</strong>, we specialize in bringing your precious moments to life.
              </p>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-rose-100">
                <h4 className="text-xl font-semibold text-rose-600 mb-3">Our Specialties:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <strong>Sublimation Printing</strong> - High-quality, durable prints
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <strong>Custom Photo Mugs</strong> - Personalized for every occasion
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <strong>Customized T-Shirts</strong> - Express your style
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <strong>Corporate Gifts</strong> - Professional branding solutions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <strong>Premium Photo Frames</strong> - Handcrafted with love
                  </li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600">4.9★</div>
                  <div className="text-gray-600">Google Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600">263+</div>
                  <div className="text-gray-600">Happy Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600">1000+</div>
                  <div className="text-gray-600">Customers Served</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Visit Our Store</h4>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Memories - Photo Frames & Customized Gift Shop</div>
                    <div>19B Kani Illam, Keeranatham Road</div>
                    <div>Near Ruby School, Saravanampatti</div>
                    <div>Coimbatore, Tamil Nadu 641035</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-rose-500" />
                  <span className="font-semibold">+91 81480 40148</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-rose-500" />
                  <span>Mon-Sat: 9:30 AM - 9:00 PM • Sunday: Closed</span>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={() => window.open('https://maps.google.com/?q=19B+Kani+Illam+Keeranatham+Road+Coimbatore', '_blank')}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => window.open('https://wa.me/918148040148?text=Hi! I want to visit your store', '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp for Store Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Product Grid with More Categories
const ProductGrid = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  
  const categories = [
    { name: 'All', icon: <Gift className="w-4 h-4" /> },
    { name: 'Frames', icon: <Camera className="w-4 h-4" /> },
    { name: 'Mugs', icon: <Heart className="w-4 h-4" /> },
    { name: 'T-Shirts', icon: <Shirt className="w-4 h-4" /> },
    { name: 'Acrylic', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Corporate', icon: <Package className="w-4 h-4" /> }
  ];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory.toLowerCase());

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    toast.success(`${product.name} added to cart!`);
  };

  const enhancedProducts = [
    ...products,
    {
      id: 'tshirt-1',
      name: 'Custom Printed T-Shirt',
      description: 'Premium quality cotton t-shirts with sublimation printing',
      category: 't-shirts',
      base_price: 299,
      sizes: [
        { name: 'S', price_add: 0 },
        { name: 'M', price_add: 0 },
        { name: 'L', price_add: 50 },
        { name: 'XL', price_add: 100 }
      ],
      materials: [
        { name: 'Cotton', price_add: 0 },
        { name: 'Cotton Blend', price_add: 50 }
      ],
      colors: [
        { name: 'White', price_add: 0 },
        { name: 'Black', price_add: 0 },
        { name: 'Navy', price_add: 0 }
      ],
      image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&h=300'
    },
    {
      id: 'corporate-1',
      name: 'Corporate Gift Set',
      description: 'Professional corporate gifting solutions with custom branding',
      category: 'corporate',
      base_price: 999,
      sizes: [
        { name: 'Standard Pack', price_add: 0 },
        { name: 'Premium Pack', price_add: 500 }
      ],
      materials: [
        { name: 'Basic Package', price_add: 0 },
        { name: 'Deluxe Package', price_add: 300 }
      ],
      colors: [
        { name: 'Corporate Blue', price_add: 0 },
        { name: 'Professional Black', price_add: 0 }
      ],
      image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&h=300'
    }
  ];

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-rose-100 text-rose-800 mb-4">
            <Hammer className="w-3 h-3 mr-1" />
            Handcrafted Excellence
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our 
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Product </span>
            Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From premium photo frames to custom t-shirts and corporate gifts - we create personalized memories that last a lifetime
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button 
              key={category.name}
              variant={selectedCategory === category.name ? 'default' : 'outline'} 
              className={selectedCategory === category.name 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg' 
                : 'border-rose-200 text-rose-700 hover:bg-rose-50'
              }
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {enhancedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 border-rose-100 hover:border-rose-200 overflow-hidden transform hover:scale-105">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image_url}
                  alt={`${product.name} - Premium quality custom ${product.category}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Badge className="absolute top-3 right-3 bg-rose-500 text-white shadow-lg">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  4.9
                </Badge>
                <Badge className="absolute top-3 left-3 bg-green-500 text-white shadow-lg animate-pulse">
                  Available Now
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{product.base_price}
                    <span className="text-sm font-normal text-gray-500 ml-1">onwards</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {product.sizes?.length || 2} options
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="border-rose-200 text-rose-700 hover:bg-rose-50 text-xs"
                      onClick={() => document.getElementById('customizer').scrollIntoView({behavior: 'smooth'})}
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      Customize
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-green-200 text-green-700 hover:bg-green-50 text-xs"
                      onClick={() => window.open('tel:+918148040148', '_blank')}
                    >
                      <PhoneCall className="w-3 h-3 mr-1" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bulk Order CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-50 via-blue-50 to-rose-50 rounded-3xl p-8 border border-purple-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Need Bulk Orders or Corporate Gifts?</h3>
          <p className="text-gray-600 mb-6 text-lg">Special pricing for bulk orders, corporate events, wedding favors & more!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
              onClick={() => window.open('https://wa.me/918148040148?text=Hi! I need a bulk order quote', '_blank')}
            >
              <Package className="w-5 h-5 mr-2" />
              Get Bulk Quote
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg"
              onClick={() => window.open('tel:+918148040148', '_blank')}
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              Call for Details
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Photo Customizer
const PhotoCustomizer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('wooden');
  const [selectedSize, setSelectedSize] = useState('8x10');

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
    led: { name: 'LED Backlit Frame', color: '#FFD700', price: 500 }
  };

  const sizes = {
    '8x10': { name: '8" × 10"', price: 899 },
    '12x16': { name: '12" × 16"', price: 1199 },
    '16x20': { name: '16" × 20"', price: 1599 },
    '20x24': { name: '20" × 24"', price: 1999 }
  };

  const calculatePrice = () => {
    const basePrice = sizes[selectedSize].price;
    const framePrice = frameStyles[selectedFrame].price;
    return basePrice + framePrice;
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
            
            {selectedImage && (
              <Card className="border border-rose-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Image Analysis Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Dimensions:</span>
                      <span className="font-bold">{selectedImage.dimensions.width} × {selectedImage.dimensions.height}px</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Print Quality:</span>
                      <Badge variant={selectedImage.quality_warning ? "destructive" : "secondary"}>
                        {selectedImage.quality_warning ? "⚠️ Low Resolution" : "✅ Excellent Quality"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Recommended:</span>
                      <span className="text-green-600 font-semibold">
                        {selectedImage.quality_warning ? "8×10 or smaller sizes" : "All sizes perfect!"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
                        className="w-80 h-80 rounded-lg p-6 shadow-2xl"
                        style={{ 
                          backgroundColor: frameStyles[selectedFrame].color,
                          border: selectedFrame === 'led' ? '4px solid #FFD700' : 'none'
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
                            className={selectedFrame === key ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'border-rose-200 hover:bg-rose-50'}
                            onClick={() => setSelectedFrame(key)}
                          >
                            <div 
                              className="w-4 h-4 rounded mr-2 border"
                              style={{ backgroundColor: style.color }}
                            ></div>
                            <span className="text-xs">{style.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Size & Pricing</label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="border-rose-200 focus:border-rose-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(sizes).map(([key, size]) => (
                            <SelectItem key={key} value={key}>
                              {size.name} - ₹{size.price + frameStyles[selectedFrame].price}
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
                        Includes: {frameStyles[selectedFrame].name} + {sizes[selectedSize].name} + Free Gift Wrap
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart - ₹{calculatePrice()}
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="border-rose-200 text-rose-700 hover:bg-rose-50 py-3"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save Design
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 py-3"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Share Preview
                        </Button>
                      </div>
                      
                      <div className="text-center pt-3">
                        <Button 
                          variant="ghost" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => window.open('tel:+918148040148', '_blank')}
                        >
                          <PhoneCall className="w-4 h-4 mr-2" />
                          Need Help? Call +91 81480 40148
                        </Button>
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

// Enhanced AI Gift Finder
const AIGiftFinder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: 'occasion',
      question: 'What\'s the special occasion?',
      options: [
        { value: 'birthday', label: 'Birthday 🎂', icon: <Gift className="w-5 h-5" /> },
        { value: 'anniversary', label: 'Anniversary 💕', icon: <Heart className="w-5 h-5" /> },
        { value: 'graduation', label: 'Graduation 🎓', icon: <Award className="w-5 h-5" /> },
        { value: 'wedding', label: 'Wedding 💒', icon: <Users className="w-5 h-5" /> },
        { value: 'corporate', label: 'Corporate Event 💼', icon: <Package className="w-5 h-5" /> },
        { value: 'just_because', label: 'Just Because 😊', icon: <Sparkles className="w-5 h-5" /> }
      ]
    },
    {
      id: 'recipient',
      question: 'Who is this gift for?',
      options: [
        { value: 'family', label: 'Family Member 👨‍👩‍👧‍👦', icon: <Users className="w-5 h-5" /> },
        { value: 'friend', label: 'Close Friend 👫', icon: <Heart className="w-5 h-5" /> },
        { value: 'colleague', label: 'Colleague 🤝', icon: <Package className="w-5 h-5" /> },
        { value: 'romantic', label: 'Romantic Partner 💑', icon: <Heart className="w-5 h-5" /> },
        { value: 'child', label: 'Child 👶', icon: <Star className="w-5 h-5" /> }
      ]
    },
    {
      id: 'budget',
      question: 'What\'s your budget range?',
      options: [
        { value: 'under_500', label: 'Under ₹500 💰', icon: <Percent className="w-5 h-5" /> },
        { value: '500_1000', label: '₹500 - ₹1000 💳', icon: <Target className="w-5 h-5" /> },
        { value: '1000_2000', label: '₹1000 - ₹2000 🏆', icon: <Award className="w-5 h-5" /> },
        { value: 'above_2000', label: 'Above ₹2000 💎', icon: <Star className="w-5 h-5" /> }
      ]
    },
    {
      id: 'style',
      question: 'What style do they prefer?',
      options: [
        { value: 'classic', label: 'Classic & Traditional 🏛️', icon: <Camera className="w-5 h-5" /> },
        { value: 'modern', label: 'Modern & Trendy ✨', icon: <Zap className="w-5 h-5" /> },
        { value: 'cute', label: 'Cute & Fun 🎨', icon: <Palette className="w-5 h-5" /> },
        { value: 'elegant', label: 'Elegant & Premium 👑', icon: <Star className="w-5 h-5" /> }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateSuggestions(newAnswers);
    }
  };

  const generateSuggestions = async (userAnswers) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/ai-gift-suggestions`, {
        answers: userAnswers
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      // Fallback suggestions
      setSuggestions([
        {
          product: {
            name: 'Custom Photo Frame',
            description: 'Perfect personalized gift with their favorite memory',
            base_price: 899,
            image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=300'
          },
          reasoning: 'Based on your preferences, a personalized photo frame captures memories beautifully and fits your style.',
          confidence: 95
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setSuggestions([]);
  };

  return (
    <>
      {/* AI Gift Finder Section */}
      <section id="ai-finder" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-800 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Recommendations
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Gift Finder
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not sure what to gift? Our AI will analyze preferences and suggest the perfect personalized gift from our collection.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-purple-200 shadow-xl">
              <CardContent className="p-8">
                {!isOpen && suggestions.length === 0 && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Find the Perfect Gift</h3>
                      <p className="text-gray-600 mb-6">
                        Answer a few quick questions and let our AI recommend personalized gifts tailored to your recipient.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsOpen(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Start AI Gift Finder
                    </Button>
                  </div>
                )}

                {isOpen && suggestions.length === 0 && (
                  <div className="space-y-8">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Question {currentStep + 1} of {questions.length}</span>
                        <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {!isLoading && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 text-center">
                          {questions[currentStep]?.question}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {questions[currentStep]?.options.map((option) => (
                            <Button
                              key={option.value}
                              variant="outline"
                              className="h-auto p-4 text-left border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
                              onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                {option.icon}
                                <span className="flex-1">{option.label}</span>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isLoading && (
                      <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-gray-600">AI is analyzing your preferences...</p>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Perfect Matches Found! 🎯</h3>
                      <p className="text-gray-600">Based on your answers, here are our AI recommendations:</p>
                    </div>

                    <div className="space-y-6">
                      {suggestions.map((suggestion, index) => (
                        <Card key={index} className="border-green-200 bg-green-50/50">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <img 
                                src={suggestion.product.image_url}
                                alt={suggestion.product.name}
                                className="w-full md:w-32 h-32 object-cover rounded-lg"
                              />
                              
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900">{suggestion.product.name}</h4>
                                    <p className="text-gray-600">{suggestion.product.description}</p>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800">
                                    {suggestion.confidence}% Match
                                  </Badge>
                                </div>
                                
                                <div className="bg-white p-3 rounded-lg border border-green-200">
                                  <p className="text-sm text-gray-700">
                                    <strong>Why this gift? </strong>{suggestion.reasoning}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-bold text-gray-900">₹{suggestion.product.base_price}</div>
                                  <div className="space-x-3">
                                    <Button 
                                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                      onClick={() => document.getElementById('customizer').scrollIntoView({behavior: 'smooth'})}
                                    >
                                      <Palette className="w-4 h-4 mr-2" />
                                      Customize This
                                    </Button>
                                    <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                                      <ShoppingCart className="w-4 h-4 mr-2" />
                                      Add to Cart
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="text-center space-y-4">
                      <Button 
                        onClick={resetQuiz}
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Find Another Gift
                      </Button>
                      
                      <p className="text-sm text-gray-600">
                        Need more help? 
                        <Button 
                          variant="ghost" 
                          className="text-green-600 hover:text-green-700 ml-1 p-0"
                          onClick={() => window.open('https://wa.me/918148040148?text=Hi! I need help choosing the perfect gift', '_blank')}
                        >
                          Chat with our gift experts →
                        </Button>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gift Finder Dialog for Mobile */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          {/* Mobile-optimized version of the gift finder would go here */}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Enhanced Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Smart Photo Upload',
      description: 'AI-powered quality analysis ensures perfect prints every time',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Live 3D Preview',
      description: 'See exactly how your frame will look before ordering',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Custom Designs',
      description: 'Unlimited customization options for truly personal gifts',
      color: 'from-rose-500 to-orange-500'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Premium Quality',
      description: 'Sublimation printing with high-grade materials',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Delivery',
      description: 'Free home delivery across Coimbatore',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Guarantee',
      description: '100% satisfaction guaranteed or money back',
      color: 'from-amber-500 to-yellow-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4">
            <Star className="w-3 h-3 mr-1" />
            Why Choose Memories
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Features for 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect </span>
            Memories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our state-of-the-art technology and premium craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-gray-300 overflow-hidden transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-rose-600 mb-2">4.9★</div>
              <div className="text-gray-600">Google Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-600 mb-2">1000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-600 mb-2">263+</div>
              <div className="text-gray-600">Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-600 mb-2">5 Years</div>
              <div className="text-gray-600">Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Customer Testimonials Section
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

        {/* Google Reviews CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google"
                className="w-8 h-8"
              />
              <div className="text-2xl font-bold text-gray-900">4.9★ on Google Reviews</div>
            </div>
            <p className="text-gray-600 mb-6">Join 263+ happy customers who rated us 5 stars!</p>
            <div className="space-x-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open('https://g.page/r/memories-photo-frames', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read All Reviews
              </Button>
              <Button 
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => window.open('https://g.page/r/memories-photo-frames/review', '_blank')}
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

// Enhanced Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <AnimatedLogo size="w-12 h-12" />
              <div>
                <div className="text-xl font-bold text-white">Memories</div>
                <div className="text-sm text-gray-400">Photo Frames & Gifts</div>
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
              <a href="#shop" className="block text-gray-300 hover:text-white transition-colors">Shop Products</a>
              <a href="#customizer" className="block text-gray-300 hover:text-white transition-colors">Photo Customizer</a>
              <a href="#ai-finder" className="block text-gray-300 hover:text-white transition-colors">AI Gift Finder</a>
              <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About Us</a>
              <Button 
                variant="ghost" 
                className="p-0 text-gray-300 hover:text-white h-auto"
                onClick={() => window.open('tel:+918148040148', '_blank')}
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
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="font-medium text-white">Call Us</div>
                  <a href="tel:+918148040148" className="text-gray-300 hover:text-white transition-colors">
                    +91 81480 40148
                  </a>
                </div>
              </div>
              
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
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Bulk Orders</span>
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

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error("Unable to load products - but you can still browse and call us!");
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
          <AnimatedLogo size="w-24 h-24" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Memories...</h2>
            <p className="text-gray-600">Your photo frame shop is loading</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead />
      <Header />
      <HeroSection />
      <AboutUsSection />
      <ProductGrid products={products} />
      <PhotoCustomizer />
      <AIGiftFinder />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
      <WhatsAppFloat />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;