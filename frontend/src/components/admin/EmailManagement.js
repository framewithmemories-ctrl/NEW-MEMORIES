import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus,
  RefreshCw,
  Users,
  MessageSquare,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  TrendingUp
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const EmailManagement = () => {
  const [emails, setEmails] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [sending, setSending] = useState(false);

  // Email types
  const emailTypes = [
    { value: 'welcome', label: 'Welcome Email', icon: Users },
    { value: 'order_confirmation', label: 'Order Confirmation', icon: CheckCircle },
    { value: 'shipping_notification', label: 'Shipping Notification', icon: Send },
    { value: 'newsletter', label: 'Newsletter', icon: MessageSquare },
    { value: 'promotional', label: 'Promotional', icon: TrendingUp },
    { value: 'reminder', label: 'Reminder', icon: Clock }
  ];

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      setLoading(true);
      
      // Mock email data - in production, this would come from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEmails = [
        {
          id: 'EMAIL_001',
          type: 'order_confirmation',
          recipient: 'priya.sharma@gmail.com',
          recipientName: 'Priya Sharma',
          subject: 'Order Confirmation - Memories #ORD_2024_001',
          status: 'sent',
          sentAt: '2024-01-15T10:45:00Z',
          deliveredAt: '2024-01-15T10:46:00Z',
          opened: true,
          openedAt: '2024-01-15T11:30:00Z',
          orderId: 'ORD_2024_001'
        },
        {
          id: 'EMAIL_002',
          type: 'welcome',
          recipient: 'rajesh.k@yahoo.com',
          recipientName: 'Rajesh Kumar',
          subject: 'Welcome to Memories - Photo Frames & Gifts!',
          status: 'sent',
          sentAt: '2024-01-14T16:20:00Z',
          deliveredAt: '2024-01-14T16:21:00Z',
          opened: true,
          openedAt: '2024-01-14T18:45:00Z'
        },
        {
          id: 'EMAIL_003',
          type: 'shipping_notification',
          recipient: 'anitha.reddy@hotmail.com',
          recipientName: 'Anitha Reddy',
          subject: 'Your Order is on its Way! - Tracking Info',
          status: 'sent',
          sentAt: '2024-01-13T14:30:00Z',
          deliveredAt: '2024-01-13T14:31:00Z',
          opened: false,
          orderId: 'ORD_2024_003'
        },
        {
          id: 'EMAIL_004',
          type: 'newsletter',
          recipient: 'mohammed.ali@gmail.com',
          recipientName: 'Mohammed Ali',
          subject: 'January Newsletter - New Arrivals & Special Offers',
          status: 'pending',
          scheduledFor: '2024-01-17T09:00:00Z'
        },
        {
          id: 'EMAIL_005',
          type: 'promotional',
          recipient: 'lakshmi.n@outlook.com',
          recipientName: 'Lakshmi Narayanan',
          subject: 'Special 25% OFF - Photo Frames Collection',
          status: 'failed',
          sentAt: '2024-01-12T12:00:00Z',
          error: 'Invalid email address'
        }
      ];
      
      const mockTemplates = [
        {
          id: 'welcome',
          name: 'Welcome Email',
          subject: 'Welcome to Memories - Photo Frames & Gifts!',
          content: `Dear {{customer_name}},

Welcome to Memories - Photo Frames & Custom Gifts!

We're thrilled to have you join our family of satisfied customers. At Memories, we specialize in creating beautiful, personalized photo frames and custom gifts that help you preserve your precious moments.

🎁 Special Welcome Offer:
Get 15% OFF on your first order with code: WELCOME15

📍 Visit our store:
19B Kani Illam, Keeranatham Road
Coimbatore, Tamil Nadu - 641035

📞 Call us: +91 81480 40148

Thank you for choosing Memories!

Best regards,
The Memories Team`
        },
        {
          id: 'order_confirmation',
          name: 'Order Confirmation',
          subject: 'Order Confirmation - Memories #{{order_id}}',
          content: `Dear {{customer_name}},

Thank you for your order! We're excited to create your custom items.

Order Details:
- Order ID: {{order_id}}
- Order Date: {{order_date}}
- Total Amount: ₹{{total_amount}}

Items Ordered:
{{order_items}}

Delivery Information:
- Expected delivery: {{delivery_date}}
- Delivery address: {{delivery_address}}

We'll keep you updated on your order status and send you tracking information once your items are shipped.

Thank you for choosing Memories!

Best regards,
The Memories Team`
        }
      ];
      
      setEmails(mockEmails);
      setTemplates(mockTemplates);
      
    } catch (error) {
      console.error('Email data loading error:', error);
      toast.error('Failed to load email data');
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async (emailData) => {
    try {
      setSending(true);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would call the real backend API
      // const response = await axios.post(`${backendUrl}/api/admin/send-notification`, emailData);
      
      toast.success('Email sent successfully!');
      setShowComposeDialog(false);
      
    } catch (error) {
      console.error('Send email error:', error);
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateEmailStats = () => {
    const totalEmails = emails.length;
    const sentEmails = emails.filter(e => e.status === 'sent').length;
    const openedEmails = emails.filter(e => e.opened).length;
    const failedEmails = emails.filter(e => e.status === 'failed').length;
    
    return {
      totalEmails,
      sentEmails,
      openRate: sentEmails > 0 ? ((openedEmails / sentEmails) * 100).toFixed(1) : 0,
      failedEmails
    };
  };

  const stats = calculateEmailStats();

  const ComposeEmailForm = () => {
    const [emailData, setEmailData] = useState({
      type: selectedTemplate,
      recipient: '',
      subject: '',
      content: templates.find(t => t.id === selectedTemplate)?.content || ''
    });

    const handleTemplateChange = (templateId) => {
      const template = templates.find(t => t.id === templateId);
      setSelectedTemplate(templateId);
      setEmailData({
        ...emailData,
        type: templateId,
        subject: template?.subject || '',
        content: template?.content || ''
      });
    };

    const handleSend = (e) => {
      e.preventDefault();
      sendTestEmail(emailData);
    };

    return (
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <Label htmlFor="template">Email Template</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {emailTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="recipient">Recipient Email</Label>
          <Input
            id="recipient"
            type="email"
            value={emailData.recipient}
            onChange={(e) => setEmailData({...emailData, recipient: e.target.value})}
            placeholder="customer@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            value={emailData.subject}
            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            placeholder="Enter email subject"
            required
          />
        </div>

        <div>
          <Label htmlFor="content">Email Content</Label>
          <Textarea
            id="content"
            value={emailData.content}
            onChange={(e) => setEmailData({...emailData, content: e.target.value})}
            placeholder="Enter email content..."
            rows={10}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use variables like {{customer_name}}, {{order_id}}, etc. for personalization
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setShowComposeDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={sending}>
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Management</h2>
          <p className="text-gray-600">Send and manage customer email communications</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadEmailData} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowComposeDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Compose Email
          </Button>
        </div>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmails}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12</span>
              <span className="text-gray-600 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sentEmails}</p>
              </div>
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">Successfully delivered</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">Above average</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Emails</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failedEmails}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Need attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sent">Email History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email History ({emails.length})</CardTitle>
              <CardDescription>All sent and scheduled emails</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading emails...</p>
                </div>
              ) : emails.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No emails found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emails.map((email) => (
                    <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{email.subject}</h3>
                            <p className="text-sm text-gray-600">To: {email.recipientName} ({email.recipient})</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(email.status)}>
                            {getStatusIcon(email.status)}
                            <span className="ml-1 capitalize">{email.status}</span>
                          </Badge>
                          {email.opened && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              <Eye className="w-3 h-3 mr-1" />
                              Opened
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            Type: {emailTypes.find(t => t.value === email.type)?.label || email.type}
                          </p>
                          {email.orderId && (
                            <p className="text-gray-600">Order: {email.orderId}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600">
                            {email.sentAt ? `Sent: ${formatDate(email.sentAt)}` : 
                             email.scheduledFor ? `Scheduled: ${formatDate(email.scheduledFor)}` : 
                             'Not scheduled'}
                          </p>
                          {email.deliveredAt && (
                            <p className="text-gray-600">Delivered: {formatDate(email.deliveredAt)}</p>
                          )}
                        </div>
                        <div>
                          {email.openedAt && (
                            <p className="text-gray-600">Opened: {formatDate(email.openedAt)}</p>
                          )}
                          {email.error && (
                            <p className="text-red-600">Error: {email.error}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage your email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Subject: {template.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-3">{template.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Analytics Coming Soon</h3>
                <p className="text-gray-600">Detailed email performance analytics will be available in Phase 2</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compose Email Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
            <DialogDescription>
              Send emails to customers using predefined templates
            </DialogDescription>
          </DialogHeader>
          <ComposeEmailForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailManagement;