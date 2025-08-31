import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight,
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

// Business Logo Component for Checkout
const BusinessLogo = ({ size = "w-12 h-12" }) => {
  return (
    <div className={`${size} relative group cursor-pointer`}>
      <img 
        src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/6aq8xona_LOGO.png"
        alt="Memories Logo"
        className={`${size} object-contain rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
      />
    </div>
  );
};

// Business Name Component for Checkout  
const BusinessName = () => {
  return (
    <img 
      src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/t3qf6xi2_NAME.png"
      alt="Memories - Frame with Love and Crafted with Care"
      className="h-10 object-contain"
    />
  );
};

export const EnhancedCheckoutPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    instructions: '',
    deliveryType: 'delivery',
    paymentMethod: '' // No default payment method - user must choose
  });
  const [codEnabled, setCodEnabled] = useState(false); // COD checkbox state
  const [storePickupPayment, setStorePickupPayment] = useState(''); // Store pickup payment choice
  const [orderConfirmation, setOrderConfirmation] = useState(null); // Order confirmation state
  const [userProfile, setUserProfile] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [showLiveUpdates, setShowLiveUpdates] = useState(true);

  // Fix order summary page loading from header
  useEffect(() => {
    if (orderConfirmation) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderConfirmation]);

  // Load user profile and wallet on mount
  useEffect(() => {
    // Scroll to top when checkout page loads
    window.scrollTo(0, 0);
    
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
          alternatePhone: profile.alternatePhone || '',
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

  // Enhanced order submission with COD logic and proper validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Required fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validation: Phone numbers cannot be the same
    if (formData.phone === formData.alternatePhone && formData.alternatePhone.trim() !== '') {
      toast.error('Primary and alternate phone numbers cannot be the same');
      return;
    }
    
    // COD is optional - if not selected, proceed with normal checkout
    // Only validate COD requirements if user explicitly selected COD
    if (codEnabled && !formData.alternatePhone) {
      toast.error('Alternate phone number is mandatory for Cash on Delivery orders');
      return;
    }
    
    // Validation: Address for delivery
    if (formData.deliveryType === 'delivery' && !formData.address) {
      toast.error('Please provide delivery address');
      return;
    }
    
    // Validation: Store pickup payment choice
    if (formData.deliveryType === 'pickup' && !storePickupPayment) {
      toast.error('Please select a payment option for store pickup');
      return;
    }

    setIsSubmitting(true);

    try {
      // Enhanced order processing with backend validation
      const orderData = {
        id: `ORD${Date.now()}`,
        items: cartItems,
        customer: formData,
        totals: {
          subtotal: getSubtotal(),
          delivery: getDeliveryCharge(),
          tax: getTaxAmount(),
          walletDiscount: getWalletDiscount(),
          final: getFinalTotal()
        },
        paymentMethod: formData.deliveryType === 'pickup' 
          ? (storePickupPayment === 'cash-at-store' ? 'cod' : 'online')
          : (codEnabled ? 'cod' : 'online'),
        deliveryType: formData.deliveryType,
        createdAt: new Date().toISOString()
      };

      // Wallet balance update if used
      if (useWalletBalance && userWallet && userProfile && getWalletDiscount() > 0) {
        const newBalance = (userWallet.balance || 0) - getWalletDiscount();
        const updatedWallet = { ...userWallet, balance: newBalance };
        localStorage.setItem(`memories_wallet_${userProfile.id}`, JSON.stringify(updatedWallet));
        setUserWallet(updatedWallet);
        
        // Add transaction record
        const transactions = JSON.parse(localStorage.getItem(`memories_transactions_${userProfile.id}`) || '[]');
        transactions.unshift({
          id: `txn_${Date.now()}`,
          type: 'debit',
          amount: getWalletDiscount(),
          description: `Payment for order ${orderData.id}`,
          category: 'purchase',
          orderId: orderData.id,
          timestamp: new Date().toISOString(),
          status: 'completed'
        });
        localStorage.setItem(`memories_transactions_${userProfile.id}`, JSON.stringify(transactions));
      }

      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save order to history
      const savedOrders = JSON.parse(localStorage.getItem('memoriesOrderHistory') || '[]');
      savedOrders.unshift(orderData);
      localStorage.setItem('memoriesOrderHistory', JSON.stringify(savedOrders));
      
      // ENHANCED: Dynamic success message based on order type
      const hasAcrylicFrames = cartItems.some(item => 
        item.category === 'acrylic' || 
        item.name.toLowerCase().includes('acrylic') ||
        item.name.toLowerCase().includes('frame')
      );
      const isStorePickup = formData.deliveryType === 'pickup';
      
      let successMessage = '🎉 Order placed successfully!';
      let description = `Order ID: ${orderData.id}`;
      
      if (hasAcrylicFrames && isStorePickup) {
        successMessage = '🏪 Store Pickup Ready!';
        description = `Custom frames will be ready for pickup at Keeranatham Road in 2-3 days • Order ID: ${orderData.id}`;
      } else if (hasAcrylicFrames) {
        successMessage = '🖼️ Custom Frames Processing!';
        description = `Your custom photo frames are being crafted • Delivery in 3-5 days • Order ID: ${orderData.id}`;
      } else if (isStorePickup) {
        successMessage = '🏪 Store Pickup Confirmed!';
        description = `Ready for pickup at our Keeranatham Road store • Order ID: ${orderData.id}`;
      }

      // FIXED: Set order confirmation instead of immediately clearing cart
      setOrderConfirmation({
        orderId: orderData.id,
        items: cartItems,
        customerInfo: formData,
        totals: orderData.totals,
        paymentMethod: formData.deliveryType === 'pickup' 
          ? (storePickupPayment === 'cash-at-store' ? 'Pay Cash at Store' : 'Paid Online') 
          : (codEnabled ? 'Cash on Delivery' : 'Online Payment'),
        deliveryType: formData.deliveryType,
        successMessage,
        description,
        timestamp: new Date()
      });
      
      // Clear cart in background after confirmation is set
      setTimeout(() => {
        clearCart();
      }, 100);
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FIXED: Show Order Confirmation Screen - Compact Bill Format
  if (orderConfirmation) {
    // Ensure page loads from top - moved outside conditional
    setTimeout(() => window.scrollTo(0, 0), 100);
    
    return (
      <div className="max-w-md mx-auto px-4 py-8" style={{ marginTop: '0px', paddingTop: '20px' }}>
        <div className="bg-white border-2 border-gray-200 p-6 font-mono text-sm">
          
          {/* Enhanced Shop Logo and Branding - Horizontal Layout Like Header */}
          <div className="text-center mb-8 border-b-2 border-dashed border-gray-300 pb-6">
            {/* Logo + Business Name Side by Side (Like Header) */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <BusinessLogo size="w-16 h-16" />
              <BusinessName />
            </div>
            
            {/* Business Type */}
            <div className="text-sm text-gray-700 font-medium mb-2">Photo Frames & Custom Gift Shop</div>
            
            {/* Tagline */}
            <div className="text-sm text-rose-600 italic font-medium mb-4">Frame with Love • Crafted with Care</div>
            
            {/* Contact Information */}
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <span>📍</span>
                <span>19B Kanni Illam, Keeranatham Rd, near Ruby School</span>
              </div>
              <div>Saravanampatti, Coimbatore, Tamil Nadu 641035</div>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <span>📞 +91 81480 40148</span>
                <span>🕒 Mon-Sat: 9:30AM-9PM</span>
              </div>
              <div className="text-blue-600">🌐 memories-photoframes.com</div>
            </div>
          </div>

          {/* Order Summary Heading */}
          <div className="text-center mb-4">
            <div className="font-bold text-base">ORDER SUMMARY</div>
            <div className="text-xs text-gray-600">Order ID: {orderConfirmation.orderId}</div>
            <div className="text-xs text-gray-600">{new Date(orderConfirmation.timestamp).toLocaleString()}</div>
          </div>

          {/* Separator */}
          <div className="border-t border-dashed border-gray-400 my-3"></div>

          {/* Items Table */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 font-bold text-xs">
              <span>ITEM</span>
              <span>QTY</span>
              <span>PRICE</span>
              <span>SUBTOTAL</span>
            </div>
            <div className="border-t border-gray-400 mb-2"></div>
            
            {orderConfirmation.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-1 text-xs">
                <span className="flex-1 truncate pr-2">{item.name}</span>
                <span className="w-8 text-center">{item.quantity}</span>
                <span className="w-12 text-right">{item.price.toFixed(2)}</span>
                <span className="w-16 text-right">{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t border-gray-400 mt-2 pt-2">
              <div className="flex justify-between text-xs">
                <span>Subtotal:</span>
                <span>{orderConfirmation.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Delivery:</span>
                <span>{orderConfirmation.totals.delivery === 0 ? 'FREE' : orderConfirmation.totals.delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Tax (GST 18%):</span>
                <span>{orderConfirmation.totals.tax.toFixed(2)}</span>
              </div>
              {orderConfirmation.totals.walletDiscount > 0 && (
                <div className="flex justify-between text-xs">
                  <span>Wallet Discount:</span>
                  <span>-{orderConfirmation.totals.walletDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t-2 border-gray-400 mt-2 pt-2">
              <div className="flex justify-between font-bold text-base">
                <span>GRAND TOTAL:</span>
                <span>₹{orderConfirmation.totals.final.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="border-t border-dashed border-gray-400 pt-3 mb-4">
            <div className="text-xs space-y-1">
              <div><strong>Customer:</strong> {orderConfirmation.customerInfo.name}</div>
              <div><strong>Phone:</strong> {orderConfirmation.customerInfo.phone}</div>
              <div><strong>Payment:</strong> {orderConfirmation.paymentMethod}</div>
              <div><strong>Delivery:</strong> {orderConfirmation.deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 mb-4">
            <div className="border-t border-dashed border-gray-400 pt-3">
              Thank you for shopping with us!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={() => window.print()} 
              className="w-full bg-gray-600 hover:bg-gray-700 text-white text-sm"
            >
              🖨️ Print Receipt
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderConfirmation) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Your Cart is Empty
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">Add some beautiful photo frames to get started!</p>
            <Button onClick={() => navigate('/')}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
            <p className="text-gray-600 mt-2">Review and complete your order</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
            Continue Shopping
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        
        {/* Main Form - Mobile Optimized */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          
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
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label htmlFor="phone">Primary Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    placeholder="+91 xxxxx xxxxx"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="alternatePhone">
                    Alternate Phone {codEnabled && '*'}
                  </Label>
                  <Input
                    id="alternatePhone"
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData(prev => ({...prev, alternatePhone: e.target.value}))}
                    placeholder="+91 xxxxx xxxxx"
                    required={codEnabled}
                  />
                  {codEnabled && (
                    <p className="text-xs text-orange-600 mt-1">
                      Mandatory for Cash on Delivery orders
                    </p>
                  )}
                </div>
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

              {/* Store Pickup Payment Choice */}
              {formData.deliveryType === 'pickup' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">How would you like to pay?</h4>
                  <RadioGroup 
                    value={storePickupPayment} 
                    onValueChange={setStorePickupPayment}
                  >
                    <div className="flex items-center space-x-2 p-3 border border-blue-200 rounded-lg bg-white">
                      <RadioGroupItem value="online" id="pickup-online" />
                      <div className="flex-1">
                        <Label htmlFor="pickup-online" className="font-medium">Pay Online Now</Label>
                        <p className="text-sm text-gray-600">Secure online payment, faster pickup</p>
                      </div>
                      <CreditCard className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-blue-200 rounded-lg bg-white">
                      <RadioGroupItem value="cash-at-store" id="pickup-cash" />
                      <div className="flex-1">
                        <Label htmlFor="pickup-cash" className="font-medium">Pay Cash at Store (COD)</Label>
                        <p className="text-sm text-gray-600">Pay when you pick up your order</p>
                      </div>
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                  </RadioGroup>
                  
                  {!storePickupPayment && (
                    <div className="mt-3 p-2 bg-orange-100 rounded text-sm text-orange-700">
                      ⚠️ Please select a payment option for store pickup
                    </div>
                  )}
                </div>
              )}

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
              <CardDescription>
                {codEnabled ? 
                  'Cash on Delivery selected - Pay when you receive your order!' : 
                  'Select payment options if needed (Optional - Default is online payment)'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Cash on Delivery Checkbox */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="cod-checkbox"
                  checked={codEnabled}
                  onCheckedChange={(checked) => {
                    setCodEnabled(checked);
                    if (checked) {
                      setFormData(prev => ({...prev, paymentMethod: 'cod'}));
                    } else {
                      setFormData(prev => ({...prev, paymentMethod: ''}));
                    }
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="cod-checkbox" className="font-medium text-base cursor-pointer">
                    Cash on Delivery (COD)
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">Pay when you receive your order at your doorstep</p>
                  {codEnabled && (
                    <div className="mt-2 p-2 bg-green-50 rounded-md">
                      <p className="text-xs text-green-700 font-medium">
                        ✓ No advance payment needed • Alternate phone number required
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Wallet Option (if available) */}
              {userWallet && (userWallet.balance > 0) && (
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    id="wallet-checkbox"
                    checked={formData.paymentMethod === 'wallet'}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCodEnabled(false);
                        setFormData(prev => ({...prev, paymentMethod: 'wallet'}));
                      } else {
                        setFormData(prev => ({...prev, paymentMethod: ''}));
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="wallet-checkbox" className="font-medium text-base cursor-pointer flex items-center">
                      Digital Wallet
                      <Wallet className="w-4 h-4 ml-2 text-gray-400" />
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Available balance: ₹{userWallet.balance}</p>
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
  );
};