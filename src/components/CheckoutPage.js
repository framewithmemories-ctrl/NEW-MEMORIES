import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard,
  Smartphone,
  Banknote,
  MapPin,
  User,
  Mail,
  Phone,
  Gift,
  Shield,
  Truck,
  CheckCircle,
  ArrowLeft,
  Heart
} from "lucide-react";

const BusinessLogo = ({ size = "w-8 h-8" }) => {
  return (
    <div className={`${size} relative group cursor-pointer`}>
      <img 
        src="https://customer-assets.emergentagent.com/job_frameify-store/artifacts/6aq8xona_LOGO.png"
        alt="Memories Logo"
        className={`${size} object-contain rounded-xl shadow-lg`}
      />
    </div>
  );
};

export const CheckoutPage = ({ onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('cart'); // cart, details, payment, confirmation
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: 'Coimbatore',
    state: 'Tamil Nadu'
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load customer details from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('memoriesUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCustomerDetails({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          pincode: '',
          city: 'Coimbatore',
          state: 'Tamil Nadu'
        });
      } catch (error) {
        console.error('Error loading user details:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    if (step === 'details') {
      if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 'cart' && cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (currentStep === 'cart') {
      setCurrentStep('details');
    } else if (currentStep === 'details' && validateStep('details')) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handlePlaceOrder();
    }
  };

  const prevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('cart');
    } else if (currentStep === 'payment') {
      setCurrentStep('details');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('cart');
      onClose?.();
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderDetails = {
        id: `MEM${Date.now()}`,
        items: cartItems,
        customerDetails,
        paymentMethod,
        deliveryOption,
        specialInstructions,
        totalAmount: getTotalPrice(),
        timestamp: new Date().toISOString()
      };
      
      // Save order to localStorage (in production, this would be sent to backend)
      const orders = JSON.parse(localStorage.getItem('memoriesOrders') || '[]');
      orders.push(orderDetails);
      localStorage.setItem('memoriesOrders', JSON.stringify(orders));
      
      // Clear cart after successful order
      clearCart();
      
      setCurrentStep('confirmation');
      
      toast.success('Order placed successfully! 🎉', {
        description: `Order ID: ${orderDetails.id}`,
        duration: 5000
      });
      
    } catch (error) {
      console.error('Order processing error:', error);
      toast.error('Failed to place order. Please try again or call us.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getDeliveryCharge = () => {
    if (deliveryOption === 'pickup') return 0;
    if (getTotalPrice() >= 1000) return 0; // Free delivery over ₹1000
    return 50;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryCharge();
  };

  if (cartItems.length === 0 && currentStep === 'cart') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h3>
            <p className="text-gray-600 mb-6">Add some beautiful frames and gifts to get started!</p>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BusinessLogo size="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600">Complete your order</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-8">
              <div className={`flex items-center ${currentStep === 'cart' ? 'text-rose-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'cart' ? 'bg-rose-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Cart</span>
              </div>
              
              <div className={`flex items-center ${currentStep === 'details' ? 'text-rose-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'details' ? 'bg-rose-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Details</span>
              </div>
              
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-rose-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-rose-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              
              <div className={`flex items-center ${currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="ml-2 font-medium">Done</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'cart' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Your Cart ({cartItems.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                          {item.customOptions && (
                            <div className="text-xs text-gray-500 mt-1">
                              Custom: {item.customOptions.frameStyle} • {item.customOptions.size}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-lg font-bold">₹{item.price * item.quantity}</div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'details' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name"
                          value={customerDetails.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone"
                          value={customerDetails.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={customerDetails.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input 
                          id="pincode"
                          value={customerDetails.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="641035"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Complete Address *</Label>
                      <Textarea 
                        id="address"
                        value={customerDetails.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your complete address for delivery"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Delivery Option</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <Card 
                          className={`cursor-pointer transition-all ${deliveryOption === 'delivery' ? 'ring-2 ring-rose-500 bg-rose-50' : 'hover:shadow-md'}`}
                          onClick={() => setDeliveryOption('delivery')}
                        >
                          <CardContent className="p-4 text-center">
                            <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                            <h4 className="font-semibold">Home Delivery</h4>
                            <p className="text-sm text-gray-600">₹50 (Free over ₹1000)</p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer transition-all ${deliveryOption === 'pickup' ? 'ring-2 ring-rose-500 bg-rose-50' : 'hover:shadow-md'}`}
                          onClick={() => setDeliveryOption('pickup')}
                        >
                          <CardContent className="p-4 text-center">
                            <MapPin className="w-8 h-8 mx-auto mb-2 text-green-600" />
                            <h4 className="font-semibold">Store Pickup</h4>
                            <p className="text-sm text-gray-600">Free - Keeranatham Road</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                      <Textarea 
                        id="instructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any special instructions for your order..."
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${paymentMethod === 'upi' ? 'ring-2 ring-rose-500 bg-rose-50' : 'hover:shadow-md'}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <CardContent className="p-4 text-center">
                          <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <h4 className="font-semibold">UPI Payment</h4>
                          <p className="text-sm text-gray-600">Google Pay, PhonePe, etc.</p>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${paymentMethod === 'card' ? 'ring-2 ring-rose-500 bg-rose-50' : 'hover:shadow-md'}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <CardContent className="p-4 text-center">
                          <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-semibold">Card Payment</h4>
                          <p className="text-sm text-gray-600">Credit/Debit Cards</p>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${paymentMethod === 'cod' ? 'ring-2 ring-rose-500 bg-rose-50' : 'hover:shadow-md'}`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <CardContent className="p-4 text-center">
                          <Banknote className="w-8 h-8 mx-auto mb-2 text-green-600" />
                          <h4 className="font-semibold">Cash on Delivery</h4>
                          <p className="text-sm text-gray-600">Pay when delivered</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Secure Payment</h4>
                          <p className="text-blue-700 text-sm">
                            Your payment information is encrypted and secure. We never store your payment details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'confirmation' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Thank you for choosing Memories! Your order has been confirmed and we'll start working on it right away.
                  </p>
                  
                  <div className="bg-white p-6 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">We'll call you within 1 hour to confirm details</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Production will start within 24 hours</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Your order will be ready in 2-3 working days</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={onClose}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 mr-4"
                    >
                      Continue Shopping
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://wa.me/918148040148?text=Hi! I just placed an order and wanted to confirm the details.', '_blank')}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.length})</span>
                    <span>₹{getTotalPrice()}</span>
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
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{getFinalTotal()}</span>
                  </div>

                  {getTotalPrice() >= 1000 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-800 text-sm font-medium flex items-center">
                        <Gift className="w-4 h-4 mr-2" />
                        Free delivery applied!
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                    {currentStep !== 'confirmation' && (
                      <Button 
                        onClick={nextStep}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            {currentStep === 'cart' && 'Proceed to Details'}
                            {currentStep === 'details' && 'Proceed to Payment'}
                            {currentStep === 'payment' && `Place Order - ₹${getFinalTotal()}`}
                          </>
                        )}
                      </Button>
                    )}
                    
                    {currentStep !== 'cart' && currentStep !== 'confirmation' && (
                      <Button 
                        variant="outline" 
                        onClick={prevStep}
                        className="w-full"
                      >
                        Back
                      </Button>
                    )}
                  </div>

                  <div className="pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <span>Quality guaranteed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>Call +91 81480 40148 for help</span>
                    </div>
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