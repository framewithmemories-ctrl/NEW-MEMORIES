import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package, 
  Plus,
  IndianRupee,
  Image,
  RefreshCw,
  Trash2,
  Star,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(false);

  // Product categories
  const categories = [
    { value: 'frames', label: 'Photo Frames' },
    { value: 'mugs', label: 'Custom Mugs' },
    { value: 'acrylic', label: 'Acrylic Products' },
    { value: 't-shirts', label: 'T-Shirts' },
    { value: 'corporate', label: 'Corporate Gifts' },
    { value: 'led', label: 'LED Products' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Call real backend API
      const response = await axios.get(`${backendUrl}/api/products`);
      
      if (response.data) {
        setProducts(response.data);
      }
      
    } catch (error) {
      console.error('Products loading error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  };

  const createProduct = async (productData) => {
    try {
      setEditingProduct(true);
      
      const response = await axios.post(`${backendUrl}/api/products`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setProducts(prevProducts => [...prevProducts, response.data]);
        toast.success('Product created successfully!');
        setShowCreateDialog(false);
      }
      
    } catch (error) {
      console.error('Create product error:', error);
      toast.error('Failed to create product');
    } finally {
      setEditingProduct(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'frames': return 'bg-blue-100 text-blue-800';
      case 'mugs': return 'bg-green-100 text-green-800';
      case 'acrylic': return 'bg-purple-100 text-purple-800';
      case 't-shirts': return 'bg-yellow-100 text-yellow-800';
      case 'corporate': return 'bg-gray-100 text-gray-800';
      case 'led': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const NewProductForm = () => {
    const [newProduct, setNewProduct] = useState({
      name: '',
      description: '',
      category: 'frames',
      base_price: 0,
      image_url: '',
      sizes: [{ name: 'Standard', price_add: 0 }],
      materials: [{ name: 'Standard', price_add: 0 }],
      colors: [{ name: 'Standard', price_add: 0 }]
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      createProduct(newProduct);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={newProduct.category} 
              onValueChange={(value) => setNewProduct({...newProduct, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            placeholder="Enter product description"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="base_price">Base Price (₹)</Label>
            <Input
              id="base_price"
              type="number"
              value={newProduct.base_price}
              onChange={(e) => setNewProduct({...newProduct, base_price: parseFloat(e.target.value)})}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={editingProduct}>
            {editingProduct ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadProducts} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowCreateDialog(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+2</span>
              <span className="text-gray-600 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Filter className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Active categories</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    products.reduce((sum, p) => sum + p.base_price, 0) / (products.length || 1)
                  )}
                </p>
              </div>
              <IndianRupee className="w-8 h-8 text-rose-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Across all products</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Category</p>
                <p className="text-2xl font-bold text-gray-900">Frames</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Most popular</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            {categoryFilter === 'all' 
              ? 'Showing all products' 
              : `Showing products in ${categories.find(c => c.value === categoryFilter)?.label}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No products found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.base_price)}
                        </p>
                        <p className="text-xs text-gray-500">Base price</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setShowProductDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedProduct(product);
                            // Edit functionality would go here
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog 
        open={showProductDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setShowProductDialog(false);
            setSelectedProduct(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details - {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Complete product information and configuration
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Product Name</Label>
                    <p className="text-gray-900 font-medium">{selectedProduct.name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <Badge className={getCategoryColor(selectedProduct.category)}>
                      {selectedProduct.category}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Base Price</Label>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(selectedProduct.base_price)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Created</Label>
                    <p className="text-gray-900">{formatDate(selectedProduct.created_at)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-gray-900 mt-1">{selectedProduct.description}</p>
              </div>
              
              {/* Size Options */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Size Options</Label>
                <div className="mt-2 space-y-2">
                  {selectedProduct.sizes?.map((size, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{size.name}</span>
                      <span className="font-medium">
                        {size.price_add > 0 ? `+${formatCurrency(size.price_add)}` : 'Base price'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Material Options */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Material Options</Label>
                <div className="mt-2 space-y-2">
                  {selectedProduct.materials?.map((material, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{material.name}</span>
                      <span className="font-medium">
                        {material.price_add > 0 ? `+${formatCurrency(material.price_add)}` : 'Base price'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product for your catalog
            </DialogDescription>
          </DialogHeader>
          <NewProductForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;