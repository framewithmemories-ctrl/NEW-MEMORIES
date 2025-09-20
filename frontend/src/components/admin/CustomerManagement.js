import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { 
  Search, 
  Users, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingCart, 
  IndianRupee,
  Star,
  Gift,
  Clock,
  TrendingUp,
  UserPlus,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      
      // Mock comprehensive customer data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCustomers = [
        {
          id: 'CUST_001',
          name: 'Priya Sharma',
          email: 'priya.sharma@gmail.com',
          phone: '+91 98765 43210',
          address: '123, MG Road, Coimbatore, Tamil Nadu - 641001',
          joinDate: '2024-01-10T00:00:00Z',
          totalOrders: 3,
          totalSpent: 3897,
          tier: 'Gold',
          lastOrderDate: '2024-01-15T10:30:00Z',
          status: 'active',
          preferences: {
            newsletter: true,
            sms: false,
            whatsapp: true
          },
          orders: [
            {
              id: 'ORD_2024_001',
              date: '2024-01-15T10:30:00Z',
              total: 1299,
              status: 'processing',
              items: ['Custom Wooden Frame 12x16']
            },
            {
              id: 'ORD_2024_007',
              date: '2024-01-12T14:20:00Z',
              total: 1599,
              status: 'delivered',
              items: ['Premium Photo Album']
            },
            {
              id: 'ORD_2024_012',
              date: '2024-01-08T09:15:00Z',
              total: 999,
              status: 'delivered',
              items: ['Custom Mug Set']
            }
          ],
          notes: 'VIP customer - Always requests premium packaging'
        },
        {
          id: 'CUST_002',
          name: 'Rajesh Kumar',
          email: 'rajesh.k@yahoo.com',
          phone: '+91 87654 32109',
          address: '456, Peelamedu, Coimbatore, Tamil Nadu - 641004',
          joinDate: '2024-01-05T00:00:00Z',
          totalOrders: 5,
          totalSpent: 6245,
          tier: 'Platinum',
          lastOrderDate: '2024-01-14T15:45:00Z',
          status: 'active',
          preferences: {
            newsletter: true,
            sms: true,
            whatsapp: true
          },
          orders: [
            {
              id: 'ORD_2024_002',
              date: '2024-01-14T15:45:00Z',
              total: 2199,
              status: 'shipped',
              items: ['Premium Acrylic Frame Set']
            }
          ],
          notes: 'Corporate client - Bulk orders for office gifts'
        },
        {
          id: 'CUST_003',
          name: 'Anitha Reddy',
          email: 'anitha.reddy@hotmail.com',
          phone: '+91 76543 21098',
          address: '789, Gandhipuram, Coimbatore, Tamil Nadu - 641012',
          joinDate: '2023-12-20T00:00:00Z',
          totalOrders: 2,
          totalSpent: 1698,
          tier: 'Silver',
          lastOrderDate: '2024-01-12T09:15:00Z',
          status: 'active',
          preferences: {
            newsletter: false,
            sms: false,
            whatsapp: true
          },
          orders: [
            {
              id: 'ORD_2024_003',
              date: '2024-01-12T09:15:00Z',
              total: 899,
              status: 'delivered',
              items: ['Custom Photo Mug x3']
            }
          ],
          notes: 'Very satisfied customer - Left excellent reviews'
        },
        {
          id: 'CUST_004',
          name: 'Mohammed Ali',
          email: 'mohammed.ali@gmail.com',
          phone: '+91 65432 10987',
          address: '321, RS Puram, Coimbatore, Tamil Nadu - 641002',
          joinDate: '2024-01-16T00:00:00Z',
          totalOrders: 1,
          totalSpent: 1599,
          tier: 'Bronze',
          lastOrderDate: '2024-01-16T11:20:00Z',
          status: 'active',
          preferences: {
            newsletter: true,
            sms: false,
            whatsapp: false
          },
          orders: [
            {
              id: 'ORD_2024_004',
              date: '2024-01-16T11:20:00Z',
              total: 1599,
              status: 'pending',
              items: ['Luxury Wooden Frame 16x20']
            }
          ],
          notes: 'New customer - First order with special requirements'
        },
        {
          id: 'CUST_005',
          name: 'Lakshmi Narayanan',
          email: 'lakshmi.n@outlook.com',
          phone: '+91 54321 09876',
          address: '654, Saravanampatti, Coimbatore, Tamil Nadu - 641035',
          joinDate: '2024-01-13T00:00:00Z',
          totalOrders: 1,
          totalSpent: 0, // Cancelled order
          tier: 'Bronze',
          lastOrderDate: '2024-01-13T16:00:00Z',
          status: 'inactive',
          preferences: {
            newsletter: false,
            sms: false,
            whatsapp: false
          },
          orders: [
            {
              id: 'ORD_2024_005',
              date: '2024-01-13T16:00:00Z',
              total: 799,
              status: 'cancelled',
              items: ['Standard Photo Frame 8x10 x2']
            }
          ],
          notes: 'Cancelled order - Wants to reorder with different specs'
        }
      ];
      
      setCustomers(mockCustomers);
      
    } catch (error) {
      console.error('Customers loading error:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;
    
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCustomers(filtered);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
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

  const calculateCustomerMetrics = () => {
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;
    const newCustomersThisMonth = customers.filter(c => {
      const joinDate = new Date(c.joinDate);
      const thisMonth = new Date();
      return joinDate.getMonth() === thisMonth.getMonth() && 
             joinDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    return {
      activeCustomers,
      totalRevenue,
      avgOrderValue,
      newCustomersThisMonth
    };
  };

  const metrics = calculateCustomerMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage customer relationships and view detailed profiles</p>
        </div>
        <Button onClick={loadCustomers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+{metrics.newCustomersThisMonth}</span>
              <span className="text-gray-600 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <IndianRupee className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+18%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgOrderValue)}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.newCustomersThisMonth}</p>
              </div>
              <UserPlus className="w-8 h-8 text-rose-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Clock className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-gray-600">This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers by name, email, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>All registered customers and their details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No customers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-rose-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="font-bold text-rose-600">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-600">ID: {customer.id}</p>
                      </div>
                      <Badge className={getTierColor(customer.tier)}>
                        <Star className="w-3 h-3 mr-1" />
                        {customer.tier}
                      </Badge>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCustomer(customer);
                        setShowCustomerDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <Mail className="w-4 h-4 inline mr-1" />
                        {customer.email}
                      </p>
                      <p className="text-gray-600">
                        <Phone className="w-4 h-4 inline mr-1" />
                        {customer.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Joined: {formatDate(customer.joinDate)}
                      </p>
                      <p className="text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Last order: {formatDate(customer.lastOrderDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <ShoppingCart className="w-4 h-4 inline mr-1" />
                        {customer.totalOrders} orders
                      </p>
                      <p className="text-gray-600">
                        <IndianRupee className="w-4 h-4 inline mr-1" />
                        {formatCurrency(customer.totalSpent)} spent
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 truncate">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {customer.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Complete customer information and order history
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                        <p className="text-gray-900">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p className="text-gray-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Phone</Label>
                        <p className="text-gray-900">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Address</Label>
                        <p className="text-gray-900 text-sm">{selectedCustomer.address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer Tier:</span>
                        <Badge className={getTierColor(selectedCustomer.tier)}>
                          {selectedCustomer.tier}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(selectedCustomer.status)}>
                          {selectedCustomer.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Join Date:</span>
                        <span>{formatDate(selectedCustomer.joinDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Orders:</span>
                        <span className="font-semibold">{selectedCustomer.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Spent:</span>
                        <span className="font-semibold">{formatCurrency(selectedCustomer.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Order Value:</span>
                        <span className="font-semibold">
                          {formatCurrency(selectedCustomer.totalSpent / (selectedCustomer.totalOrders || 1))}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {selectedCustomer.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 italic">"{selectedCustomer.notes}"</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="orders" className="space-y-4">
                <div className="space-y-4">
                  {selectedCustomer.orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">#{order.id}</h4>
                          <Badge className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Date: {formatDate(order.date)}</p>
                            <p className="text-gray-600">Items: {order.items.join(', ')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Communication Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>Email Newsletter</span>
                      </div>
                      <Badge variant={selectedCustomer.preferences.newsletter ? "default" : "secondary"}>
                        {selectedCustomer.preferences.newsletter ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span>SMS Notifications</span>
                      </div>
                      <Badge variant={selectedCustomer.preferences.sms ? "default" : "secondary"}>
                        {selectedCustomer.preferences.sms ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-purple-500" />
                        <span>WhatsApp Updates</span>
                      </div>
                      <Badge variant={selectedCustomer.preferences.whatsapp ? "default" : "secondary"}>
                        {selectedCustomer.preferences.whatsapp ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;