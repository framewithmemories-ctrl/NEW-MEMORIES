import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
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

// Fixed Search Component
export const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      // Mock search - you can implement actual search API
      const mockResults = [
        { id: 1, name: 'Custom Photo Frame', category: 'frames', price: 899 },
        { id: 2, name: 'Personalized Mug', category: 'mugs', price: 349 },
        { id: 3, name: 'Custom T-Shirt', category: 't-shirts', price: 299 }
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      toast.success(`Found ${mockResults.length} results for "${query}"`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
        <Search className="w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search frames, mugs, t-shirts..." 
          className="bg-transparent border-none outline-none text-sm w-48"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {searchResults.map((result) => (
            <div key={result.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{result.name}</div>
                  <div className="text-sm text-gray-500">{result.category}</div>
                </div>
                <div className="text-lg font-bold text-rose-600">₹{result.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Photo Customizer with Matt Black and Design Frames
export const EnhancedPhotoCustomizer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('wooden');
  const [selectedSize, setSelectedSize] = useState('8x10');
  const [borderThickness, setBorderThickness] = useState('1');

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
    design: { name: 'Designer Frame', color: '#8B4513', price: 400 }
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

  const addToCart = () => {
    const product = {
      name: `Custom Photo Frame - ${frameStyles[selectedFrame].name}`,
      size: sizes[selectedSize].name,
      borderThickness: `${borderThickness}" border`,
      price: calculatePrice(),
      image: selectedImage
    };
    
    toast.success(`Added to cart! ₹${calculatePrice()}`);
    console.log('Added to cart:', product);
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
                          padding: `${borderThickness * 4}px`
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
                        onClick={addToCart}
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