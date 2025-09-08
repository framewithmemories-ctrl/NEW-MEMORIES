import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toast } from "sonner";
import axios from "axios";
import CloudinaryPhotoUpload from "./CloudinaryPhotoUpload";
import { 
  User, 
  Calendar, 
  Heart, 
  Settings, 
  Shield, 
  Download, 
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Mail,
  MessageSquare,
  Phone,
  Gift,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Image as ImageIcon
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Enhanced User Profile Component with Phase 1 features
export const UserProfileEnhanced = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDataOptions, setShowDataOptions] = useState(false);
  
  // Profile form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    reminder_preferences: {
      email: false,
      sms: false,
      whatsapp: false
    },
    privacy_consent: {
      marketing_consent: false,
      reminder_consent: false
    }
  });
  
  // Important dates management
  const [importantDates, setImportantDates] = useState([]);
  const [newDate, setNewDate] = useState({
    name: '',
    date: '',
    type: 'birthday',
    reminder_enabled: true,
    reminder_days_before: [7, 1]
  });
  const [showAddDate, setShowAddDate] = useState(false);
  const [editingDate, setEditingDate] = useState(null);

  // Mock user ID - in production this would come from authentication
  const userId = 'user_123';

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // In production, this would be a real API call
      // For now, we'll use mock data with Phase 1 fields
      const mockUser = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        address: '123 Main Street, Coimbatore',
        date_of_birth: '1990-05-15',
        important_dates: [
          {
            id: 'date_1',
            name: "Mom's Birthday",
            date: '1965-03-20',
            type: 'birthday',
            reminder_enabled: true,
            reminder_days_before: [7, 1]
          },
          {
            id: 'date_2', 
            name: 'Wedding Anniversary',
            date: '2015-12-10',
            type: 'anniversary',
            reminder_enabled: true,
            reminder_days_before: [14, 7, 1]
          }
        ],
        reminder_preferences: {
          email: true,
          sms: false,
          whatsapp: true
        },
        privacy_consent: {
          marketing_consent: false,
          reminder_consent: true,
          data_processing_consent: true,
          consent_timestamp: '2025-01-01T10:00:00Z'
        },
        created_at: '2024-01-01T00:00:00Z'
      };

      setUser(mockUser);
      setProfileForm({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        address: mockUser.address,
        date_of_birth: mockUser.date_of_birth,
        reminder_preferences: mockUser.reminder_preferences,
        privacy_consent: mockUser.privacy_consent
      });
      setImportantDates(mockUser.important_dates || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // Mock API call - in production this would be real
      console.log('Updating profile:', profileForm);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => ({
        ...prev,
        ...profileForm,
        updated_at: new Date().toISOString()
      }));
      
      setIsEditing(false);
      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAddImportantDate = async () => {
    try {
      if (!newDate.name || !newDate.date) {
        toast.error('Please fill in all required fields');
        return;
      }

      const dateWithId = {
        ...newDate,
        id: `date_${Date.now()}`,
        created_at: new Date().toISOString()
      };

      // Mock API call
      console.log('Adding important date:', dateWithId);
      
      setImportantDates(prev => [...prev, dateWithId]);
      setNewDate({
        name: '',
        date: '',
        type: 'birthday',
        reminder_enabled: true,
        reminder_days_before: [7, 1]
      });
      setShowAddDate(false);
      
      toast.success('Important date added! 📅');
    } catch (error) {
      console.error('Error adding date:', error);
      toast.error('Failed to add date');
    }
  };

  const handleDeleteDate = async (dateId) => {
    try {
      // Mock API call
      console.log('Deleting date:', dateId);
      
      setImportantDates(prev => prev.filter(date => date.id !== dateId));
      toast.success('Date removed successfully');
    } catch (error) {
      console.error('Error deleting date:', error);
      toast.error('Failed to delete date');
    }
  };

  const handleConsentUpdate = async (consentType, value) => {
    try {
      const consentData = {
        type: consentType,
        consent_given: value,
        [consentType]: value
      };

      // Mock API call
      console.log('Updating consent:', consentData);
      
      setProfileForm(prev => ({
        ...prev,
        privacy_consent: {
          ...prev.privacy_consent,
          [consentType]: value,
          consent_timestamp: new Date().toISOString()
        }
      }));

      toast.success(`${consentType.replace('_', ' ')} consent updated`);
    } catch (error) {
      console.error('Error updating consent:', error);
      toast.error('Failed to update consent');
    }
  };

  const handleDataExport = async () => {
    try {
      // Mock API call
      console.log('Requesting data export for user:', userId);
      
      // Simulate processing delay
      toast.info('Preparing your data export...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockExportUrl = `https://secure-exports.memories.com/user-data-${userId}-${Date.now()}.json`;
      
      toast.success(
        'Data export ready! Check your email for the download link.',
        { duration: 5000 }
      );
      
      // In production, this would open the secure download URL
      console.log('Mock export URL:', mockExportUrl);
      
    } catch (error) {
      console.error('Error requesting data export:', error);
      toast.error('Failed to process data export request');
    }
  };

  const handleDataDeletion = async () => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to delete all your data? This action cannot be undone and will be processed within 30 days as per GDPR requirements.'
      );
      
      if (!confirmed) return;

      // Mock API call
      console.log('Requesting data deletion for user:', userId);
      
      toast.info('Data deletion request submitted. You will receive a confirmation email.');
      
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      toast.error('Failed to process deletion request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Profile</h1>
        <p className="text-gray-600">Manage your personal information, important dates, and privacy preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="dates" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Important Dates</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy & Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({...prev, name: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({...prev, email: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({...prev, phone: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth (Optional)</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profileForm.date_of_birth}
                    onChange={(e) => setProfileForm(prev => ({...prev, date_of_birth: e.target.value}))}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll use this to send you birthday wishes and special offers
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm(prev => ({...prev, address: e.target.value}))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleProfileUpdate}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Important Dates Tab */}
        <TabsContent value="dates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Important Dates</CardTitle>
                  <CardDescription>Add birthdays, anniversaries, and other special dates you want to remember</CardDescription>
                </div>
                <Button onClick={() => setShowAddDate(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {importantDates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No important dates added yet</p>
                  <p className="text-sm">Add birthdays, anniversaries, or other special dates to get reminders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {importantDates.map((date) => (
                    <Card key={date.id} className="border-l-4 border-l-rose-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{date.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(date.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <Badge variant={date.type === 'birthday' ? 'default' : 'secondary'}>
                                {date.type}
                              </Badge>
                              {date.reminder_enabled && (
                                <Badge variant="outline" className="text-green-600 border-green-200">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Reminders On
                                </Badge>
                              )}
                            </div>
                            {date.reminder_enabled && (
                              <p className="text-xs text-gray-500 mt-2">
                                Reminders: {date.reminder_days_before.join(', ')} days before
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingDate(date)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDate(date.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Date Dialog */}
          <Dialog open={showAddDate} onOpenChange={setShowAddDate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Important Date</DialogTitle>
                <DialogDescription>
                  Add a special date you want to remember and receive reminders for
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date-name">Date Name</Label>
                  <Input
                    id="date-name"
                    placeholder="e.g., Mom's Birthday, Anniversary"
                    value={newDate.name}
                    onChange={(e) => setNewDate(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="date-value">Date</Label>
                  <Input
                    id="date-value"
                    type="date"
                    value={newDate.date}
                    onChange={(e) => setNewDate(prev => ({...prev, date: e.target.value}))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="date-type">Type</Label>
                  <Select 
                    value={newDate.type} 
                    onValueChange={(value) => setNewDate(prev => ({...prev, type: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="custom">Custom Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminders"
                    checked={newDate.reminder_enabled}
                    onCheckedChange={(checked) => setNewDate(prev => ({...prev, reminder_enabled: checked}))}
                  />
                  <Label htmlFor="reminders">Enable reminders</Label>
                </div>
                
                {/* Consent checkbox for reminders */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <input 
                      type="checkbox" 
                      id="reminder-consent"
                      className="mt-1"
                      onChange={(e) => handleConsentUpdate('reminder_consent', e.target.checked)}
                    />
                    <div>
                      <label htmlFor="reminder-consent" className="text-sm font-medium text-blue-900">
                        I agree to receive reminders and promotional messages for the dates I add.
                      </label>
                      <p className="text-xs text-blue-700 mt-1">
                        We'll send you reminders via your preferred channels (email, SMS, or WhatsApp) for the important dates you add.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowAddDate(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddImportantDate}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Preferences</CardTitle>
              <CardDescription>Choose how you want to receive reminders for your important dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Email Reminders</h4>
                      <p className="text-sm text-gray-600">Get reminders sent to your email address</p>
                    </div>
                  </div>
                  <Switch
                    checked={profileForm.reminder_preferences.email}
                    onCheckedChange={(checked) => 
                      setProfileForm(prev => ({
                        ...prev,
                        reminder_preferences: {...prev.reminder_preferences, email: checked}
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">SMS Reminders</h4>
                      <p className="text-sm text-gray-600">Get text message reminders on your phone</p>
                    </div>
                  </div>
                  <Switch
                    checked={profileForm.reminder_preferences.sms}
                    onCheckedChange={(checked) => 
                      setProfileForm(prev => ({
                        ...prev,
                        reminder_preferences: {...prev.reminder_preferences, sms: checked}
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">WhatsApp Reminders</h4>
                      <p className="text-sm text-gray-600">Get reminders via WhatsApp messages</p>
                    </div>
                  </div>
                  <Switch
                    checked={profileForm.reminder_preferences.whatsapp}
                    onCheckedChange={(checked) => 
                      setProfileForm(prev => ({
                        ...prev,
                        reminder_preferences: {...prev.reminder_preferences, whatsapp: checked}
                      }))
                    }
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Reminder Delivery Note</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      SMS and WhatsApp services are currently being set up. Email reminders are fully functional.
                      You'll be notified when all services are available.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => toast.success('Reminder preferences saved!')}>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Data Tab */}
        <TabsContent value="privacy">
          <div className="space-y-6">
            {/* Privacy Consent */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy Consent</CardTitle>
                <CardDescription>Manage your privacy preferences and data consent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Marketing Communications</h4>
                    <p className="text-sm text-gray-600">Receive promotional offers and product updates</p>
                  </div>
                  <Switch
                    checked={profileForm.privacy_consent.marketing_consent}
                    onCheckedChange={(checked) => handleConsentUpdate('marketing_consent', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Reminder Services</h4>
                    <p className="text-sm text-gray-600">Allow us to send reminders for your important dates</p>
                  </div>
                  <Switch
                    checked={profileForm.privacy_consent.reminder_consent}
                    onCheckedChange={(checked) => handleConsentUpdate('reminder_consent', checked)}
                  />
                </div>
                
                {profileForm.privacy_consent.consent_timestamp && (
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(profileForm.privacy_consent.consent_timestamp).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or delete your personal data (GDPR compliance)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleDataExport}
                    className="flex items-center justify-center p-6 h-auto"
                  >
                    <div className="text-center">
                      <Download className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <h4 className="font-medium">Export My Data</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Download all your personal data
                      </p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDataOptions(true)}
                    className="flex items-center justify-center p-6 h-auto border-red-200 hover:bg-red-50"
                  >
                    <div className="text-center">
                      <Trash2 className="w-8 h-8 mx-auto mb-2 text-red-500" />
                      <h4 className="font-medium text-red-700">Delete My Data</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Permanently delete your account
                      </p>
                    </div>
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Data Retention Policy</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Profile data: Retained until account deletion</li>
                    <li>• Order history: Retained for 7 years for accounting purposes</li>
                    <li>• Photos: Auto-deleted after 24 months unless saved to favorites</li>
                    <li>• Analytics data: Anonymized after 26 months</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Data Deletion Confirmation Dialog */}
          <Dialog open={showDataOptions} onOpenChange={setShowDataOptions}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Delete Account & Data</DialogTitle>
                <DialogDescription>
                  This action will permanently delete all your data and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">What will be deleted:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Your profile and personal information</li>
                    <li>• All uploaded photos and designs</li>
                    <li>• Order history and transaction records</li>
                    <li>• Saved preferences and important dates</li>
                    <li>• Wallet balance and reward points</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800">Important:</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Data deletion will be processed within 30 days as per GDPR requirements. 
                    You will receive an email confirmation before final deletion.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDataOptions(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDataDeletion}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Request Data Deletion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileEnhanced;