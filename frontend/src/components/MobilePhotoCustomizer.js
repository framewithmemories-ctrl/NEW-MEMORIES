import React, { useState, useRef, useCallback } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Crop,
  Palette,
  Download,
  Share2,
  Heart,
  ShoppingCart,
  X,
  Check,
  Loader2,
  ZoomIn,
  ZoomOut,
  Move,
  Square,
  Circle
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const MobilePhotoCustomizer = ({ productId, onAddToCart }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [frameStyle, setFrameStyle] = useState('wooden');
  const [frameSize, setFrameSize] = useState('medium');
  const [customText, setCustomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFrameOptions, setShowFrameOptions] = useState(false);
  const [mockupUrl, setMockupUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mobile-specific states
  const [isMobileUpload, setIsMobileUpload] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Frame options optimized for mobile selection
  const frameOptions = [
    { 
      id: 'wooden', 
      name: 'Wooden Frame', 
      price: 299, 
      color: '#8B4513',
      description: 'Classic wooden finish',
      popular: true
    },
    { 
      id: 'metallic', 
      name: 'Metallic Frame', 
      price: 399, 
      color: '#C0C0C0',
      description: 'Modern metallic look'
    },
    { 
      id: 'acrylic', 
      name: 'Acrylic Frame', 
      price: 499, 
      color: '#FFFFFF',
      description: 'Contemporary acrylic',
      premium: true
    },
    { 
      id: 'vintage', 
      name: 'Vintage Frame', 
      price: 349, 
      color: '#DAA520',
      description: 'Antique gold finish'
    }
  ];

  const sizeOptions = [
    { id: 'small', name: '8x10"', multiplier: 1.0, description: 'Perfect for desk' },
    { id: 'medium', name: '11x14"', multiplier: 1.3, description: 'Great for walls', popular: true },
    { id: 'large', name: '16x20"', multiplier: 1.8, description: 'Statement piece' },
    { id: 'xlarge', name: '20x24"', multiplier: 2.2, description: 'Premium large', premium: true }
  ];

  // Handle file selection with mobile optimization
  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    // Mobile-specific validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for mobile
      toast.error('File too large. Please select a photo under 10MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    setSelectedPhoto(file);
    
    // Create preview with mobile optimization
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
      setIsMobileUpload(true);
      
      // Auto-generate quick preview for mobile users
      setTimeout(() => {
        generateMobilePreview();
      }, 500);
    };
    reader.readAsDataURL(file);
  }, []);

  // Mobile-optimized file input trigger
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Generate quick mobile preview
  const generateMobilePreview = async () => {
    if (!selectedPhoto) return;

    try {
      setIsProcessing(true);
      
      // Simulate processing for mobile users
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would call the Cloudinary API
      // For now, we'll create a mock preview
      const mockPreview = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="${frameOptions.find(f => f.id === frameStyle)?.color || '#8B4513'}" rx="10"/>
          <rect x="20" y="20" width="260" height="260" fill="white"/>
          <rect x="30" y="30" width="240" height="240" fill="#f0f0f0"/>
          <text x="150" y="160" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">
            Your Photo Here
          </text>
          <text x="150" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">
            ${frameOptions.find(f => f.id === frameStyle)?.name || 'Wooden Frame'}
          </text>
        </svg>
      `)}`;
      
      setMockupUrl(mockPreview);
      toast.success('✨ Preview ready! Swipe to see different frames.');
      
    } catch (error) {
      console.error('Preview generation error:', error);
      toast.error('Failed to generate preview. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate total price with mobile-friendly display
  const calculatePrice = () => {
    const basePrice = frameOptions.find(f => f.id === frameStyle)?.price || 299;
    const sizeMultiplier = sizeOptions.find(s => s.id === frameSize)?.multiplier || 1.0;
    return Math.round(basePrice * sizeMultiplier);
  };

  // Handle add to cart with mobile feedback
  const handleAddToCart = async () => {
    if (!selectedPhoto) {
      toast.error('Please select a photo first');
      return;
    }

    try {
      setIsSaving(true);
      
      // Create cart item
      const cartItem = {
        id: `custom_frame_${Date.now()}`,
        name: `Custom ${frameOptions.find(f => f.id === frameStyle)?.name} - ${sizeOptions.find(s => s.id === frameSize)?.name}`,
        price: calculatePrice(),
        image: mockupUrl || photoPreview,
        customization: {
          frameStyle,
          frameSize,
          customText,
          hasPhoto: true
        },
        category: 'Custom Frames'
      };

      // Call parent's add to cart function
      if (onAddToCart) {
        await onAddToCart(cartItem);
      }

      // Mobile-specific success feedback
      toast.success('🛒 Added to cart! Ready to checkout?', {
        action: {
          label: 'View Cart',
          onClick: () => {
            // Trigger cart opening - this would be handled by parent component
            window.dispatchEvent(new CustomEvent('openCart'));
          }
        }
      });

      // Haptic feedback for supported devices
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Mobile drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="mobile-photo-customizer max-w-4xl mx-auto p-4 space-y-6">
      {/* Mobile Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📸 Create Your Custom Frame</h2>
        <p className="text-gray-600">Upload, customize, and order in just a few taps</p>
      </div>

      {/* Photo Upload Section - Mobile Optimized */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-rose-400 transition-colors">
        <CardContent className="p-6">
          {!photoPreview ? (
            <div 
              className={`photo-upload-area min-h-[200px] flex flex-col items-center justify-center space-y-4 ${dragActive ? 'bg-rose-50 border-rose-300' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Photo</h3>
                <p className="text-gray-600 mb-4">Take a new photo or choose from your gallery</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <Button 
                  onClick={triggerFileSelect}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Photo
                </Button>
                
                {/* Camera capture for mobile devices */}
                <Button 
                  onClick={() => {
                    // Create input with camera capture
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.capture = 'camera';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      if (e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    };
                    input.click();
                  }}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                JPG, PNG, or WEBP • Max 10MB • Best quality: 1080x1080px or higher
              </p>
            </div>
          ) : (
            /* Photo Preview with Mobile Controls */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Your Photo</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPhotoPreview(null);
                    setSelectedPhoto(null);
                    setMockupUrl(null);
                    setIsMobileUpload(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Selected photo" 
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white bg-opacity-90">
                    {selectedPhoto ? `${(selectedPhoto.size / (1024 * 1024)).toFixed(1)}MB` : ''}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Frame Selection - Mobile Optimized */}
      {photoPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Square className="w-5 h-5 text-rose-600" />
              <span>Choose Frame Style</span>
            </CardTitle>
            <CardDescription>Swipe to browse different frame options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {frameOptions.map((frame) => (
                <div 
                  key={frame.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    frameStyle === frame.id 
                      ? 'border-rose-500 bg-rose-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setFrameStyle(frame.id);
                    // Re-generate preview with new frame
                    setTimeout(generateMobilePreview, 100);
                  }}
                >
                  {frame.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs">
                      Popular
                    </Badge>
                  )}
                  {frame.premium && (
                    <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs">
                      Premium
                    </Badge>
                  )}
                  
                  <div 
                    className="w-full h-16 rounded mb-2"
                    style={{ backgroundColor: frame.color }}
                  ></div>
                  <h4 className="font-semibold text-sm text-gray-900">{frame.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{frame.description}</p>
                  <p className="text-sm font-bold text-rose-600">₹{frame.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Size Selection - Mobile Optimized */}
      {photoPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              <span>Select Size</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sizeOptions.map((size) => (
                <div 
                  key={size.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    frameSize === size.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFrameSize(size.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-gray-900">{size.name}</h4>
                      <p className="text-sm text-gray-600">{size.description}</p>
                    </div>
                    {size.popular && (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        Popular
                      </Badge>
                    )}
                    {size.premium && (
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{Math.round((frameOptions.find(f => f.id === frameStyle)?.price || 299) * size.multiplier)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Text - Mobile Optimized */}
      {photoPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-green-600" />
              <span>Add Custom Text (Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g. 'Family Memories 2024' or 'Mom & Dad'"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="text-center"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              {customText.length}/50 characters • Will appear at the bottom of your frame
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preview Section - Mobile Optimized */}
      {mockupUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <span>Your Custom Frame Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <img 
                src={mockupUrl} 
                alt="Frame preview" 
                className="w-full max-w-sm mx-auto rounded-lg border shadow-md"
              />
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Summary & Order - Mobile Optimized */}
      {photoPreview && (
        <Card className="sticky bottom-4 border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Total Price</h3>
                <p className="text-sm text-gray-600">
                  {frameOptions.find(f => f.id === frameStyle)?.name} • {sizeOptions.find(s => s.id === frameSize)?.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-rose-600">₹{calculatePrice()}</p>
                <p className="text-xs text-gray-500">Includes free delivery</p>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedPhoto || isSaving}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 text-lg"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - ₹{calculatePrice()}
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
              <span>🚚 Free Delivery</span>
              <span>💯 Quality Guarantee</span>
              <span>📞 24/7 Support</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 m-4">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-rose-500" />
              <h3 className="font-semibold text-gray-900">Creating Your Preview...</h3>
              <p className="text-gray-600">Please wait while we process your photo</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MobilePhotoCustomizer;