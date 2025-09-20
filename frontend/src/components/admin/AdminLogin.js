import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Shield, Lock, User } from "lucide-react";

export const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  // Admin credentials (in production, this would be handled via secure authentication)
  const ADMIN_CREDENTIALS = {
    email: 'admin@memoriesngifts.com',
    password: 'AdminMemories@2024'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      // Call backend admin login API
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store admin session with token
        localStorage.setItem('adminSession', JSON.stringify({
          token: data.token,
          admin: data.admin,
          loginTime: new Date().toISOString(),
          expiresAt: data.expires_at
        }));

        toast.success('🎉 Welcome to Memories Admin Panel!');
        
        // Call parent login handler
        if (onLogin) {
          onLogin(data.admin);
        }
      } else {
        toast.error(data.detail || 'Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your connection and try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-rose-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Memories Admin</h1>
          <p className="text-gray-600">Photo Frames & Custom Gifts - Admin Portal</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@memoriesngifts.com"
                    value={credentials.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5"
                disabled={isLogging || !credentials.email || !credentials.password}
              >
                {isLogging ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Sign In to Admin Panel
                  </>
                )}
              </Button>

              {/* Demo Credentials Helper */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <h4 className="font-medium text-blue-900 mb-2">Demo Credentials</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Email:</strong> admin@memoriesngifts.com</p>
                      <p><strong>Password:</strong> AdminMemories@2024</p>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Use these temporary credentials for testing the admin panel
                    </p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure admin access • All actions are logged • Session expires after 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;