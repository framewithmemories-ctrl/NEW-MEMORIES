import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, X, ShoppingCart, Palette } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const SearchComponent = ({ onClose = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const { addToCart } = useCart();

  // Load all products for searching
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        const products = response.data || [];
        
        // Add enhanced products for better search results
        const enhancedProducts = [
          ...products,
          {
            id: 'frame-wooden',
            name: 'Classic Wooden Frame',
            description: 'Handcrafted wooden frame perfect for cherished memories',
            category: 'frames',
            base_price: 899,
            image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=300',
            tags: ['wooden', 'classic', 'traditional', 'photo', 'frame']
          },
          {
            id: 'frame-acrylic',
            name: 'Premium Acrylic Frame',
            description: 'Modern acrylic frame with crystal-clear finish',
            category: 'frames',
            base_price: 1299,
            image_url: 'https://images.unsplash.com/photo-1465161191540-aac346fcbaff?auto=format&fit=crop&w=400&h=300',
            tags: ['acrylic', 'modern', 'premium', 'clear', 'photo']
          },
          {
            id: 'mug-custom',
            name: 'Custom Photo Mug',
            description: 'Personalized ceramic mug with your favorite photo',
            category: 'mugs',
            base_price: 349,
            image_url: 'https://images.unsplash.com/photo-1505841468529-d99f8d82ef8f?auto=format&fit=crop&w=400&h=300',
            tags: ['mug', 'ceramic', 'photo', 'custom', 'personalized']
          },
          {
            id: 'tshirt-custom',
            name: 'Custom Printed T-Shirt',
            description: 'Premium quality cotton t-shirt with sublimation printing',
            category: 't-shirt',
            base_price: 299,
            image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&h=300',
            tags: ['tshirt', 't-shirt', 'cotton', 'custom', 'sublimation', 'clothing']
          },
          {
            id: 'corporate-gifts',
            name: 'Corporate Gift Set',
            description: 'Professional corporate gifting solutions with custom branding',
            category: 'corporate',
            base_price: 999,
            image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&h=300',
            tags: ['corporate', 'business', 'professional', 'bulk', 'branding']
          }
        ];
        
        setAllProducts(enhancedProducts);
      } catch (error) {
        console.error('Error fetching products for search:', error);
        toast.error('Failed to load search data');
      }
    };

    fetchProducts();
  }, []);

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const lowercaseQuery = query.toLowerCase();
      const results = allProducts.filter(product => {
        return (
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.description.toLowerCase().includes(lowercaseQuery) ||
          product.category.toLowerCase().includes(lowercaseQuery) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
        );
      });
      
      setSearchResults(results.slice(0, 8)); // Limit to 8 results
      
      if (results.length === 0) {
        toast.info(`No results found for "${query}"`);
      } else {
        toast.success(`Found ${results.length} result${results.length > 1 ? 's' : ''} for "${query}"`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
        <Search className={`w-4 h-4 ${isSearching ? 'animate-pulse text-blue-500' : 'text-gray-500'}`} />
        <input 
          type="text" 
          placeholder="Search frames, mugs, t-shirts..." 
          className="bg-transparent border-none outline-none text-sm w-48 flex-1"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="p-1 h-6 w-6 hover:bg-gray-300"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Search Results ({searchResults.length})</h3>
          </div>
          
          {searchResults.map((result) => (
            <div key={result.id} className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">
              <div className="flex items-center space-x-4">
                <img 
                  src={result.image_url} 
                  alt={result.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{result.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{result.description}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {result.category}
                      </Badge>
                      <span className="text-lg font-bold text-rose-600">₹{result.base_price}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                        onClick={() => {
                          document.getElementById('customizer')?.scrollIntoView({behavior: 'smooth'});
                          onClose?.();
                        }}
                      >
                        <Palette className="w-3 h-3 mr-1" />
                        Customize
                      </Button>
                      <Button 
                        size="sm"
                        className="text-xs bg-rose-500 hover:bg-rose-600"
                        onClick={() => {
                          // Fix: Actually add to cart using cart context
                          const success = addToCart(result);
                          if (success) {
                            onClose?.();
                          }
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {searchQuery && (
            <div className="p-3 text-center border-t border-gray-100">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearSearch}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};