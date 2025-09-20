import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import AdminLogin from "./AdminLogin";
import OrderManagement from "./OrderManagement";
import CustomerManagement from "./CustomerManagement";
import ProductManagement from "./ProductManagement";
import EmailManagement from "./EmailManagement";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Mail, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  IndianRupee,
  Eye,
  Filter
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayOrders: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing admin session
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        // Session expires after 24 hours
        if (hoursDiff < 24) {
          setAdminUser({
            email: session.email,
            name: 'Admin User',
            permissions: session.permissions || []
          });
          setIsLoggedIn(true);
          loadDashboardData();
        } else {
          // Session expired
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        console.error('Session validation error:', error);
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setAdminUser(userData);
    setIsLoggedIn(true);
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setAdminUser(null);
    setIsLoggedIn(false);
    toast.success('Successfully logged out');
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, these would be actual API calls
      // For now, we'll use mock data that simulates real admin dashboard stats
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock dashboard statistics
      const mockStats = {
        totalOrders: 127,
        totalCustomers: 89,
        totalRevenue: 156750,
        pendingOrders: 12,
        todayOrders: 8,
        recentOrders: [
          {
            id: 'ORD_001',
            customerName: 'Priya Sharma',
            total: 1299,
            status: 'processing',
            date: new Date().toISOString(),
            items: ['Custom Wooden Frame 12x16']
          },
          {
            id: 'ORD_002', 
            customerName: 'Rajesh Kumar',
            total: 899,
            status: 'shipped',
            date: new Date(Date.now() - 86400000).toISOString(),
            items: ['Acrylic Photo Frame 8x10']
          },
          {
            id: 'ORD_003',
            customerName: 'Anitha Reddy',
            total: 2199,
            status: 'delivered',
            date: new Date(Date.now() - 172800000).toISOString(),
            items: ['Premium Wooden Frame Set']
          }
        ],
        topProducts: [
          { name: 'Wooden Photo Frames', sales: 45, revenue: 58500 },
          { name: 'Acrylic Frames', sales: 32, revenue: 38400 },
          { name: 'Custom Gift Frames', sales: 28, revenue: 42000 },
          { name: 'Wedding Photo Albums', sales: 22, revenue: 33000 }
        ]
      };
      
      setDashboardStats(mockStats);
      
    } catch (error) {
      console.error('Dashboard data loading error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-rose-600 rounded-lg p-2">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Memories Admin Panel</h1>
              <p className="text-sm text-gray-600">Photo Frames & Custom Gifts Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{adminUser?.name}</p>
              <p className="text-sm text-gray-600">{adminUser?.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="grid w-full grid-cols-1 gap-2 h-auto bg-transparent">
                <TabsTrigger 
                  value="dashboard" 
                  className="w-full justify-start data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="w-full justify-start data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Orders
                  {dashboardStats.pendingOrders > 0 && (
                    <Badge className="ml-auto bg-red-500">{dashboardStats.pendingOrders}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="customers" 
                  className="w-full justify-start data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Customers
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="w-full justify-start data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger 
                  value="emails" 
                  className="w-full justify-start data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Center
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="w-full justify-start data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="w-full justify-start data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
                        </div>
                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500">+12%</span>
                        <span className="text-gray-600 ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalCustomers}</p>
                        </div>
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500">+8%</span>
                        <span className="text-gray-600 ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardStats.totalRevenue)}</p>
                        </div>
                        <IndianRupee className="w-8 h-8 text-rose-600" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500">+15%</span>
                        <span className="text-gray-600 ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-600">Requires attention</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders and Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardStats.recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">#{order.id}</h4>
                                  <p className="text-sm text-gray-600">{order.customerName}</p>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{order.items.join(', ')}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('orders')}>
                        <Eye className="w-4 h-4 mr-2" />
                        View All Orders
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Top Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Products</CardTitle>
                      <CardDescription>Best selling products this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardStats.topProducts.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="bg-rose-100 rounded-full w-8 h-8 flex items-center justify-center">
                                <span className="text-sm font-bold text-rose-600">#{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-600">{product.sales} sold</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                              <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('products')}>
                        <Package className="w-4 h-4 mr-2" />
                        Manage Products
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Orders Management */}
            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            {/* Customers Management */}
            <TabsContent value="customers">
              <CustomerManagement />
            </TabsContent>

            {/* Products Management */}
            <TabsContent value="products">
              <ProductManagement />
            </TabsContent>

            {/* Email Management */}
            <TabsContent value="emails">
              <EmailManagement />
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics Coming Soon</h3>
                      <p className="text-gray-600">Detailed analytics and reporting features will be available in Phase 2</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Panel Coming Soon</h3>
                      <p className="text-gray-600">Admin configuration settings will be available in Phase 2</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;