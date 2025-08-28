import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import axios from 'axios';
import { ProfilePhotoStorage } from './ProfilePhotoStorage';
import { DigitalWallet } from './DigitalWallet';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Camera,
  Wallet,
  Star,
  Package
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const UserProfile = () => {
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

  // Load user from localStorage on component mount
  useEffect(() => {
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
  }, []);

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
        preferences: formData.preferences || 'custom frames, photo gifts'
      };

      // Save to backend
      const response = await axios.post(`${API}/users`, userData);
      
      if (response.data.success || response.status === 200) {
        // Save to localStorage
        localStorage.setItem('memoriesUser', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('✅ Profile created successfully!', {
          description: 'Welcome to Memories! Your account is ready.',
          duration: 4000
        });
        
        setIsOpen(false);
        setIsEditing(false);
      } else {
        throw new Error('Failed to create profile');
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      
      // Even if backend fails, save locally
      const userData = {
        ...formData,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        preferences: formData.preferences || 'custom frames, photo gifts'
      };
      
      localStorage.setItem('memoriesUser', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Profile created locally! 📱');
      setIsOpen(false);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...formData };
      
      // Try to update on backend
      await axios.put(`${API}/users/${user.id}`, updatedUser);
      
      // Update localStorage
      localStorage.setItem('memoriesUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Update locally even if backend fails
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('memoriesUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated locally!');
      setIsEditing(false);
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
    toast.success('Logged out successfully');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative group"
        >
          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {user && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">{/* Content stays the same */}
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-rose-600" />
              <span>{user ? 'Your Profile' : 'Create Your Profile'}</span>
            </DialogTitle>
            <DialogDescription>
              {user 
                ? 'Manage your account, photos, wallet, and preferences' 
                : 'Join Memories community to track orders and get personalized recommendations'
              }
            </DialogDescription>
          </DialogHeader>
          
          {user && !isEditing ? (
            /* Enhanced Profile with Tabs */
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Photos</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
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
                          <CardTitle className="text-xl text-gray-900">{user.name}</CardTitle>
                          <CardDescription>Member since {new Date(user.createdAt).toLocaleDateString()}</CardDescription>
                          <Badge className="bg-green-100 text-green-800 mt-1">Active Member</Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
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
                    
                    <div className="flex space-x-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="border-gray-300"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <ProfilePhotoStorage 
                  userId={user.id}
                  onPhotoSelected={(photo) => {
                    toast.success('Photo selected for customization!');
                    setIsOpen(false);
                    // Integrate with photo customizer
                  }}
                />
              </TabsContent>

              <TabsContent value="wallet">
                <DigitalWallet 
                  userId={user.id}
                  onBalanceUpdate={(walletData) => {
                    // Handle wallet balance updates
                    console.log('Wallet updated:', walletData);
                  }}
                />
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 text-blue-600 mr-2" />
                      Order History
                    </CardTitle>
                    <CardDescription>
                      Track your past orders and reorder favorites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">
                        Start creating beautiful memories with custom photo frames
                      </p>
                      <Button 
                        onClick={() => {
                          setIsOpen(false);
                          document.getElementById('customizer')?.scrollIntoView({behavior: 'smooth'});
                        }}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Start Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            /* Profile Creation/Edit Mode */
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
                    placeholder="Tell us about your preferences (e.g., favorite frame styles, gift occasions)"
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
                      {user ? 'Update Profile' : 'Create Profile'}
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
    </Dialog>
  );
};