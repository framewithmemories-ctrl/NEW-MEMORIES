import React, { useState, useEffect } from "react";
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
  Zap
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">About</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search products..." 
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
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 overflow-hidden">
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Handcrafted in Coimbatore
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform 
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Moments </span>
                into Timeless 
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"> Treasures</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Create personalized photo frames and custom gifts that preserve your most cherished memories. 
                Upload your photos and watch them come to life in premium frames, crafted with love.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl">
                <Upload className="w-5 h-5 mr-2" />
                Start Customizing
              </Button>
              
              <Button size="lg" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 font-semibold px-8 py-4 rounded-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Gift Finder
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">2000+ Happy Customers</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9/5 Rating</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=300" 
                  alt="Elegant gallery wall"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
                <img 
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&h=200" 
                  alt="Gift boxes"
                  className="w-full h-32 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f?auto=format&fit=crop&w=400&h=200" 
                  alt="Framed portrait"
                  className="w-full h-32 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
                <img 
                  src="https://images.unsplash.com/photo-1465161191540-aac346fcbaff?auto=format&fit=crop&w=400&h=300" 
                  alt="Colorful frames"
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

// Product Grid Component
const ProductGrid = ({ products }) => {
  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Handcrafted with 
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Love</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our premium collection of photo frames and custom gifts, each piece carefully crafted to preserve your precious memories.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['All', 'Frames', 'Mugs', 'LED', 'Acrylic'].map((category) => (
            <Button 
              key={category}
              variant={category === 'All' ? 'default' : 'outline'} 
              className={category === 'All' ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-amber-100 hover:border-amber-200 overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Badge className="absolute top-3 right-3 bg-amber-500">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  4.8
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
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {product.sizes.length} sizes
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                    <Palette className="w-4 h-4 mr-2" />
                    Customize Now
                  </Button>
                  <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Photo Customizer
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your favorite photo and see it transformed into a beautiful custom frame with live preview
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
                      Choose JPG, PNG, or HEIC files up to 25MB. For best results, use high-resolution images.
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
                  <CardTitle>Image Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span>{selectedImage.dimensions.width} × {selectedImage.dimensions.height}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality:</span>
                      <Badge variant={selectedImage.quality_warning ? "destructive" : "secondary"}>
                        {selectedImage.quality_warning ? "Low Resolution" : "Good Quality"}
                      </Badge>
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
                          alt="Preview"
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
                          <SelectItem value="wooden">Classic Wooden</SelectItem>
                          <SelectItem value="acrylic">Modern Acrylic</SelectItem>
                          <SelectItem value="metal">Sleek Metal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Size</label>
                      <Select defaultValue="8x10">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8x10">8" × 10" - ₹899</SelectItem>
                          <SelectItem value="12x16">12" × 16" - ₹1,099</SelectItem>
                          <SelectItem value="16x20">16" × 20" - ₹1,299</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart - ₹899
                    </Button>
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
      options: ["Mom", "Dad", "Partner", "Friend", "Colleague", "Child", "Other"]
    },
    {
      question: "What's the occasion?",
      field: "occasion", 
      options: ["Birthday", "Anniversary", "Wedding", "Graduation", "Valentine's Day", "Christmas", "Just Because"]
    },
    {
      question: "What's their age group?",
      field: "age_group",
      options: ["Child (0-12)", "Teen (13-19)", "Young Adult (20-30)", "Adult (31-50)", "Senior (50+)"]
    },
    {
      question: "What's your budget?",
      field: "budget",
      options: ["Under ₹500", "₹500-1000", "₹1000-2000", "₹2000-5000", "Above ₹5000"]
    },
    {
      question: "What's your relationship?",
      field: "relationship",
      options: ["Family", "Close Friend", "Romantic Partner", "Colleague", "Acquaintance"]
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
    } catch (error) {
      setSuggestions("I'd recommend a beautiful photo frame or personalized mug based on your preferences. Our team is here to help you create something special!");
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
            AI Powered
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Gift Finder
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Let our AI help you find the perfect personalized gift in just a few questions
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            {suggestions ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect Gift Suggestions</h3>
                  <div className="text-left bg-gray-50 rounded-lg p-6 whitespace-pre-line">
                    {suggestions}
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetQuiz} variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Start Shopping
                  </Button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg text-gray-600">AI is finding perfect gifts for you...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <div className="flex space-x-1">
                    {questions.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-2 h-2 rounded-full ${
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
                        className="h-12 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
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
                    className="w-full"
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

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Easy Upload",
      description: "Upload photos in seconds with automatic quality check and optimization"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Live Preview",
      description: "See exactly how your frame will look before ordering with our 3D preview"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality", 
      description: "Handcrafted frames using the finest materials with lifetime quality guarantee"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Same-day pickup in Coimbatore or express delivery across India"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose 
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> PhotoGiftHub?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with traditional craftsmanship to create personalized gifts that last a lifetime
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-amber-100 hover:border-amber-200 hover:shadow-lg transition-all">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component
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
              Preserving your precious memories with handcrafted photo frames and personalized gifts.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                <Heart className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#shop" className="hover:text-white transition-colors">Shop</a></li>
              <li><a href="#customizer" className="hover:text-white transition-colors">Customize</a></li>
              <li><a href="#ai-finder" className="hover:text-white transition-colors">Gift Finder</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>Coimbatore, Tamil Nadu</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>hello@photogifthub.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 PhotoGiftHub. All rights reserved. Made with ❤️ in Coimbatore.</p>
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
        toast.error("Failed to load products");
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProductGrid products={products} />
      <PhotoCustomizer />
      <AIGiftFinder />
      <Footer />
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