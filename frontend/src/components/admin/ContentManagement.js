import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import axios from "axios";
import { 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Eye, 
  Edit3, 
  Plus,
  Save,
  Trash2,
  Upload,
  Globe,
  Megaphone,
  Tag,
  Calendar,
  BarChart3,
  RefreshCw
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const ContentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [websiteContent, setWebsiteContent] = useState({});
  const [banners, setBanners] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [seoSettings, setSeoSettings] = useState({});
  const [socialMedia, setSocialMedia] = useState({});

  // Content states
  const [editingContent, setEditingContent] = useState(null);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    is_active: true,
    position: 'header'
  });

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    try {
      setLoading(true);
      
      // Load website content, banners, promotions
      // For now using mock data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebsiteContent({
        hero_title: "Create Beautiful Memories with Custom Photo Frames",
        hero_subtitle: "Premium photo frames and personalized gifts",
        about_description: "Your trusted partner for premium photo frames and personalized gifts since 2020",
        contact_phone: "+91 81480 40148",
        contact_email: "hello@memoriesngifts.com",
        business_address: "19B Kani Illam, Keeranatham Road, Coimbatore, Tamil Nadu - 641035"
      });

      setBanners([
        {
          id: 'BAN_001',
          title: 'Grand Opening Offer',
          description: '25% OFF on all photo frames',
          image_url: '/api/placeholder/800/200',
          link_url: '/shop',
          position: 'header',
          is_active: true,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 'BAN_002', 
          title: 'Free Delivery',
          description: 'Free home delivery on orders above ₹1000',
          image_url: '/api/placeholder/800/200',
          link_url: '/delivery',
          position: 'footer',
          is_active: true,
          created_at: '2024-01-14T15:20:00Z'
        }
      ]);

      setPromotions([
        {
          id: 'PROMO_001',
          code: 'WELCOME25',
          title: 'Welcome Offer',
          description: '25% off on first order',
          discount_type: 'percentage',
          discount_value: 25,
          min_order_amount: 500,
          max_uses: 100,
          is_active: true,
          expires_at: '2024-12-31T23:59:59Z'
        }
      ]);

      setSeoSettings({
        site_title: 'Memories - Photo Frames & Custom Gifts | Coimbatore',
        meta_description: 'Premium photo frames and personalized gifts in Coimbatore. Custom wooden frames, acrylic frames, corporate gifts with free home delivery.',
        meta_keywords: 'photo frames coimbatore, custom gifts, personalized frames, wooden frames, acrylic frames',
        og_title: 'Memories - Photo Frames & Custom Gifts',
        og_description: 'Create beautiful memories with our premium photo frames and personalized gifts.',
        og_image: '/api/placeholder/1200/630'
      });

    } catch (error) {
      console.error('Content loading error:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const saveWebsiteContent = async (contentData) => {
    try {
      // Save to backend
      // const response = await axios.put(`${backendUrl}/api/admin/content/website`, contentData);
      
      setWebsiteContent(contentData);
      toast.success('Website content updated successfully');
    } catch (error) {
      console.error('Save content error:', error);
      toast.error('Failed to save content');
    }
  };

  const createBanner = async (bannerData) => {
    try {
      const newBanner = {
        ...bannerData,
        id: `BAN_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      setBanners(prev => [newBanner, ...prev]);
      toast.success('Banner created successfully');
      setShowContentDialog(false);
      setNewBanner({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        is_active: true,
        position: 'header'
      });
    } catch (error) {
      console.error('Create banner error:', error);
      toast.error('Failed to create banner');
    }
  };

  const toggleBannerStatus = async (bannerId, isActive) => {
    try {
      setBanners(prev => 
        prev.map(banner => 
          banner.id === bannerId ? { ...banner, is_active: isActive } : banner
        )
      );
      toast.success(`Banner ${isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Toggle banner error:', error);
      toast.error('Failed to update banner');
    }
  };

  const WebsiteContentEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Website Content</CardTitle>
        <CardDescription>Edit main website content and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              value={websiteContent.hero_title || ''}
              onChange={(e) => setWebsiteContent(prev => ({...prev, hero_title: e.target.value}))}
              placeholder="Main headline for homepage"
            />
          </div>
          
          <div>
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Input
              id="hero_subtitle"
              value={websiteContent.hero_subtitle || ''}
              onChange={(e) => setWebsiteContent(prev => ({...prev, hero_subtitle: e.target.value}))}
              placeholder="Subtitle for homepage"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="about_description">About Description</Label>
          <Textarea
            id="about_description"
            value={websiteContent.about_description || ''}
            onChange={(e) => setWebsiteContent(prev => ({...prev, about_description: e.target.value}))}
            placeholder="Company description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="contact_phone">Phone</Label>
            <Input
              id="contact_phone"
              value={websiteContent.contact_phone || ''}
              onChange={(e) => setWebsiteContent(prev => ({...prev, contact_phone: e.target.value}))}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          
          <div>
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              value={websiteContent.contact_email || ''}
              onChange={(e) => setWebsiteContent(prev => ({...prev, contact_email: e.target.value}))}
              placeholder="contact@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="business_address">Address</Label>
            <Input
              id="business_address"
              value={websiteContent.business_address || ''}
              onChange={(e) => setWebsiteContent(prev => ({...prev, business_address: e.target.value}))}
              placeholder="Business address"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveWebsiteContent(websiteContent)}>
            <Save className="w-4 h-4 mr-2" />
            Save Content
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const BannerManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Banner Management</CardTitle>
            <CardDescription>Manage promotional banners and announcements</CardDescription>
          </div>
          <Button onClick={() => setShowContentDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold">{banner.title}</h3>
                    <Badge variant={banner.is_active ? "default" : "secondary"}>
                      {banner.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{banner.position}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={banner.is_active}
                      onCheckedChange={(checked) => toggleBannerStatus(banner.id, checked)}
                    />
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                {banner.image_url && (
                  <img 
                    src={banner.image_url} 
                    alt={banner.title}
                    className="w-full h-20 object-cover rounded border"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SEOSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>Optimize website for search engines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="site_title">Site Title</Label>
          <Input
            id="site_title"
            value={seoSettings.site_title || ''}
            onChange={(e) => setSeoSettings(prev => ({...prev, site_title: e.target.value}))}
            placeholder="Website title for search results"
          />
        </div>
        
        <div>
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={seoSettings.meta_description || ''}
            onChange={(e) => setSeoSettings(prev => ({...prev, meta_description: e.target.value}))}
            placeholder="Description for search results (150-160 characters)"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="meta_keywords">Meta Keywords</Label>
          <Input
            id="meta_keywords"
            value={seoSettings.meta_keywords || ''}
            onChange={(e) => setSeoSettings(prev => ({...prev, meta_keywords: e.target.value}))}
            placeholder="Comma-separated keywords"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="og_title">Open Graph Title</Label>
            <Input
              id="og_title"
              value={seoSettings.og_title || ''}
              onChange={(e) => setSeoSettings(prev => ({...prev, og_title: e.target.value}))}
              placeholder="Title for social media sharing"
            />
          </div>
          
          <div>
            <Label htmlFor="og_image">Open Graph Image URL</Label>
            <Input
              id="og_image"
              value={seoSettings.og_image || ''}
              onChange={(e) => setSeoSettings(prev => ({...prev, og_image: e.target.value}))}
              placeholder="Image URL for social sharing"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save SEO Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          <p className="text-gray-600">Manage website content, banners, and SEO settings</p>
        </div>
        <Button onClick={loadContentData} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Website Content</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <WebsiteContentEditor />
        </TabsContent>

        <TabsContent value="banners">
          <BannerManagement />
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle>Promotional Codes</CardTitle>
              <CardDescription>Manage discount codes and promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Megaphone className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Promotions Management</h3>
                <p className="text-gray-600 mb-4">Coming soon - comprehensive promotional code system</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Promotion Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <SEOSettings />
        </TabsContent>
      </Tabs>

      {/* Create Banner Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Banner</DialogTitle>
            <DialogDescription>Add a new promotional banner to your website</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banner_title">Banner Title</Label>
                <Input
                  id="banner_title"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner(prev => ({...prev, title: e.target.value}))}
                  placeholder="Banner title"
                />
              </div>
              
              <div>
                <Label htmlFor="banner_position">Position</Label>
                <Select value={newBanner.position} onValueChange={(value) => setNewBanner(prev => ({...prev, position: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="banner_description">Description</Label>
              <Textarea
                id="banner_description"
                value={newBanner.description}
                onChange={(e) => setNewBanner(prev => ({...prev, description: e.target.value}))}
                placeholder="Banner description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banner_image">Image URL</Label>
                <Input
                  id="banner_image"
                  value={newBanner.image_url}
                  onChange={(e) => setNewBanner(prev => ({...prev, image_url: e.target.value}))}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="banner_link">Link URL</Label>
                <Input
                  id="banner_link"
                  value={newBanner.link_url}
                  onChange={(e) => setNewBanner(prev => ({...prev, link_url: e.target.value}))}
                  placeholder="/shop or https://example.com"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newBanner.is_active}
                onCheckedChange={(checked) => setNewBanner(prev => ({...prev, is_active: checked}))}
              />
              <Label>Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowContentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => createBanner(newBanner)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Banner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;