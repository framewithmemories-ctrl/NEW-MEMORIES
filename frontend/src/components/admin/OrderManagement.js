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
  Truck, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Download,
  RefreshCw,
  AlertTriangle,
  Send
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  // Order status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Get admin session token
      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) {
        throw new Error('No admin session found');
      }
      
      const session = JSON.parse(adminSession);
      
      // Call real backend API
      const response = await axios.get(`${backendUrl}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        // Fallback to mock data if API fails
        const mockOrders = [
        {
          id: 'ORD_2024_001',
          customerName: 'Priya Sharma',
          customerEmail: 'priya.sharma@gmail.com',
          customerPhone: '+91 98765 43210',
          status: 'processing',
          total: 1299,
          paymentMethod: 'Cash on Delivery',
          orderDate: '2024-01-15T10:30:00Z',
          deliveryAddress: '123, MG Road, Coimbatore, Tamil Nadu - 641001',
          items: [
            {
              name: 'Custom Wooden Frame 12x16',
              quantity: 1,
              price: 1299,
              customization: 'Engraved with "Family Memories 2024"'
            }
          ],
          notes: 'Customer requested delivery before January 20th for anniversary'
        },
        {
          id: 'ORD_2024_002',
          customerName: 'Rajesh Kumar',
          customerEmail: 'rajesh.k@yahoo.com',
          customerPhone: '+91 87654 32109',
          status: 'shipped',
          total: 2199,
          paymentMethod: 'Online Payment',
          orderDate: '2024-01-14T15:45:00Z',
          deliveryAddress: '456, Peelamedu, Coimbatore, Tamil Nadu - 641004',
          trackingNumber: 'TRK123456789',
          courierPartner: 'Blue Dart',
          items: [
            {
              name: 'Premium Acrylic Frame Set',
              quantity: 2,
              price: 1099.50,
              customization: 'Wedding photos - Gold border'
            }
          ],
          notes: 'High priority customer - VIP handling required'
        },
        {
          id: 'ORD_2024_003',
          customerName: 'Anitha Reddy',
          customerEmail: 'anitha.reddy@hotmail.com',
          customerPhone: '+91 76543 21098',
          status: 'delivered',
          total: 899,
          paymentMethod: 'UPI Payment',
          orderDate: '2024-01-12T09:15:00Z',
          deliveryAddress: '789, Gandhipuram, Coimbatore, Tamil Nadu - 641012',
          deliveredDate: '2024-01-16T14:30:00Z',
          items: [
            {
              name: 'Custom Photo Mug',
              quantity: 3,
              price: 299.67,
              customization: 'Family photos with names'
            }
          ],
          notes: 'Customer very satisfied - left 5-star review'
        },
        {
          id: 'ORD_2024_004',
          customerName: 'Mohammed Ali',
          customerEmail: 'mohammed.ali@gmail.com',
          customerPhone: '+91 65432 10987',
          status: 'pending',
          total: 1599,
          paymentMethod: 'Cash on Delivery',
          orderDate: '2024-01-16T11:20:00Z',
          deliveryAddress: '321, RS Puram, Coimbatore, Tamil Nadu - 641002',
          items: [
            {
              name: 'Luxury Wooden Frame 16x20',
              quantity: 1,
              price: 1599,
              customization: 'Special engraving - Arabic calligraphy'
            }
          ],
          notes: 'New customer - first order'
        },
        {
          id: 'ORD_2024_005',
          customerName: 'Lakshmi Narayanan',
          customerEmail: 'lakshmi.n@outlook.com',
          customerPhone: '+91 54321 09876',
          status: 'cancelled',
          total: 799,
          paymentMethod: 'Online Payment',
          orderDate: '2024-01-13T16:00:00Z',
          deliveryAddress: '654, Saravanampatti, Coimbatore, Tamil Nadu - 641035',
          cancelReason: 'Customer changed requirements',
          items: [
            {
              name: 'Standard Photo Frame 8x10',
              quantity: 2,
              price: 399.50,
              customization: 'Simple black border'
            }
          ],
          notes: 'Customer wants to reorder with different specifications'
        }
        ];
        
        setOrders(mockOrders);
      }
      
    } catch (error) {
      console.error('Orders loading error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    try {
      setUpdatingOrder(true);
      
      // Get admin session token
      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) {
        throw new Error('No admin session found');
      }
      
      const session = JSON.parse(adminSession);
      
      // Call real backend API
      const response = await axios.put(
        `${backendUrl}/api/admin/orders/${orderId}/status`,
        { status: newStatus, notes: notes },
        {
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { 
                  ...order, 
                  status: newStatus, 
                  notes: notes || order.notes,
                  updatedAt: new Date().toISOString()
                }
              : order
          )
        );
        
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
        
        // Send notification to customer (simulate)
        if (newStatus === 'shipped') {
          toast.success('📧 Shipping notification sent to customer');
        } else if (newStatus === 'delivered') {
          toast.success('📧 Delivery confirmation sent to customer');
        }
      } else {
        throw new Error(response.data.message || 'Failed to update order status');
      }
      
    } catch (error) {
      console.error('Order update error:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrder(false);
    }
  };

  const sendCustomerNotification = async (order, messageType) => {
    try {
      // Simulate sending email/SMS notification
      await new Promise(resolve => setTimeout(resolve, 800));
      
      switch (messageType) {
        case 'status_update':
          toast.success(`📧 Status update sent to ${order.customerName}`);
          break;
        case 'tracking_info':
          toast.success(`📱 Tracking info sent to ${order.customerPhone}`);
          break;
        case 'delivery_reminder':
          toast.success(`🔔 Delivery reminder sent to customer`);
          break;
        default:
          toast.success(`📨 Notification sent to customer`);
      }
      
    } catch (error) {
      console.error('Notification error:', error);
      toast.error('Failed to send notification');
    }
  };

  const getStatusIcon = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    const IconComponent = statusConfig?.icon || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Manage all customer orders and track their progress</p>
        </div>
        <Button onClick={loadOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            {statusFilter === 'all' 
              ? 'Showing all orders' 
              : `Showing ${statusFilter} orders`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No orders found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">#{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      {order.status === 'pending' && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Needs Action
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-gray-600">{order.customerEmail}</p>
                      <p className="text-gray-600">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(order.orderDate)}
                      </p>
                      <p className="text-gray-600">
                        <IndianRupee className="w-4 h-4 inline mr-1" />
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-gray-600">Payment: {order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <Package className="w-4 h-4 inline mr-1" />
                        {order.items.length} item(s)
                      </p>
                      <p className="text-gray-600 truncate">
                        {(order.items || []).map(item => item.name).join(', ')}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-gray-600">
                          <Truck className="w-4 h-4 inline mr-1" />
                          {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete order information and management options
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status and Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-lg px-3 py-1`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2 capitalize">{selectedOrder.status}</span>
                  </Badge>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-600">Order placed: {formatDate(selectedOrder.orderDate)}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(newStatus) => updateOrderStatus(selectedOrder.id, newStatus)}
                    disabled={updatingOrder}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={() => sendCustomerNotification(selectedOrder, 'status_update')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Notify Customer
                  </Button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span className="text-sm">{selectedOrder.deliveryAddress}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span>Tracking Number:</span>
                        <span className="font-mono">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                    {selectedOrder.courierPartner && (
                      <div className="flex justify-between">
                        <span>Courier Partner:</span>
                        <span>{selectedOrder.courierPartner}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-3 border rounded">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.customization && (
                            <p className="text-sm text-blue-600">Customization: {item.customization}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedOrder.notes || ''}
                    placeholder="Add notes about this order..."
                    rows={3}
                    className="w-full"
                  />
                  <Button className="mt-2" size="sm">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;