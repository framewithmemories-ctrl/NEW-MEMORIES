import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import axios from "axios";
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  IndianRupee,
  Truck,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Database,
  RefreshCw,
  Zap
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const SettingsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [businessSettings, setBusinessSettings] = useState({});
  const [paymentSettings, setPaymentSettings] = useState({});
  const [shippingSettings, setShippingSettings] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({});
  const [systemSettings, setSystemSettings] = useState({});
  const [themeSettings, setThemeSettings] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Mock settings data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBusinessSettings({
        business_name: 'Memories - Photo Frames & Custom Gifts',
        business_phone: '+91 81480 40148',
        business_email: 'hello@memoriesngifts.com',
        business_address: '19B Kani Illam, Keeranatham Road, Coimbatore, Tamil Nadu - 641035',
        business_hours: '9:00 AM - 9:00 PM (Mon-Sat)',
        gst_number: 'XXXXXXXXXXXXXXX',
        business_description: 'Your trusted partner for premium photo frames and personalized gifts since 2020',
        website_url: 'https://memoriesngifts.com',
        social_facebook: 'https://facebook.com/memoriesngifts',
        social_instagram: 'https://instagram.com/memoriesngifts',
        social_whatsapp: '+91 81480 40148'
      });

      setPaymentSettings({
        razorpay_enabled: true,
        razorpay_key_id: 'rzp_test_...',
        cash_on_delivery: true,
        minimum_cod_amount: 0,
        maximum_cod_amount: 10000,
        payment_gateway_fee: 2.5,
        auto_refund_enabled: false,
        refund_processing_days: 7
      });

      setShippingSettings({
        free_shipping_threshold: 1000,
        local_delivery_charge: 50,
        express_delivery_charge: 100,
        delivery_radius_km: 25,
        estimated_delivery_days: '2-3 business days',
        pickup_available: true,
        pickup_address: '19B Kani Illam, Keeranatham Road, Coimbatore',
        delivery_slots: ['9 AM - 12 PM', '12 PM - 3 PM', '3 PM - 6 PM', '6 PM - 9 PM']
      });

      setNotificationSettings({
        email_notifications: true,
        sms_notifications: false,
        whatsapp_notifications: true,
        order_confirmation_email: true,
        shipping_updates: true,
        promotional_emails: false,
        admin_order_alerts: true,
        low_stock_alerts: true,
        daily_summary_report: true
      });

      setSystemSettings({
        site_maintenance: false,
        user_registration: true,
        guest_checkout: true,
        order_auto_cancel_hours: 24,
        inventory_tracking: true,
        auto_backup_enabled: true,
        backup_frequency: 'daily',
        session_timeout_minutes: 30,
        max_upload_size_mb: 25
      });

      setThemeSettings({
        primary_color: '#FF3366',
        secondary_color: '#e02b59',
        site_logo_url: '/logo.png',
        favicon_url: '/favicon.ico',
        custom_css: '',
        show_popup_offers: true,
        popup_frequency_hours: 24,
        analytics_enabled: true,
        google_analytics_id: ''
      });

    } catch (error) {
      console.error('Settings loading error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType, data) => {
    try {
      // Save to backend
      // const response = await axios.put(`${backendUrl}/api/admin/settings/${settingsType}`, data);
      
      toast.success(`${settingsType} settings saved successfully`);
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    }
  };

  const BusinessSettingsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>Configure your business details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              value={businessSettings.business_name || ''}
              onChange={(e) => setBusinessSettings(prev => ({...prev, business_name: e.target.value}))}
            />
          </div>
          
          <div>
            <Label htmlFor="gst_number">GST Number</Label>
            <Input
              id="gst_number"
              value={businessSettings.gst_number || ''}
              onChange={(e) => setBusinessSettings(prev => ({...prev, gst_number: e.target.value}))}
              placeholder="Enter GST number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="business_phone">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </Label>
            <Input
              id="business_phone"
              value={businessSettings.business_phone || ''}
              onChange={(e) => setBusinessSettings(prev => ({...prev, business_phone: e.target.value}))}
            />
          </div>
          
          <div>
            <Label htmlFor="business_email">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </Label>
            <Input
              id="business_email"
              type="email"
              value={businessSettings.business_email || ''}
              onChange={(e) => setBusinessSettings(prev => ({...prev, business_email: e.target.value}))}
            />
          </div>
          
          <div>
            <Label htmlFor="business_hours">
              <Clock className="w-4 h-4 inline mr-2" />
              Business Hours
            </Label>
            <Input
              id="business_hours"
              value={businessSettings.business_hours || ''}
              onChange={(e) => setBusinessSettings(prev => ({...prev, business_hours: e.target.value}))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="business_address">
            <MapPin className="w-4 h-4 inline mr-2" />
            Business Address
          </Label>
          <Textarea
            id="business_address"
            value={businessSettings.business_address || ''}
            onChange={(e) => setBusinessSettings(prev => ({...prev, business_address: e.target.value}))}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="business_description">Business Description</Label>
          <Textarea
            id="business_description"
            value={businessSettings.business_description || ''}
            onChange={(e) => setBusinessSettings(prev => ({...prev, business_description: e.target.value}))}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="social_facebook">Facebook URL</Label>
            <Input
              id="social_facebook"
              value={businessSettings.social_facebook || ''}
              onChange={(e) => setBusinessSettings(prev => ({...prev, social_facebook: e.target.value}))}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          
          <div>
            <Label htmlFor="social_instagram">Instagram URL</Label>
            <Input
              id="social_instagram"
              value={businessSettings.social_instagram || ''}
              onChange={(e) => setBusinessSettings(prev => ({...prev, social_instagram: e.target.value}))}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveSettings('business', businessSettings)}>
            <Save className="w-4 h-4 mr-2" />
            Save Business Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PaymentSettingsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          <CreditCard className="w-5 h-5 inline mr-2" />
          Payment Settings
        </CardTitle>
        <CardDescription>Configure payment methods and processing options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Razorpay Integration</Label>
              <p className="text-sm text-gray-600">Enable online payments via Razorpay</p>
            </div>
            <Switch
              checked={paymentSettings.razorpay_enabled}
              onCheckedChange={(checked) => setPaymentSettings(prev => ({...prev, razorpay_enabled: checked}))}
            />
          </div>

          {paymentSettings.razorpay_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div>
                <Label htmlFor="razorpay_key">Razorpay Key ID</Label>
                <Input
                  id="razorpay_key"
                  value={paymentSettings.razorpay_key_id || ''}
                  onChange={(e) => setPaymentSettings(prev => ({...prev, razorpay_key_id: e.target.value}))}
                  placeholder="rzp_test_..."
                />
              </div>
              
              <div>
                <Label htmlFor="gateway_fee">Gateway Fee (%)</Label>
                <Input
                  id="gateway_fee"
                  type="number"
                  value={paymentSettings.payment_gateway_fee || ''}
                  onChange={(e) => setPaymentSettings(prev => ({...prev, payment_gateway_fee: parseFloat(e.target.value)}))}
                  placeholder="2.5"
                  step="0.1"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Cash on Delivery</Label>
              <p className="text-sm text-gray-600">Allow customers to pay on delivery</p>
            </div>
            <Switch
              checked={paymentSettings.cash_on_delivery}
              onCheckedChange={(checked) => setPaymentSettings(prev => ({...prev, cash_on_delivery: checked}))}
            />
          </div>

          {paymentSettings.cash_on_delivery && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div>
                <Label htmlFor="min_cod">Minimum COD Amount (₹)</Label>
                <Input
                  id="min_cod"
                  type="number"
                  value={paymentSettings.minimum_cod_amount || ''}
                  onChange={(e) => setPaymentSettings(prev => ({...prev, minimum_cod_amount: parseInt(e.target.value)}))}
                />
              </div>
              
              <div>
                <Label htmlFor="max_cod">Maximum COD Amount (₹)</Label>
                <Input
                  id="max_cod"
                  type="number"
                  value={paymentSettings.maximum_cod_amount || ''}
                  onChange={(e) => setPaymentSettings(prev => ({...prev, maximum_cod_amount: parseInt(e.target.value)}))}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Auto Refund</Label>
              <p className="text-sm text-gray-600">Automatically process refunds for cancelled orders</p>
            </div>
            <Switch
              checked={paymentSettings.auto_refund_enabled}
              onCheckedChange={(checked) => setPaymentSettings(prev => ({...prev, auto_refund_enabled: checked}))}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveSettings('payment', paymentSettings)}>
            <Save className="w-4 h-4 mr-2" />
            Save Payment Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ShippingSettingsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          <Truck className="w-5 h-5 inline mr-2" />
          Shipping & Delivery
        </CardTitle>
        <CardDescription>Configure delivery options and charges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="free_shipping">Free Shipping Above (₹)</Label>
            <Input
              id="free_shipping"
              type="number"
              value={shippingSettings.free_shipping_threshold || ''}
              onChange={(e) => setShippingSettings(prev => ({...prev, free_shipping_threshold: parseInt(e.target.value)}))}
            />
          </div>
          
          <div>
            <Label htmlFor="local_delivery">Local Delivery Charge (₹)</Label>
            <Input
              id="local_delivery"
              type="number"
              value={shippingSettings.local_delivery_charge || ''}
              onChange={(e) => setShippingSettings(prev => ({...prev, local_delivery_charge: parseInt(e.target.value)}))}
            />
          </div>
          
          <div>
            <Label htmlFor="express_delivery">Express Delivery Charge (₹)</Label>
            <Input
              id="express_delivery"
              type="number"
              value={shippingSettings.express_delivery_charge || ''}
              onChange={(e) => setShippingSettings(prev => ({...prev, express_delivery_charge: parseInt(e.target.value)}))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delivery_radius">Delivery Radius (km)</Label>
            <Input
              id="delivery_radius"
              type="number"
              value={shippingSettings.delivery_radius_km || ''}
              onChange={(e) => setShippingSettings(prev => ({...prev, delivery_radius_km: parseInt(e.target.value)}))}
            />
          </div>
          
          <div>
            <Label htmlFor="delivery_time">Estimated Delivery Time</Label>
            <Input
              id="delivery_time"
              value={shippingSettings.estimated_delivery_days || ''}
              onChange={(e) => setShippingSettings(prev => ({...prev, estimated_delivery_days: e.target.value}))}
              placeholder="2-3 business days"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-base font-medium">Store Pickup Available</Label>
              <p className="text-sm text-gray-600">Allow customers to pick up orders from store</p>
            </div>
            <Switch
              checked={shippingSettings.pickup_available}
              onCheckedChange={(checked) => setShippingSettings(prev => ({...prev, pickup_available: checked}))}
            />
          </div>

          {shippingSettings.pickup_available && (
            <div>
              <Label htmlFor="pickup_address">Pickup Address</Label>
              <Textarea
                id="pickup_address"
                value={shippingSettings.pickup_address || ''}
                onChange={(e) => setShippingSettings(prev => ({...prev, pickup_address: e.target.value}))}
                rows={2}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveSettings('shipping', shippingSettings)}>
            <Save className="w-4 h-4 mr-2" />
            Save Shipping Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const NotificationSettingsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          <Bell className="w-5 h-5 inline mr-2" />
          Notifications
        </CardTitle>
        <CardDescription>Configure email, SMS and push notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-gray-600">Send notifications via email</p>
            </div>
            <Switch
              checked={notificationSettings.email_notifications}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, email_notifications: checked}))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">WhatsApp Notifications</Label>
              <p className="text-sm text-gray-600">Send order updates via WhatsApp</p>
            </div>
            <Switch
              checked={notificationSettings.whatsapp_notifications}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, whatsapp_notifications: checked}))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Order Confirmation Emails</Label>
              <p className="text-sm text-gray-600">Send confirmation email after order placement</p>
            </div>
            <Switch
              checked={notificationSettings.order_confirmation_email}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, order_confirmation_email: checked}))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Shipping Updates</Label>
              <p className="text-sm text-gray-600">Notify customers about delivery status</p>
            </div>
            <Switch
              checked={notificationSettings.shipping_updates}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, shipping_updates: checked}))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Admin Order Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
            </div>
            <Switch
              checked={notificationSettings.admin_order_alerts}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, admin_order_alerts: checked}))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Low Stock Alerts</Label>
              <p className="text-sm text-gray-600">Get alerted when products are low in stock</p>
            </div>
            <Switch
              checked={notificationSettings.low_stock_alerts}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, low_stock_alerts: checked}))}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveSettings('notifications', notificationSettings)}>
            <Save className="w-4 h-4 mr-2" />
            Save Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings Management</h2>
          <p className="text-gray-600">Configure your website and business settings</p>
        </div>
        <Button onClick={loadSettings} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <BusinessSettingsTab />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettingsTab />
        </TabsContent>

        <TabsContent value="shipping">
          <ShippingSettingsTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;