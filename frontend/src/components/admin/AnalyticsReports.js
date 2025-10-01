import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import axios from "axios";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  ShoppingCart, 
  IndianRupee, 
  Calendar, 
  Download, 
  Filter,
  Eye,
  RefreshCw,
  PieChart,
  LineChart,
  Target,
  Award,
  Star,
  Clock,
  MapPin
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const AnalyticsReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [salesData, setSalesData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [productData, setProductData] = useState({});
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock analytics data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSalesData({
        total_revenue: 156750,
        total_orders: 127,
        average_order_value: 1234,
        conversion_rate: 3.2,
        revenue_growth: 15.8,
        orders_growth: 12.5,
        daily_sales: [
          { date: '2024-01-15', revenue: 5200, orders: 4 },
          { date: '2024-01-16', revenue: 7800, orders: 6 },
          { date: '2024-01-17', revenue: 4200, orders: 3 },
          { date: '2024-01-18', revenue: 9600, orders: 8 },
          { date: '2024-01-19', revenue: 6400, orders: 5 },
          { date: '2024-01-20', revenue: 11200, orders: 9 },
          { date: '2024-01-21', revenue: 8800, orders: 7 }
        ],
        top_selling_products: [
          { name: 'Wooden Photo Frame 12x16', sales: 45, revenue: 58500 },
          { name: 'Acrylic Frame 8x10', sales: 32, revenue: 38400 },
          { name: 'Custom Gift Frame Set', sales: 28, revenue: 42000 },
          { name: 'Wedding Album Collection', sales: 22, revenue: 33000 }
        ]
      });

      setCustomerData({
        total_customers: 89,
        new_customers: 12,
        returning_customers: 34,
        customer_retention_rate: 38.2,
        average_customer_value: 1762,
        customer_growth: 8.5,
        top_customers: [
          { name: 'Priya Sharma', orders: 8, spent: 15750 },
          { name: 'Rajesh Kumar', orders: 6, spent: 12400 },
          { name: 'Anitha Reddy', orders: 5, spent: 9800 },
          { name: 'Mohammed Ali', orders: 4, spent: 8600 }
        ],
        customer_locations: [
          { city: 'Coimbatore', customers: 45, percentage: 50.6 },
          { city: 'Erode', customers: 18, percentage: 20.2 },
          { city: 'Salem', customers: 12, percentage: 13.5 },
          { city: 'Tirupur', customers: 9, percentage: 10.1 },
          { city: 'Others', customers: 5, percentage: 5.6 }
        ]
      });

      setProductData({
        total_products: 156,
        low_stock_products: 8,
        out_of_stock: 2,
        top_categories: [
          { category: 'Photo Frames', products: 85, sales_percentage: 68.5 },
          { category: 'Custom Gifts', products: 41, sales_percentage: 22.1 },
          { category: 'Corporate Gifts', products: 20, sales_percentage: 6.8 },
          { category: 'Wedding Collection', products: 10, sales_percentage: 2.6 }
        ],
        inventory_value: 245600,
        product_ratings: {
          average_rating: 4.7,
          total_reviews: 234,
          five_star: 180,
          four_star: 38,
          three_star: 12,
          two_star: 3,
          one_star: 1
        }
      });

      setPerformanceMetrics({
        website_visitors: 2840,
        bounce_rate: 32.5,
        session_duration: '4:32',
        page_views: 12560,
        mobile_visitors: 68.2,
        traffic_sources: [
          { source: 'Organic Search', visitors: 1420, percentage: 50.0 },
          { source: 'Direct', visitors: 568, percentage: 20.0 },
          { source: 'Social Media', visitors: 426, percentage: 15.0 },
          { source: 'Referral', visitors: 284, percentage: 10.0 },
          { source: 'Paid Ads', visitors: 142, percentage: 5.0 }
        ]
      });

    } catch (error) {
      console.error('Analytics loading error:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (reportType) => {
    try {
      toast.success(`Exporting ${reportType} report...`);
      // Implementation for report export
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (value, showSign = true) => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const SalesOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.total_revenue)}</p>
              </div>
              <IndianRupee className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">{formatPercentage(salesData.revenue_growth)}</span>
              <span className="text-gray-600 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{salesData.total_orders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">{formatPercentage(salesData.orders_growth)}</span>
              <span className="text-gray-600 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.average_order_value)}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Per order average</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(salesData.conversion_rate, false)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-rose-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Visitor to customer</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Best performing products in selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.top_selling_products?.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CustomerAnalytics = () => (
    <div className="space-y-6">
      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerData.total_customers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerData.new_customers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(customerData.customer_retention_rate, false)}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Customer Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(customerData.average_customer_value)}</p>
              </div>
              <IndianRupee className="w-8 h-8 text-rose-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest value customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerData.top_customers?.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.orders} orders</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(customer.spent)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Locations</CardTitle>
            <CardDescription>Geographic distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerData.customer_locations?.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{location.city}</p>
                      <p className="text-sm text-gray-600">{location.customers} customers</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{formatPercentage(location.percentage, false)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ProductAnalytics = () => (
    <div className="space-y-6">
      {/* Product Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{productData.total_products}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(productData.inventory_value)}</p>
              </div>
              <IndianRupee className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{productData.low_stock_products}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{productData.product_ratings?.average_rating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Sales distribution by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productData.top_categories?.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{category.category}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{category.products} products</span>
                    <span className="font-semibold">{formatPercentage(category.sales_percentage, false)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full" 
                    style={{ width: `${category.sales_percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalyticsData} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => exportReport('full')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <SalesOverview />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="products">
          <ProductAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsReports;