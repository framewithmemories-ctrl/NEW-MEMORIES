import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import axios from 'axios';
import { 
  Sparkles, 
  Heart, 
  Gift, 
  Star,
  ShoppingCart,
  Wand2,
  Target,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Plus,
  ArrowRight,
  Zap,
  Award
} from "lucide-react";

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const FixedAIGiftFinder = () => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({
    occasion: '',
    recipient: '',
    budget: '',
    relationship: '',
    ageGroup: ''
  });

  // Enhanced product catalog for AI matching
  const productCatalog = [
    {
      id: 1,
      name: "Premium Wood Photo Frame",
      price: 899,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop",
      category: "frames",
      occasions: ["birthday", "anniversary", "wedding", "graduation"],
      recipients: ["family", "couple", "parents", "friends"],
      budgetRange: [500, 1500],
      tags: ["classic", "elegant", "timeless"],
      description: "Handcrafted wooden frame with premium finish"
    },
    {
      id: 2,
      name: "Crystal Acrylic Frame",
      price: 1299,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      category: "acrylic",
      occasions: ["anniversary", "wedding", "valentine", "corporate"],
      recipients: ["couple", "spouse", "business"],
      budgetRange: [1000, 2000],
      tags: ["modern", "premium", "crystal-clear"],
      description: "Crystal-clear acrylic with sophisticated appeal"
    },
    {
      id: 3,
      name: "Personalized Photo Mug",
      price: 449,
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop",
      category: "mugs",
      occasions: ["birthday", "friendship", "office", "valentine"],
      recipients: ["friends", "colleagues", "family"],
      budgetRange: [300, 800],
      tags: ["practical", "personal", "daily-use"],
      description: "Custom photo mug for everyday memories"
    },
    {
      id: 4,
      name: "Custom T-Shirt Design",
      price: 699,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
      category: "apparel",
      occasions: ["birthday", "graduation", "team", "casual"],
      recipients: ["friends", "family", "team", "kids"],
      budgetRange: [400, 1000],
      tags: ["trendy", "personal", "wearable"],
      description: "High-quality custom printed t-shirt"
    },
    {
      id: 5,
      name: "Corporate Photo Frame Set",
      price: 1899,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
      category: "corporate",
      occasions: ["corporate", "achievement", "retirement", "award"],
      recipients: ["business", "colleagues", "management"],
      budgetRange: [1500, 3000],
      tags: ["professional", "bulk", "premium"],
      description: "Executive photo frame set for corporate gifting"
    },
    {
      id: 6,
      name: "Wedding Memory Frame",
      price: 1599,
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=300&h=200&fit=crop",
      category: "frames",
      occasions: ["wedding", "anniversary", "engagement"],
      recipients: ["couple", "newlyweds", "family"],
      budgetRange: [1200, 2500],
      tags: ["romantic", "special", "keepsake"],
      description: "Elegant wedding photo frame with gold accents"
    },
    {
      id: 7,
      name: "Kids Birthday Photo Frame",
      price: 649,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      category: "frames",
      occasions: ["birthday", "graduation", "achievement"],
      recipients: ["kids", "family", "grandparents"],
      budgetRange: [400, 1000],
      tags: ["colorful", "fun", "child-friendly"],
      description: "Bright and colorful frame perfect for kids"
    },
    {
      id: 8,
      name: "Anniversary Photo Collage",
      price: 1199,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop",
      category: "frames",
      occasions: ["anniversary", "valentine", "milestone"],
      recipients: ["couple", "spouse", "parents"],
      budgetRange: [900, 1800],
      tags: ["romantic", "multi-photo", "memories"],
      description: "Multi-photo collage frame for special moments"
    }
  ];

  // AI-powered recommendation engine
  const generateRecommendations = async () => {
    setIsLoading(true);

    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // AI logic for contextual filtering
      let filteredProducts = [...productCatalog];

      // Filter by occasion
      if (filters.occasion) {
        filteredProducts = filteredProducts.filter(product => 
          product.occasions.includes(filters.occasion)
        );
      }

      // Filter by recipient
      if (filters.recipient) {
        filteredProducts = filteredProducts.filter(product => 
          product.recipients.includes(filters.recipient)
        );
      }

      // Filter by budget
      if (filters.budget) {
        const budgetRanges = {
          'under-500': [0, 500],
          '500-1000': [500, 1000],
          '1000-1500': [1000, 1500],
          'above-1500': [1500, 5000]
        };
        
        const [minBudget, maxBudget] = budgetRanges[filters.budget] || [0, 5000];
        filteredProducts = filteredProducts.filter(product => 
          product.price >= minBudget && product.price <= maxBudget
        );
      }

      // AI scoring based on context
      const scoredProducts = filteredProducts.map(product => {
        let score = 0;
        let reasons = [];

        // Occasion matching bonus
        if (filters.occasion && product.occasions.includes(filters.occasion)) {
          score += 30;
          reasons.push(`Perfect for ${filters.occasion}`);
        }

        // Recipient matching bonus
        if (filters.recipient && product.recipients.includes(filters.recipient)) {
          score += 25;
          reasons.push(`Ideal for ${filters.recipient}`);
        }

        // Budget appropriateness
        if (filters.budget) {
          const budgetRanges = {
            'under-500': [0, 500],
            '500-1000': [500, 1000],
            '1000-1500': [1000, 1500],
            'above-1500': [1500, 5000]
          };
          
          const [minBudget, maxBudget] = budgetRanges[filters.budget] || [0, 5000];
          if (product.price >= minBudget && product.price <= maxBudget) {
            score += 20;
            reasons.push(`Within ₹${minBudget}-${maxBudget} budget`);
          }
        }

        // Popularity bonus (simulated based on category and price)
        if (product.category === 'frames') score += 10;
        if (product.price < 1000) score += 5; // Affordable options

        // Special combinations
        if (filters.occasion === 'wedding' && product.category === 'frames') {
          score += 15;
          reasons.push("Wedding specialist choice");
        }

        if (filters.occasion === 'corporate' && product.category === 'corporate') {
          score += 20;
          reasons.push("Corporate gift expert pick");
        }

        return {
          ...product,
          aiScore: score,
          reasons: reasons.slice(0, 2) // Top 2 reasons
        };
      });

      // Sort by AI score and return top recommendations
      const sortedRecommendations = scoredProducts
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 6);

      setRecommendations(sortedRecommendations);

      toast.success('🎯 AI recommendations generated!', {
        description: `Found ${sortedRecommendations.length} perfect matches for your requirements`,
        duration: 3000
      });

    } catch (error) {
      console.error('AI recommendation error:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1,
        addedFrom: 'ai-gift-finder'
      });
      
      toast.success('🛒 Added to cart!', {
        description: `${product.name} - ₹${product.price}`,
        duration: 2000
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const resetFilters = () => {
    setFilters({
      occasion: '',
      recipient: '',
      budget: '',
      relationship: '',
      ageGroup: ''
    });
    setRecommendations([]);
  };

  const hasFilters = Object.values(filters).some(filter => filter !== '');

  return (
    <section id="gift-finder" className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Gift Finder
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let our AI help you find the perfect personalized gift. Just tell us the occasion, recipient, and budget - we'll do the rest!
          </p>
        </div>

        {/* AI Filter Interface */}
        <Card className="mb-8 border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Tell us about your gift needs
            </CardTitle>
            <CardDescription>
              Answer a few questions to get personalized AI recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Occasion */}
              <div>
                <Label htmlFor="occasion" className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Occasion
                </Label>
                <Select value={filters.occasion} onValueChange={(value) => setFilters(prev => ({...prev, occasion: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday 🎂</SelectItem>
                    <SelectItem value="anniversary">Anniversary 💕</SelectItem>
                    <SelectItem value="wedding">Wedding 💒</SelectItem>
                    <SelectItem value="valentine">Valentine's Day ❤️</SelectItem>
                    <SelectItem value="graduation">Graduation 🎓</SelectItem>
                    <SelectItem value="corporate">Corporate Event 💼</SelectItem>
                    <SelectItem value="friendship">Friendship 👫</SelectItem>
                    <SelectItem value="retirement">Retirement 🌅</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recipient */}
              <div>
                <Label htmlFor="recipient" className="flex items-center mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Recipient
                </Label>
                <Select value={filters.recipient} onValueChange={(value) => setFilters(prev => ({...prev, recipient: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Who is it for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family Member 👨‍👩‍👧‍👦</SelectItem>
                    <SelectItem value="spouse">Spouse/Partner 💑</SelectItem>
                    <SelectItem value="parents">Parents 👨‍👩‍👧‍👦</SelectItem>
                    <SelectItem value="friends">Friends 👫</SelectItem>
                    <SelectItem value="colleagues">Colleagues 💼</SelectItem>
                    <SelectItem value="kids">Kids 🧒</SelectItem>
                    <SelectItem value="couple">Couple 💏</SelectItem>
                    <SelectItem value="business">Business Contact 🤝</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget" className="flex items-center mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Budget Range
                </Label>
                <Select value={filters.budget} onValueChange={(value) => setFilters(prev => ({...prev, budget: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500">Under ₹500 💸</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1,000 💰</SelectItem>
                    <SelectItem value="1000-1500">₹1,000 - ₹1,500 💎</SelectItem>
                    <SelectItem value="above-1500">Above ₹1,500 👑</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                onClick={generateRecommendations}
                disabled={isLoading || !hasFilters}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    AI is thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Find Perfect Gifts
                  </>
                )}
              </Button>
              
              {hasFilters && (
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="sm:w-auto"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                AI Recommendations
              </h3>
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                {recommendations.length} Perfect Matches Found
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
                  <div className="relative">
                    {index === 0 && (
                      <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        AI Top Pick
                      </Badge>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-purple-600">₹{product.price}</span>
                        <Badge variant="outline" className="text-xs">
                          AI Score: {product.aiScore}%
                        </Badge>
                      </div>
                    </div>

                    {/* AI Reasons */}
                    {product.reasons && product.reasons.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Why AI recommends this:</p>
                        <div className="space-y-1">
                          {product.reasons.map((reason, idx) => (
                            <div key={idx} className="flex items-center text-xs text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Scroll to customizer with this product
                          const customizer = document.getElementById('customizer');
                          if (customizer) {
                            customizer.scrollIntoView({ behavior: 'smooth' });
                            toast.success('Scroll down to customize this product!');
                          }
                        }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* How AI Works */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-center">
                <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
                How Our AI Gift Finder Works
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <h5 className="font-semibold mb-2">Contextual Analysis</h5>
                  <p className="text-gray-600">AI analyzes occasion, recipient, and budget to understand your needs</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                    <Zap className="w-6 h-6 text-pink-600" />
                  </div>
                  <h5 className="font-semibold mb-2">Smart Matching</h5>
                  <p className="text-gray-600">Matches products based on popularity, reviews, and success rates</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h5 className="font-semibold mb-2">Ranked Results</h5>
                  <p className="text-gray-600">Presents top-scored recommendations with clear reasons why</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};