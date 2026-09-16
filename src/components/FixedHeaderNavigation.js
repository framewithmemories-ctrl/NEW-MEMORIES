import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";
import { SearchComponent } from "./SearchComponent";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Phone, 
  Home,
  Package,
  Palette,
  Sparkles
} from "lucide-react";

export const FixedHeaderNavigation = ({ 
  onNavigateHome, 
  onOpenProfile, 
  onOpenCart, 
  onScrollToSection,
  currentPage = 'home'
}) => {
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, action: onNavigateHome },
    { id: 'products', label: 'Shop', icon: Package, action: () => onScrollToSection('products') },
    { id: 'customizer', label: 'Customize', icon: Palette, action: () => onScrollToSection('customizer') },
    { id: 'gift-finder', label: 'Gift Finder', icon: Sparkles, action: () => onScrollToSection('gift-finder') },
    { id: 'about', label: 'About Us', icon: User, action: () => onScrollToSection('about') }
  ];

  const handleNavigation = (item) => {
    setIsMobileMenuOpen(false);
    item.action();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo + Brand Name - Top Left */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onNavigateHome}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">Memories</h1>
                <p className="text-xs text-rose-600 leading-tight">Photo Frames & Gifts</p>
              </div>
            </div>

            {/* Desktop Navigation - Single Line */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleNavigation(item)}
                  className={`flex items-center space-x-1 ${
                    currentPage === item.id ? 'text-rose-600 bg-rose-50' : 'text-gray-700 hover:text-rose-600'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Free Gift Wrap Badge */}
              <Badge 
                variant="secondary" 
                className="hidden sm:flex bg-green-100 text-green-800 text-xs"
              >
                🎁 Free Gift Wrap
              </Badge>

              {/* Search */}
              <div className="hidden md:block">
                <SearchComponent />
              </div>

              {/* User Profile */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group"
                onClick={() => {
                  // Load and execute the external profile modal script
                  if (!window.openProfileModal) {
                    const script = document.createElement('script');
                    script.src = '/profile-modal.js';
                    script.onload = () => {
                      window.openProfileModal();
                    };
                    document.head.appendChild(script);
                  } else {
                    window.openProfileModal();
                  }
                }}
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>

              {/* Shopping Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={onOpenCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-rose-500 hover:bg-rose-600"
                  >
                    <span className="text-xs text-white">{getTotalItems()}</span>
                  </Badge>
                )}
              </Button>

              {/* Call Now Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                onClick={() => window.open('tel:+918148040148', '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <SearchComponent />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-lg">
            <div className="container mx-auto px-4">
              
              {/* Mobile Header */}
              <div className="flex items-center justify-between h-16">
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateHome();
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">Memories</h1>
                    <p className="text-xs text-rose-600 leading-tight">Photo Frames & Gifts</p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Navigation Menu */}
              <nav className="py-4 space-y-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavigation(item)}
                    className={`w-full justify-start text-left ${
                      currentPage === item.id ? 'text-rose-600 bg-rose-50' : 'text-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Button>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 p-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Call us now</p>
                      <a 
                        href="tel:+918148040148" 
                        className="text-green-600 hover:text-green-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        +91 81480 40148
                      </a>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};