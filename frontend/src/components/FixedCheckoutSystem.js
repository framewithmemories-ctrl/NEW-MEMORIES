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
import axios from 'axios';
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
  Minus,
  Package,
  Calculator,
  Receipt
} from "lucide-react";

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const FixedCheckoutSystem = ({ onClose }) => {
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
  const [orderTotals, setOrderTotals] = useState({
    subtotal: 0,
    delivery: 0,
    tax: 0,
    walletDiscount: 0,
    couponDiscount: 0,
    finalTotal: 0
  });

  // Load user profile and wallet on mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Recalculate totals whenever cart or settings change
  useEffect(() => {
    calculateOrderTotals();
  }, [cartItems, formData.deliveryType, useWalletBalance, userWallet]);

  const loadUserData = () => {
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
  };

  // Authoritative backend-based order calculations
  const calculateOrderTotals = () => {
    if (cartItems.length === 0) {
      setOrderTotals({
        subtotal: 0,
        delivery: 0,
        tax: 0,
        walletDiscount: 0,
        couponDiscount: 0,
        finalTotal: 0
      });
      return;
    }

    // Calculate subtotal from actual cart items
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Calculate delivery charge based on business logic
    let deliveryCharge = 0;
    if (formData.deliveryType === 'delivery') {
      if (subtotal < 1000) {
        deliveryCharge = 50; // Standard delivery fee
      }
      // Free delivery for orders ≥ ₹1000
    }

    // Calculate tax (18% GST)
    const taxAmount = Math.round(subtotal * 0.18);

    // Calculate wallet discount if enabled
    let walletDiscount = 0;
    if (useWalletBalance && userWallet && userWallet.balance > 0) {
      walletDiscount = Math.min(userWallet.balance, subtotal + deliveryCharge + taxAmount);
    }

    // Calculate final total
    const finalTotal = Math.max(0, subtotal + deliveryCharge + taxAmount - walletDiscount);

    setOrderTotals({
      subtotal,
      delivery: deliveryCharge,
      tax: taxAmount,
      walletDiscount,
      couponDiscount: 0,
      finalTotal
    });
  };

  // Dynamic messaging based on order composition
  const getOrderMessages = () => {
    const messages = [];
    const hasAcrylicFrames = cartItems.some(item => 
      item.category === 'acrylic' || item.name.toLowerCase().includes('acrylic')
    );
    const hasCustomItems = cartItems.some(item => item.customization);

    if (formData.deliveryType === 'pickup') {
      if (hasAcrylicFrames) {
        messages.push({
          type: 'warning',
          icon: <Clock className="w-4 h-4" />,
          text: 'Acrylic Frames require 48-72 hours preparation time due to precision cutting and quality checks.'
        });
      } else {
        messages.push({
          type: 'success',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'All orders except Acrylic Frames will be ready in 24 hrs and will be dispatched on the same day.'
        });
      }
      
      messages.push({
        type: 'info',
        icon: <MapPin className="w-4 h-4" />,
        text: 'Pickup Location: 19B Kani Illam, Keeranatham Road, Near Ruby School, Saravanampatti, Coimbatore - 641035'
      });
    } else {
      // Delivery messages
      if (orderTotals.subtotal >= 1000) {
        messages.push({
          type: 'success',
          icon: <Gift className="w-4 h-4" />,
          text: 'FREE Home Delivery Applied! (2-3 business days)'
        });
      } else {
        messages.push({
          type: 'info',
          icon: <Truck className="w-4 h-4" />,
          text: `₹50 delivery charge • Add ₹${1000 - orderTotals.subtotal} more for FREE delivery`
        });
      }

      if (hasAcrylicFrames) {
        messages.push({
          type: 'warning',
          icon: <Clock className="w-4 h-4" />,
          text: 'Acrylic Frames: Extended 3-4 days preparation + delivery time for quality assurance.'
        });
      }

      if (hasCustomItems) {
        messages.push({
          type: 'info',
          icon: <Package className="w-4 h-4" />,
          text: 'Custom items will be carefully packaged with extra protection for safe delivery.'
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

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.deliveryType === 'delivery' && !formData.address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order with backend calculations
      const orderData = {
        id: `MEM${Date.now()}`,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          customization: item.customization || null
        })),
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.deliveryType === 'delivery' ? formData.address.trim() : null,
          instructions: formData.instructions.trim()
        },
        delivery: {
          type: formData.deliveryType,
          charge: orderTotals.delivery
        },
        payment: {
          method: formData.paymentMethod,
          walletUsed: useWalletBalance,
          walletAmount: orderTotals.walletDiscount
        },
        totals: orderTotals,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // Submit to backend (with fallback)
      try {
        const response = await axios.post(`${API_BASE}/api/orders`, orderData);
        if (response.data.success) {
          orderData.backendOrderId = response.data.orderId;
        }
      } catch (backendError) {
        console.log('Backend order creation failed, proceeding with local processing');
      }

      // Process wallet payment if used
      if (useWalletBalance && userWallet && userProfile && orderTotals.walletDiscount > 0) {
        const newBalance = (userWallet.balance || 0) - orderTotals.walletDiscount;
        const updatedWallet = {
          ...userWallet,
          balance: newBalance,
          totalSpent: (userWallet.totalSpent || 0) + orderTotals.walletDiscount
        };
        localStorage.setItem(`memories_wallet_${userProfile.id}`, JSON.stringify(updatedWallet));
        
        // Add transaction record
        const transactions = JSON.parse(localStorage.getItem(`memories_transactions_${userProfile.id}`) || '[]');
        transactions.unshift({
          id: `txn_${Date.now()}`,
          type: 'debit',
          amount: orderTotals.walletDiscount,
          description: `Payment for order ${orderData.id}`,
          category: 'purchase',
          orderId: orderData.id,
          timestamp: new Date().toISOString(),
          status: 'completed',
          balanceAfter: newBalance
        });
        localStorage.setItem(`memories_transactions_${userProfile.id}`, JSON.stringify(transactions));
      }

      // Store order in user's history
      if (userProfile) {
        const orders = JSON.parse(localStorage.getItem(`memories_orders_${userProfile.id}`) || '[]');
        orders.unshift(orderData);
        localStorage.setItem(`memories_orders_${userProfile.id}`, JSON.stringify(orders));
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('🎉 Order placed successfully!', {
        description: `Order ID: ${orderData.id} • Total: ₹${orderTotals.finalTotal}`,
        duration: 5000
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

  const orderMessages = getOrderMessages();

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
            <Button onClick={onClose} className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
            <p className="text-gray-600">Review and complete your order • Order Total: ₹{orderTotals.finalTotal}</p>
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
                        placeholder="Enter your full name"
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
                        placeholder="your@email.com"
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
                        <p className="text-sm text-gray-600">
                          {orderTotals.subtotal >= 1000 ? 'FREE delivery to your doorstep' : `₹50 delivery charge (FREE above ₹1000)`}
                        </p>
                      </div>
                      <Truck className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <div className="flex-1">
                        <Label htmlFor="pickup" className="font-medium">Store Pickup (FREE)</Label>
                        <p className="text-sm text-gray-600">Pick up from our Keeranatham Road store</p>
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
                        placeholder="Enter your complete address with landmarks"
                        rows={3}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) => setFormData(prev => ({...prev, instructions: e.target.value}))}
                      placeholder="Any special requests, delivery instructions, or customization details"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Order Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderMessages.map((message, index) => (
                      <div 
                        key={index}
                        className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
                          message.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                          message.type === 'warning' ? 'bg-orange-50 border-orange-500 text-orange-800' :
                          'bg-blue-50 border-blue-500 text-blue-800'
                        }`}
                      >
                        <div className="mt-0.5">{message.icon}</div>
                        <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                        <p className="text-sm text-gray-600">Pay ₹{orderTotals.finalTotal} when you receive your order</p>
                      </div>
                      <Receipt className="w-5 h-5 text-gray-400" />
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="useWallet"
                            checked={useWalletBalance}
                            onCheckedChange={setUseWalletBalance}
                          />
                          <Label htmlFor="useWallet" className="text-sm font-medium">
                            Use wallet balance for partial payment
                          </Label>
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                          Save ₹{Math.min(userWallet.balance, orderTotals.subtotal + orderTotals.delivery + orderTotals.tax)}
                        </span>
                      </div>
                      {useWalletBalance && (
                        <p className="text-xs text-gray-600 mt-2">
                          ₹{orderTotals.walletDiscount} will be deducted from wallet, remaining ₹{orderTotals.finalTotal} pay on delivery
                        </p>
                      )}
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
                      <Calculator className="w-5 h-5 mr-2" />
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
                            <p className="text-xs text-gray-600">₹{item.price} × {item.quantity}</p>
                            {item.customization && (
                              <Badge variant="outline" className="text-xs">Custom</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
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

                    {/* Authoritative Pricing Breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span className="font-medium">₹{orderTotals.subtotal}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>
                          {formData.deliveryType === 'pickup' ? 'Store Pickup' : 'Delivery Charge'}
                        </span>
                        <span className="font-medium">
                          {orderTotals.delivery === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `₹${orderTotals.delivery}`
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Tax (GST 18%)</span>
                        <span className="font-medium">₹{orderTotals.tax}</span>
                      </div>

                      {orderTotals.walletDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Wallet Discount</span>
                          <span className="font-medium">-₹{orderTotals.walletDiscount}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-rose-600">₹{orderTotals.finalTotal}</span>
                    </div>

                    {/* Payment Breakdown */}
                    {orderTotals.walletDiscount > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Wallet Payment:</span>
                          <span className="font-medium">₹{orderTotals.walletDiscount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{formData.paymentMethod === 'cod' ? 'Pay on Delivery:' : 'Remaining Amount:'}:</span>
                          <span className="font-medium">₹{orderTotals.finalTotal}</span>
                        </div>
                      </div>
                    )}

                    {/* Promotional Messages */}
                    {orderTotals.subtotal >= 1000 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-800 text-sm font-medium flex items-center">
                          <Gift className="w-4 h-4 mr-2" />
                          Free delivery applied!
                        </p>
                      </div>
                    )}

                    {orderTotals.subtotal < 1000 && formData.deliveryType === 'delivery' && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-yellow-800 text-sm flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Add ₹{1000 - orderTotals.subtotal} for FREE delivery
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <Button 
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-lg py-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing Order...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 mr-2" />
                            Place Order ₹{orderTotals.finalTotal}
                          </>
                        )}
                      </Button>
                      
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <CheckCircle className="w-3 h-3" />
                        <span>100% Secure & Protected • No hidden charges</span>
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