import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toast } from "sonner";
import axios from "axios";
import { 
  User, 
  Calendar, 
  Heart, 
  Settings, 
  Shield, 
  Download, 
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Mail,
  MessageSquare,
  Phone,
  Gift,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const EnhancedUserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferences: ''
  });
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    rewardPoints: 0
  });
  const [orders, setOrders] = useState([]);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
    loadSavedPhotos();
    loadSavedDesigns();
    loadWalletData();
    loadOrders();
  }, []);

  const loadUserData = () => {
    const savedUser = localStorage.getItem('memoriesUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || '',
          preferences: parsedUser.preferences || ''
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  };

  const loadSavedPhotos = () => {
    const photos = JSON.parse(localStorage.getItem('memoriesPhotos') || '[]');
    setSavedPhotos(photos);
  };

  const loadSavedDesigns = () => {
    const designs = JSON.parse(localStorage.getItem('memoriesDesigns') || '[]');
    setSavedDesigns(designs);
  };

  const loadWalletData = () => {
    const wallet = JSON.parse(localStorage.getItem('memoriesWallet') || JSON.stringify({
      balance: 150, // Sample balance
      rewardPoints: 25,
      transactions: [
        {
          id: 'txn_001',
          type: 'credit',
          amount: 100,
          description: 'Welcome bonus',
          date: '2024-12-20T10:30:00Z'
        },
        {
          id: 'txn_002',
          type: 'credit',
          amount: 50,
          description: 'Referral reward',
          date: '2024-12-18T14:20:00Z'
        }
      ]
    }));
    setWalletData(wallet);
  };

  const loadOrders = () => {
    const orderHistory = JSON.parse(localStorage.getItem('memoriesOrders') || '[]');
    setOrders(orderHistory);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in name and email fields');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        ...formData,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        preferences: formData.preferences || 'custom frames, photo gifts',
        membershipTier: 'Bronze'
      };

      // Save to backend
      try {
        const response = await axios.post(`${API}/users`, userData);
        if (response.data.success || response.status === 200) {
          localStorage.setItem('memoriesUser', JSON.stringify(userData));
          setUser(userData);
          
          // Initialize wallet
          const initialWallet = {
            balance: 50, // Welcome bonus
            rewardPoints: 10,
            transactions: [
              {
                id: `txn_${Date.now()}`,
                type: 'credit',
                amount: 50,
                description: 'Welcome bonus for new members',
                date: new Date().toISOString()
              }
            ]
          };
          localStorage.setItem('memoriesWallet', JSON.stringify(initialWallet));
          setWalletData(initialWallet);
          
          toast.success('✅ Profile created successfully!', {
            description: 'Welcome bonus of ₹50 added to your wallet!',
            duration: 4000
          });
          
          setIsOpen(false);
          setIsEditing(false);
        }
      } catch (error) {
        // Fallback to local storage
        localStorage.setItem('memoriesUser', JSON.stringify(userData));
        setUser(userData);
        toast.success('Profile created successfully! 📱');
        setIsOpen(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...formData };
      
      localStorage.setItem('memoriesUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('memoriesUser');
    setUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      preferences: ''
    });
    setSavedPhotos([]);
    setSavedDesigns([]);
    setWalletData({ balance: 0, transactions: [], rewardPoints: 0 });
    toast.success('Logged out successfully');
    setIsOpen(false);
  };

  const deletePhoto = (photoId) => {
    const updatedPhotos = savedPhotos.filter(photo => photo.id !== photoId);
    setSavedPhotos(updatedPhotos);
    localStorage.setItem('memoriesPhotos', JSON.stringify(updatedPhotos));
    toast.success('Photo deleted successfully');
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        // Validate file
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }
        
        if (file.size > 8 * 1024 * 1024) { // 8MB limit
          toast.error(`${file.name} is too large (max 8MB)`);
          continue;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        
        // Create photo object
        const photo = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: url,
          size: (file.size / (1024 * 1024)).toFixed(2),
          uploadedAt: new Date().toISOString(),
          file: file // Store file for potential upload to server
        };

        // Add to saved photos
        const updatedPhotos = [...savedPhotos, photo];
        setSavedPhotos(updatedPhotos);
        localStorage.setItem('memoriesPhotos', JSON.stringify(updatedPhotos.map(p => ({
          ...p,
          file: undefined // Don't store file object in localStorage
        }))));
      }
      
      toast.success(`${files.length} photo(s) uploaded successfully`);
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDesign = (designId) => {
    const updatedDesigns = savedDesigns.filter(design => design.id !== designId);
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('memoriesDesigns', JSON.stringify(updatedDesigns));
    toast.success('Design deleted');
  };

  const addFundsToWallet = () => {
    const amount = prompt('Enter amount to add to wallet (₹):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const newTransaction = {
        id: `txn_${Date.now()}`,
        type: 'credit',
        amount: parseFloat(amount),
        description: 'Wallet top-up',
        date: new Date().toISOString()
      };
      
      const updatedWallet = {
        ...walletData,
        balance: walletData.balance + parseFloat(amount),
        transactions: [newTransaction, ...walletData.transactions]
      };
      
      setWalletData(updatedWallet);
      localStorage.setItem('memoriesWallet', JSON.stringify(updatedWallet));
      toast.success(`₹${amount} added to wallet successfully!`);
    }
  };

  const getMembershipTier = (orderCount) => {
    if (orderCount >= 10) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (orderCount >= 5) return { name: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { name: 'Bronze', color: 'bg-amber-100 text-amber-800' };
  };

  const tier = getMembershipTier(orders.length);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative group"
        onClick={() => setIsOpen(true)}
      >
        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {user && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
        )}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-rose-600" />
              <span>{user ? `${user.name}'s Profile` : 'Create Your Profile'}</span>
            </DialogTitle>
            <DialogDescription>
              {user 
                ? 'Manage your account, saved photos, designs, and wallet' 
                : 'Join Memories community to track orders and save your favorite designs'
              }
            </DialogDescription>
          </DialogHeader>
          
          {user && !isEditing ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="designs">Designs</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-6">
                <Card className="border-rose-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-gray-900">{user.name}</CardTitle>
                          <CardDescription>
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={tier.color}>{tier.name} Member</Badge>
                        <p className="text-sm text-gray-500 mt-1">{orders.length} orders</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{user.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    {user.address && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <span className="text-gray-700">{user.address}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Shopping Preferences</h4>
                      <p className="text-gray-600 text-sm">{user.preferences}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-600">{savedPhotos.length}</div>
                        <div className="text-sm text-gray-600">Saved Photos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-600">{savedDesigns.length}</div>
                        <div className="text-sm text-gray-600">Saved Designs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-600">₹{walletData.balance}</div>
                        <div className="text-sm text-gray-600">Wallet Balance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="flex-1 border-gray-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </TabsContent>
              
              {/* Saved Photos Tab */}
              <TabsContent value="photos" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Saved Photos ({savedPhotos.length})</h3>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      id="photo-upload"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      disabled={isUploading}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Photos'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('customizer')?.scrollIntoView({behavior: 'smooth'})}
                    >
                      Use Customizer
                    </Button>
                  </div>
                </div>
                
                {savedPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {savedPhotos.map((photo) => (
                      <Card key={photo.id} className="overflow-hidden">
                        <div className="relative">
                          <img 
                            src={photo.url} 
                            alt={photo.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                              onClick={() => {
                                // Logic to use this photo in customizer
                                toast.success('Photo selected for customization');
                              }}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                              onClick={() => deletePhoto(photo.id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium truncate">{photo.name}</p>
                          <p className="text-xs text-gray-500">{photo.size}MB</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-8 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No saved photos yet</p>
                      <p className="text-sm text-gray-500">Upload photos in the customizer to save them here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Saved Designs Tab */}
              <TabsContent value="designs" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Saved Designs ({savedDesigns.length})</h3>
                </div>
                
                {savedDesigns.length > 0 ? (
                  <div className="space-y-4">
                    {savedDesigns.map((design) => (
                      <Card key={design.id} className="border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                <Heart className="w-8 h-8 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {design.frame} Frame - {design.size}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {design.borderThickness}" border • Saved {new Date(design.timestamp).toLocaleDateString()}
                                </p>
                                <Badge className="mt-1 bg-green-100 text-green-800">
                                  ₹{design.price}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 text-green-700 hover:bg-green-50"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Reorder
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteDesign(design.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-8 text-center">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No saved designs yet</p>
                      <p className="text-sm text-gray-500">Save designs from the customizer to reorder later</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Wallet Tab */}
              <TabsContent value="wallet" className="space-y-6 mt-6">
                <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-purple-600" />
                        My Wallet
                      </div>
                      <Button
                        onClick={addFundsToWallet}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Funds
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                        <Wallet className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-900">₹{walletData.balance}</div>
                        <div className="text-sm text-gray-600">Available Balance</div>
                      </div>
                      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-900">{walletData.rewardPoints}</div>
                        <div className="text-sm text-gray-600">Reward Points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="w-5 h-5 mr-2" />
                      Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {walletData.transactions.length > 0 ? (
                      <div className="space-y-3">
                        {walletData.transactions.slice(0, 10).map((txn) => (
                          <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {txn.type === 'credit' ? <Plus className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{txn.description}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(txn.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className={`font-bold ${
                              txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-4">No transactions yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Order History ({orders.length})</h3>
                </div>
                
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-blue-100 text-blue-800">
                                  Order #{order.id}
                                </Badge>
                                <Badge variant="outline" className="text-green-700 border-green-200">
                                  {order.status || 'Confirmed'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {order.items?.length || 0} items • ₹{order.pricing?.finalTotal || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Ordered on {new Date(order.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-8 text-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <p className="text-sm text-gray-500">Start shopping to see your order history here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            /* Profile Creation/Edit Form */
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input 
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <Textarea 
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="preferences" className="text-sm font-medium text-gray-700">
                    Shopping Preferences
                  </Label>
                  <Textarea 
                    id="preferences"
                    value={formData.preferences}
                    onChange={(e) => handleInputChange('preferences', e.target.value)}
                    placeholder="Tell us about your preferences (e.g., favorite frame styles, occasions)"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={user ? handleUpdateProfile : handleCreateProfile}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {user ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {user ? 'Update Profile' : 'Create Profile & Get ₹50 Bonus'}
                    </>
                  )}
                </Button>
                
                {user && isEditing && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        preferences: user.preferences || ''
                      });
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};