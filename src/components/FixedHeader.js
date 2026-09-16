import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";
import { SearchComponent } from "./SearchComponent";
import { UserProfile } from "./UserProfile";
import { CheckoutPage } from "./CheckoutPage";
import { 
  ShoppingCart, 
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  Shield,
  Truck,
  Gift
} from "lucide-react";

// Business Logo Component
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

// Business Name Component
const BusinessName = () => {
  return (
    <img 
      src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/t3qf6xi2_NAME.png"
      alt="Memories - Frame with Love and Crafted with Care"
      className="h-8 object-contain"
    />
  );
};

// Smart Call Button Component
const SmartCallButton = ({ className = "", children, phoneNumber = "+918148040148" }) => {
  const handleCall = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.open(`tel:${phoneNumber}`, '_blank');
    } else {
      window.open(`https://wa.me/918148040148?text=Hi! I want to call about your services`, '_blank');
    }
  };

  return (
    <Button className={className} onClick={handleCall}>
      {children}
    </Button>
  );
};

// Fixed Cart Icon with Checkout
const CartIcon = () => {
  const { cartCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative group"
        onClick={() => setShowCheckout(true)}
      >
        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {cartCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rose-500 animate-pulse">
            {cartCount}
          </Badge>
        )}
      </Button>
      
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <CheckoutPage onClose={() => setShowCheckout(false)} />
        </div>
      )}
    </>
  );
};

// FIXED Header Component with Proper Alignment
export const FixedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const navItems = [
    { label: 'Home', path: '/', id: 'home' },
    { label: 'Shop', path: '/#shop', id: 'shop' },
    { label: 'Customize', path: '/#customizer', id: 'customizer' },
    { label: 'AI Finder', path: '/#ai-finder', id: 'ai-finder' },
    { label: 'About Us', path: '/about', id: 'about' },
    { label: 'Contact', path: '/#contact', id: 'contact' }
  ];

  const handleNavClick = (path, id) => {
    if (path.startsWith('/#')) {
      // Handle anchor links
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Handle regular navigation
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Contact Bar */}
        <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b border-rose-50">
          <div className="flex items-center space-x-6">
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
          </div>
          <div className="flex items-center space-x-3">
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
        
        {/* Main Header with FIXED Layout */}
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Left: Logo + Business Name (FIXED POSITION) */}
          <div 
            className="flex items-center space-x-3 cursor-pointer flex-shrink-0"
            onClick={handleLogoClick}
          >
            <BusinessLogo size="w-10 h-10 lg:w-12 lg:h-12" />
            <div className="hidden sm:block">
              <BusinessName />
            </div>
          </div>
          
          {/* Center: Navigation Menu (SINGLE ROW) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-1 justify-center">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="text-gray-700 hover:text-rose-600 hover:bg-rose-50 font-medium transition-all relative group px-3 py-2"
                onClick={() => handleNavClick(item.path, item.id)}
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-rose-600 transition-all group-hover:w-4/5"></span>
              </Button>
            ))}
          </nav>
          
          {/* Right: Actions (FIXED POSITION) */}
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Search - Hidden on Small Screens */}
            <div className="hidden md:block">
              <SearchComponent />
            </div>
            
            {/* Badges */}
            <Badge variant="secondary" className="bg-rose-100 text-rose-800 hidden lg:flex animate-pulse">
              <Gift className="w-3 h-3 mr-1" />
              Free Gift Wrap
            </Badge>
            
            {/* User Actions */}
            <UserProfile />
            <CartIcon />
            
            {/* Call Button */}
            <SmartCallButton className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hidden xl:flex">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </SmartCallButton>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu (HAMBURGER) */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-rose-100 bg-white/95 backdrop-blur-md">
            {/* Mobile Search */}
            <div className="mb-4 px-2">
              <SearchComponent />
            </div>
            
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-rose-600 hover:bg-rose-50 font-medium transition-all"
                  onClick={() => handleNavClick(item.path, item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            
            {/* Mobile Contact */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <SmartCallButton className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Call +91 81480 40148
              </SmartCallButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};