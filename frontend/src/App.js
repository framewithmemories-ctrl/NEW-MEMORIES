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
  PhoneCall
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// SEO Component
const SEOHead = () => (
  <Helmet>
    <title>PhotoGiftHub - Premium Custom Photo Frames & Personalized Gifts | Coimbatore</title>
    <meta name="description" content="Create beautiful custom photo frames and personalized gifts in Coimbatore. Professional quality frames with same-day pickup. AI-powered gift finder helps you choose perfect memories." />
    <meta name="keywords" content="photo frames Coimbatore, custom gifts, personalized frames, photo printing, gift shop Coimbatore, custom mugs, LED frames, acrylic frames, wooden frames" />
    <meta property="og:title" content="PhotoGiftHub - Premium Custom Photo Frames & Gifts" />
    <meta property="og:description" content="Transform your precious memories into beautiful custom frames. Professional quality, same-day pickup in Coimbatore." />
    <meta property="og:image" content="https://images.unsplash.com/photo-1513519245088-0e12902e5a38" />
    <meta property="og:url" content="https://photogifthub.preview.emergentagent.com" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://photogifthub.preview.emergentagent.com" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "PhotoGiftHub",
        "description": "Premium custom photo frames and personalized gifts",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "RS Puram",
          "addressLocality": "Coimbatore",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641002",
          "addressCountry": "IN"
        },
        "telephone": "+91 98765 43210",
        "email": "hello@photogifthub.com",
        "url": "https://photogifthub.preview.emergentagent.com",
        "openingHours": "Mo-Sa 09:00-20:00",
        "priceRange": "₹₹",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "320"
        }
      })}
    </script>
  </Helmet>
);

// WhatsApp Float Button
const WhatsAppFloat = () => (
  <div className="fixed bottom-6 right-6 z-50">
    <Button 
      className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
      onClick={() => window.open('https://wa.me/919876543210?text=Hi! I need help with custom photo frames', '_blank')}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </Button>
  </div>
);

// Header Component Enhanced
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-amber-50">
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Mon-Sat 9AM-8PM</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Truck className="w-3 h-3 mr-1" />
              Same Day Pickup
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              Quality Guarantee
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                PhotoGiftHub
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#shop" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Shop</a>
              <a href="#customizer" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Customize</a>
              <a href="#ai-finder" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Gift Finder</a>
              <a href="#testimonials" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Reviews</a>
              <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">About</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search frames, mugs..." 
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
            
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hidden sm:flex">
              <Gift className="w-3 h-3 mr-1" />
              Free Gift Wrap
            </Badge>
            
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-amber-500">
                0
              </Badge>
            </Button>
            
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
          <div className="md:hidden py-4 border-t border-amber-100">
            <nav className="flex flex-col space-y-2">
              <a href="#shop" className="text-gray-700 hover:text-amber-600 font-medium py-2">Shop</a>
              <a href="#customizer" className="text-gray-700 hover:text-amber-600 font-medium py-2">Customize</a>
              <a href="#ai-finder" className="text-gray-700 hover:text-amber-600 font-medium py-2">Gift Finder</a>
              <a href="#testimonials" className="text-gray-700 hover:text-amber-600 font-medium py-2">Reviews</a>
              <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium py-2">About</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Enhanced Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 overflow-hidden">
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Urgent Offer Banner */}
      <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm font-medium">
          <Percent className="w-4 h-4" />
          <span>Limited Time: 30% OFF + Free Gift Wrap | Ends in 2 Days!</span>
          <Target className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Handcrafted in Coimbatore Since 2020
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your 
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Precious </span>
                Memories into 
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"> Forever </span>
                Treasures
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Create stunning personalized photo frames and custom gifts that preserve your most cherished memories. 
                Professional quality with same-day pickup in Coimbatore. Over 2000+ happy customers trust us!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Upload className="w-5 h-5 mr-2" />
                Start Creating Now
              </Button>
              
              <Button size="lg" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 font-semibold px-8 py-4 rounded-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Gift Finder
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <img 
                      key={i} 
                      src={`https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=40&h=40&crop=face&facepad=2`}
                      alt="Happy customer"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">2000+ Happy Customers</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-gray-600 ml-1 font-medium">4.9/5 Rating (320 Reviews)</span>
              </div>
              
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Same Day Pickup</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 transform rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=300" 
                  alt="Professional gallery wall with custom frames"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
                <img 
                  src="https://images.unsplash.com/photo-1628313388777-9b9a751dfc6a?auto=format&fit=crop&w=400&h=200" 
                  alt="Happy satisfied customers"
                  className="w-full h-32 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1626252685663-64c6bf60afb1?auto=format&fit=crop&w=400&h=200" 
                  alt="Artisan craftsmanship in frame making"
                  className="w-full h-32 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
                <img 
                  src="https://images.unsplash.com/photo-1465161191540-aac346fcbaff?auto=format&fit=crop&w=400&h=300" 
                  alt="Beautiful handcrafted wooden frames"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
            </div>
            
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Social Proof & Urgency Section
const SocialProofSection = () => {
  const [recentOrders, setRecentOrders] = useState([
    { customer: "Priya S.", item: "Wedding Frame", location: "RS Puram", time: "2 mins ago" },
    { customer: "Ravi K.", item: "Baby Photo Collage", location: "Gandhipuram", time: "5 mins ago" },
    { customer: "Meera R.", item: "Anniversary Gift Set", location: "Peelamedu", time: "8 mins ago" }
  ]);

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Live Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-green-700">{order.customer}</span>
                      <span className="text-green-600"> ordered {order.item}</span>
                    </div>
                    <span className="text-xs text-green-500">{order.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">Orders Delivered</span>
                  <span className="font-bold text-blue-800">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">Happy Customers</span>
                  <span className="font-bold text-blue-800">186</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">5★ Reviews</span>
                  <span className="font-bold text-blue-800">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgency */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-800 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Order Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-orange-700">
                  <div className="text-sm">Same-day pickup available</div>
                  <div className="text-xs text-orange-600">Order before 4 PM</div>
                </div>
                <div className="text-orange-700">
                  <div className="text-sm">Express delivery slots</div>
                  <div className="text-xs text-orange-600">Only 3 slots left today</div>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Limited Stock Alert
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Customer Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Lakshmi Priya",
      location: "RS Puram, Coimbatore",
      rating: 5,
      text: "Absolutely stunning quality! They transformed our wedding photos into beautiful frames. The attention to detail is incredible. Will definitely recommend to everyone!",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=100&h=100&crop=face",
      product: "Wedding Photo Collage"
    },
    {
      name: "Rajesh Kumar",
      location: "Gandhipuram, Coimbatore", 
      rating: 5,
      text: "The AI gift finder suggested the perfect frame for my mother's birthday. She loved it! The same-day pickup was so convenient. Great service!",
      image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=100&h=100&crop=face",
      product: "Classic Wooden Frame"
    },
    {
      name: "Divya Menon",
      location: "Peelamedu, Coimbatore",
      rating: 5,
      text: "Amazing craftsmanship! The LED frame with our family photo looks gorgeous in our living room. Everyone who visits asks where we got it made. Top quality work!",
      image: "https://images.unsplash.com/photo-1579047917338-a6a69144fe63?auto=format&fit=crop&w=100&h=100&crop=face",
      product: "LED Photo Frame"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-4">
            <ThumbsUp className="w-3 h-3 mr-1" />
            Customer Love
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our 
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Happy Customers </span>
            Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Over 2000+ customers trust PhotoGiftHub for their precious memories. Here's what they love about our service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-amber-100 hover:border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <Badge variant="secondary" className="ml-2 text-xs bg-amber-100 text-amber-800">
                    {testimonial.product}
                  </Badge>
                </div>
                
                <div className="relative">
                  <Quote className="w-6 h-6 text-amber-300 absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic pl-4">"{testimonial.text}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
            Read All 320+ Reviews
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Enhanced Product Grid Component with Professional Images
const ProductGrid = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Frames', 'Mugs', 'LED', 'Acrylic'];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory.toLowerCase());

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-amber-100 text-amber-800 mb-4">
            <Hammer className="w-3 h-3 mr-1" />
            Handcrafted Excellence
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Quality 
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Photo Frames </span>
            & Custom Gifts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each piece is carefully handcrafted by skilled artisans in Coimbatore using premium materials. 
            Your memories deserve nothing but the best.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button 
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'} 
              className={selectedCategory === category 
                ? 'bg-amber-500 hover:bg-amber-600' 
                : 'border-amber-200 text-amber-700 hover:bg-amber-50'
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-amber-100 hover:border-amber-200 overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image_url}
                  alt={`${product.name} - Premium quality custom photo frames`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Badge className="absolute top-3 right-3 bg-amber-500">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  4.8
                </Badge>
                <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                  Same Day
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
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
                    {product.sizes.length} sizes
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                    <Palette className="w-4 h-4 mr-2" />
                    Customize Now
                  </Button>
                  <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50">
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Quick Order: Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bulk Order CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Bulk Orders?</h3>
          <p className="text-gray-600 mb-6">Corporate gifts, wedding favors, or event giveaways - we've got you covered with special pricing!</p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
            <Package className="w-4 h-4 mr-2" />
            Get Bulk Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

// Rest of the components remain the same (PhotoCustomizer, AIGiftFinder, FeaturesSection)
// Photo Customizer Component
const PhotoCustomizer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="customizer" className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 text-purple-800 mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Live Preview
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Photo Customizer
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your favorite photo and see it transformed into a beautiful custom frame with live preview. 
            Our AI checks photo quality to ensure perfect prints.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="border-2 border-dashed border-amber-200 bg-amber-50/50">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Photo</h3>
                    <p className="text-gray-600 mb-4">
                      Choose JPG, PNG, or HEIC files up to 25MB. For best results, use high-resolution images (min 1000x1000px).
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
                      <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                        <span className="cursor-pointer">
                          {isUploading ? 'Uploading...' : 'Choose Photo'}
                        </span>
                      </Button>
                    </label>
                  </div>
                  
                  {uploadStatus && (
                    <p className={`text-sm ${uploadStatus.includes('warning') || uploadStatus.includes('Low') ? 'text-amber-600' : 'text-green-600'}`}>
                      {uploadStatus}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {selectedImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Image Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium">{selectedImage.dimensions.width} × {selectedImage.dimensions.height}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Print Quality:</span>
                      <Badge variant={selectedImage.quality_warning ? "destructive" : "secondary"}>
                        {selectedImage.quality_warning ? "Low Resolution" : "Excellent Quality"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recommended Sizes:</span>
                      <span className="text-green-600 font-medium">
                        {selectedImage.quality_warning ? "8x10 or smaller" : "All sizes available"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your photo will look in different frames</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  {selectedImage ? (
                    <div className="relative">
                      <div className="w-64 h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-4 shadow-lg">
                        <img 
                          src={`data:image/jpeg;base64,${selectedImage.image_data}`}
                          alt="Your photo preview"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="absolute inset-0 border-8 border-amber-800 rounded-lg shadow-xl"></div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Upload a photo to see preview</p>
                    </div>
                  )}
                </div>
                
                {selectedImage && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Frame Style</label>
                      <Select defaultValue="wooden">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wooden">Classic Wooden Frame</SelectItem>
                          <SelectItem value="acrylic">Modern Acrylic Frame</SelectItem>
                          <SelectItem value="metal">Sleek Metal Frame</SelectItem>
                          <SelectItem value="led">LED Backlit Frame</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Size & Pricing</label>
                      <Select defaultValue="8x10">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8x10">8" × 10" - ₹899</SelectItem>
                          <SelectItem value="12x16">12" × 16" - ₹1,099</SelectItem>
                          <SelectItem value="16x20">16" × 20" - ₹1,299</SelectItem>
                          <SelectItem value="20x24">20" × 24" - ₹1,599</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                        <Heart className="w-4 h-4 mr-2" />
                        Save Design
                      </Button>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                    
                    <div className="text-center pt-2">
                      <Button variant="ghost" className="text-green-600 hover:text-green-700">
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Call for Express Order: +91 98765 43210
                      </Button>
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

// AI Gift Finder Component
const AIGiftFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState({
    recipient: '',
    occasion: '',
    age_group: '',
    interests: [],
    budget: '',
    relationship: ''
  });
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question: "Who is this gift for?",
      field: "recipient",
      options: ["Mom", "Dad", "Partner", "Friend", "Colleague", "Child", "Grandparent"]
    },
    {
      question: "What's the special occasion?",
      field: "occasion", 
      options: ["Birthday", "Anniversary", "Wedding", "Graduation", "Valentine's Day", "Christmas", "Housewarming"]
    },
    {
      question: "What's their age group?",
      field: "age_group",
      options: ["Child (0-12)", "Teen (13-19)", "Young Adult (20-30)", "Adult (31-50)", "Senior (50+)"]
    },
    {
      question: "What's your budget range?",
      field: "budget",
      options: ["Under ₹500", "₹500-1000", "₹1000-2000", "₹2000-5000", "Above ₹5000"]
    },
    {
      question: "What's your relationship?",
      field: "relationship",
      options: ["Family Member", "Close Friend", "Romantic Partner", "Colleague", "Acquaintance"]
    }
  ];

  const handleAnswer = (answer) => {
    const updatedData = { ...quizData, [questions[currentStep].field]: answer };
    setQuizData(updatedData);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      getAISuggestions(updatedData);
    }
  };

  const getAISuggestions = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/gift-suggestions`, data);
      setSuggestions(response.data.suggestions);
      toast.success("AI found perfect gift suggestions for you!");
    } catch (error) {
      setSuggestions("Based on your preferences, I'd recommend our premium photo frames or personalized mugs. Our team is ready to help you create something truly special! Call us at +91 98765 43210 for personalized assistance.");
      toast.error("AI service temporarily unavailable, but we have great suggestions!");
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setQuizData({
      recipient: '',
      occasion: '',
      age_group: '',
      interests: [],
      budget: '',
      relationship: ''
    });
    setSuggestions('');
  };

  return (
    <section id="ai-finder" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 text-purple-800 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered Technology
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Gift Finder
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Let our advanced AI help you discover the perfect personalized gift in just a few simple questions
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl border-purple-100">
          <CardContent className="p-8">
            {suggestions ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect Gift Recommendations</h3>
                  <div className="text-left bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 whitespace-pre-line border border-blue-200">
                    {suggestions}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={resetQuiz} variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Start Shopping
                  </Button>
                  <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Call Expert
                  </Button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg text-gray-600">Our AI is finding the perfect gifts for you...</p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <div className="flex space-x-1">
                    {questions.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index <= currentStep ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {questions[currentStep]?.question}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {questions[currentStep]?.options.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        onClick={() => handleAnswer(option)}
                        className="h-12 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {currentStep > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="w-full text-gray-600 hover:text-gray-800"
                  >
                    ← Previous Question
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// Enhanced Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Smart Upload",
      description: "Advanced AI checks photo quality automatically and suggests optimal frame sizes for perfect prints"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Live 3D Preview",
      description: "See exactly how your frame will look in your room with our realistic 3D preview technology"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Craftsmanship", 
      description: "Handcrafted by skilled artisans using finest materials with lifetime quality guarantee"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Same Day Service",
      description: "Order before 4 PM for same-day pickup in Coimbatore or express delivery across Tamil Nadu"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Promise",
      description: "100% satisfaction guarantee with free replacements if you're not completely happy"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Support",
      description: "Dedicated customer support team available via WhatsApp, phone, and in-store consultations"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4">
            <CheckCircle className="w-3 h-3 mr-1" />
            Why Choose Us
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experience the 
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> PhotoGiftHub </span>
            Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with traditional craftsmanship to create personalized gifts that preserve your memories for generations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-amber-100 hover:border-amber-200 hover:shadow-lg transition-all group">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-amber-600">2000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-amber-600">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-amber-600">24hrs</div>
            <div className="text-gray-600">Express Delivery</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-amber-600">5yrs</div>
            <div className="text-gray-600">In Business</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section for SEO
const FAQSection = () => {
  const faqs = [
    {
      question: "What types of photo frames do you offer?",
      answer: "We offer a wide variety of premium photo frames including wooden frames (oak, teak, mahogany), acrylic frames, metal frames, and LED backlit frames. All frames come in multiple sizes from 8x10 to 20x24 inches with various color options."
    },
    {
      question: "Can I get same-day pickup in Coimbatore?",
      answer: "Yes! We offer same-day pickup for orders placed before 4 PM. Our store is located in RS Puram, Coimbatore. We also provide express delivery across Tamil Nadu within 24-48 hours."
    },
    {
      question: "What image quality do you recommend for best results?",
      answer: "For best print quality, we recommend high-resolution images (minimum 1000x1000 pixels). Our AI quality checker automatically analyzes your photos and suggests optimal frame sizes. We also provide guidance on improving image quality."
    },
    {
      question: "Do you offer custom sizes and bulk orders?",
      answer: "Absolutely! We specialize in custom sizes and bulk orders for corporate gifts, wedding favors, and events. Contact us at +91 98765 43210 for special pricing on orders of 10+ frames."
    },
    {
      question: "What's included with my photo frame order?",
      answer: "Every order includes professional printing, premium frame materials, protective packaging, and free gift wrapping. We also provide wall mounting hardware and a quality guarantee certificate."
    },
    {
      question: "How does the AI Gift Finder work?",
      answer: "Our AI Gift Finder asks 5 simple questions about the recipient, occasion, and budget. Using advanced algorithms, it suggests personalized frame styles, sizes, and customization options that match your preferences perfectly."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4">
            <CheckCircle className="w-3 h-3 mr-1" />
            Got Questions?
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about PhotoGiftHub's custom photo frames and services
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-12">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open('https://wa.me/919876543210?text=Hi! I have a question about custom photo frames', '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => window.open('tel:+919876543210', '_blank')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call: +91 98765 43210
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Blog Section for SEO
const BlogSection = () => {
  const blogPosts = [
    {
      title: "10 Creative Ways to Display Family Photos in Your Home",
      excerpt: "Transform your living space with these innovative photo display ideas that go beyond traditional frames...",
      image: "https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f?auto=format&fit=crop&w=400&h=200",
      date: "January 20, 2025",
      readTime: "5 min read",
      category: "Home Decor"
    },
    {
      title: "The Ultimate Guide to Photo Frame Sizes and Placement",
      excerpt: "Learn the perfect dimensions and positioning techniques for creating stunning gallery walls that impress...",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=200",
      date: "January 18, 2025",
      readTime: "8 min read",
      category: "Photography Tips"
    },
    {
      title: "Wedding Photo Ideas: Capturing Memories That Last Forever",
      excerpt: "Discover the most romantic and creative wedding photography ideas for frames that tell your love story...",
      image: "https://images.unsplash.com/photo-1465161191540-aac346fcbaff?auto=format&fit=crop&w=400&h=200",
      date: "January 15, 2025",
      readTime: "6 min read",
      category: "Wedding"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-4">
            <Camera className="w-3 h-3 mr-1" />
            Expert Tips & Ideas
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Photography & 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Framing </span>
            Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get inspired with our latest tips, trends, and creative ideas for displaying your precious memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-purple-100 hover:border-purple-200 overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-purple-500 text-white">
                  {post.category}
                </Badge>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            View All Articles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Enhanced Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PhotoGiftHub</span>
            </div>
            <p className="text-gray-400">
              Coimbatore's premier destination for custom photo frames and personalized gifts. 
              Preserving your precious memories since 2020.
            </p>
            <div className="flex space-x-4">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open('https://wa.me/919876543210', '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={() => window.open('tel:+919876543210', '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#shop" className="hover:text-white transition-colors">Shop Products</a></li>
              <li><a href="#customizer" className="hover:text-white transition-colors">Photo Customizer</a></li>
              <li><a href="#ai-finder" className="hover:text-white transition-colors">AI Gift Finder</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Customer Reviews</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bulk Orders</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Visit Our Store</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">PhotoGiftHub</div>
                  <div>123 RS Puram Main Road</div>
                  <div>Coimbatore, Tamil Nadu 641002</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>hello@photogifthub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4" />
                <span>Mon-Sat: 9 AM - 8 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left text-gray-400">
              <p>&copy; 2025 PhotoGiftHub. All rights reserved. Made with ❤️ in Coimbatore.</p>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
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
        toast.error("Failed to load products - but you can still browse our catalog!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-gray-600">Loading PhotoGiftHub...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
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
      <SocialProofSection />
      <FeaturesSection />
      <ProductGrid products={products} />
      <PhotoCustomizer />
      <AIGiftFinder />
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