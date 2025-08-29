import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { 
  X, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone,
  Gift,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wallet,
  Plus,
  Minus
} from "lucide-react";

export const EnhancedCheckoutPage = ({ onClose }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    instructions: '',
    deliveryType: 'delivery',
    paymentMethod: 'cod'
  });
  const [userProfile, setUserProfile] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [showLiveUpdates, setShowLiveUpdates] = useState(true);

  // Load user profile and wallet on mount
  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem('memoriesUserProfile') || '{}');
      const wallet = profile.id ? JSON.parse(localStorage.getItem(`memories_wallet_${profile.id}`) || '{}') : {};
      
      if (profile.profileComplete) {
        setUserProfile(profile);
        setUserWallet(wallet);
        
        // Pre-fill form with profile data
        setFormData(prev => ({
          ...prev,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.city || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Calculate pricing with live updates
  const getItemTotal = (item) => item.price * item.quantity;
  
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  };

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal();
    if (formData.deliveryType === 'pickup') return 0;
    if (subtotal >= 1000) return 0; // Free delivery over ₹1000
    return 50;
  };

  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    return Math.round(subtotal * 0.18); // 18% GST
  };

  const getWalletDiscount = () => {
    if (!useWalletBalance || !userWallet) return 0;
    const subtotal = getSubtotal();
    return Math.min(userWallet.balance || 0, subtotal);
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const delivery = getDeliveryCharge();
    const tax = getTaxAmount();
    const walletDiscount = getWalletDiscount();
    return Math.max(0, subtotal + delivery + tax - walletDiscount);
  };

  // Dynamic messaging based on order type
  const getDeliveryMessage = () => {
    const subtotal = getSubtotal();
    const hasFrames = cartItems.some(item => item.category === 'frames');
    const hasCustomItems = cartItems.some(item => item.customization);
    
    let messages = [];
    
    if (formData.deliveryType === 'pickup') {
      messages.push({
        type: 'info',
        icon: <MapPin className="w-4 h-4" />,
        text: 'Ready for pickup at our Keeranatham Road store'
      });
      
      if (hasCustomItems) {
        messages.push({
          type: 'warning',
          icon: <Clock className="w-4 h-4" />,
          text: 'Custom items require 2-3 working days preparation'
        });
      } else {
        messages.push({
          type: 'success',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Standard items ready in 2-4 hours'
        });
      }
    } else {
      if (subtotal >= 1000) {
        messages.push({
          type: 'success',
          icon: <Truck className="w-4 h-4" />,
          text: 'Free home delivery (2-3 business days)'
        });
      } else {
        messages.push({
          type: 'info',
          icon: <Truck className="w-4 h-4" />,
          text: `₹50 delivery charge • Free delivery on orders ≥₹1000`
        });
      }
      
      if (hasFrames) {
        messages.push({
          type: 'info',
          icon: <Gift className="w-4 h-4" />,
          text: 'Frames will be carefully packaged for safe delivery'
        });
      }
    }

    return messages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend API for order validation and total calculation
      const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      const orderPayload = {
        items: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category || 'frames'
        })),
        customer: formData,
        delivery_type: formData.deliveryType,
        payment_method: formData.paymentMethod,
        use_wallet: useWalletBalance,
        wallet_amount: useWalletBalance ? getWalletDiscount() : 0
      };

      // Get validated totals from backend
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to process order');
      }

      const orderData = await response.json();
      console.log('✅ Backend order validation:', orderData);

      // If using wallet, update wallet balance via backend
      if (useWalletBalance && userWallet && userProfile && getWalletDiscount() > 0) {
        const walletResponse = await fetch(`${API_BASE}/api/wallet/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userProfile.id,
            amount: getWalletDiscount(),
            description: `Order Payment: ${orderData.id}`,
            order_id: orderData.id
          })
        });

        if (walletResponse.ok) {
          const updatedWallet = await walletResponse.json();
          localStorage.setItem(`memories_wallet_${userProfile.id}`, JSON.stringify(updatedWallet));
          setUserWallet(updatedWallet);
        }
      }
      }

      // Success notification with dynamic content based on order type
      const isDynamicContent = cartItems.some(item => item.category === 'acrylic' || item.category === 'frames');
      const isStorePickup = formData.deliveryType === 'pickup';
      
      let successMessage = '🎉 Order placed successfully!';
      let description = `Order ID: ${orderData.id || orderData.order_id}`;
      
      if (isDynamicContent && isStorePickup) {
        successMessage = '🏪 Store Pickup Order Confirmed!';
        description = `Ready for pickup at Keeranatham Road • Order ID: ${orderData.id || orderData.order_id}`;
      } else if (isDynamicContent) {
        successMessage = '🚛 Custom Order Processing!';
        description = `Custom frames processing • Delivery 3-5 days • Order ID: ${orderData.id || orderData.order_id}`;
      }

      toast.success(successMessage, {
        description: description,
        duration: 5000
      });
      });
      
      // Clear cart and close
      cartItems.forEach(item => removeFromCart(item.id));
      onClose();
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Your Cart is Empty
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">Add some beautiful photo frames to get started!</p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
            <p className="text-gray-600">Review and complete your order</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* User Profile Integration */}
              {userProfile && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-green-900">Welcome back, {userProfile.name}!</p>
                        <p className="text-green-700 text-sm">Your profile information has been pre-filled</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>We'll use this to contact you about your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      placeholder="+91 xxxxx xxxxx"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Options</CardTitle>
                  <CardDescription>Choose how you'd like to receive your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={formData.deliveryType} 
                    onValueChange={(value) => setFormData(prev => ({...prev, deliveryType: value}))}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <div className="flex-1">
                        <Label htmlFor="delivery" className="font-medium">Home Delivery</Label>
                        <p className="text-sm text-gray-600">We'll deliver to your doorstep</p>
                      </div>
                      <Truck className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <div className="flex-1">
                        <Label htmlFor="pickup" className="font-medium">Store Pickup</Label>
                        <p className="text-sm text-gray-600">Pick up from Keeranatham Road store</p>
                      </div>
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                  </RadioGroup>

                  {formData.deliveryType === 'delivery' && (
                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                        placeholder="Enter your complete address"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) => setFormData(prev => ({...prev, instructions: e.target.value}))}
                      placeholder="Any special requests or delivery instructions"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Messages */}
              {showLiveUpdates && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {getDeliveryMessage().map((message, index) => (
                        <div 
                          key={index}
                          className={`flex items-center space-x-2 p-3 rounded-lg ${
                            message.type === 'success' ? 'bg-green-50 text-green-800' :
                            message.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                            'bg-blue-50 text-blue-800'
                          }`}
                        >
                          {message.icon}
                          <span className="text-sm font-medium">{message.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => setFormData(prev => ({...prev, paymentMethod: value}))}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex-1">
                        <Label htmlFor="cod" className="font-medium">Cash on Delivery</Label>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                    
                    {userWallet && (userWallet.balance > 0) && (
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <div className="flex-1">
                          <Label htmlFor="wallet" className="font-medium">Digital Wallet</Label>
                          <p className="text-sm text-gray-600">Available balance: ₹{userWallet.balance}</p>
                        </div>
                        <Wallet className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </RadioGroup>
                  
                  {userWallet && (userWallet.balance > 0) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="useWallet"
                          checked={useWalletBalance}
                          onCheckedChange={setUseWalletBalance}
                        />
                        <Label htmlFor="useWallet" className="text-sm">
                          Use wallet balance (₹{Math.min(userWallet.balance, getSubtotal())})
                        </Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-600">₹{item.price} each</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing Breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{getSubtotal()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>
                          {getDeliveryCharge() === 0 ? (
                            <span className="text-green-600 font-medium">FREE</span>
                          ) : (
                            `₹${getDeliveryCharge()}`
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Tax (GST 18%)</span>
                        <span>₹{getTaxAmount()}</span>
                      </div>

                      {useWalletBalance && getWalletDiscount() > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Wallet Discount</span>
                          <span>-₹{getWalletDiscount()}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{getFinalTotal()}</span>
                    </div>

                    {/* Promotional Messages */}
                    {getSubtotal() >= 1000 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-800 text-sm font-medium flex items-center">
                          <Gift className="w-4 h-4 mr-2" />
                          Free delivery applied!
                        </p>
                      </div>
                    )}

                    {getSubtotal() < 1000 && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-yellow-800 text-sm flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Add ₹{1000 - getSubtotal()} for free delivery
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <Button 
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Place Order ₹{getFinalTotal()}
                          </>
                        )}
                      </Button>
                      
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <CheckCircle className="w-3 h-3" />
                        <span>100% Secure & Protected</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};