import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  Loader2, 
  Eye, 
  Trash2, 
  Download,
  Sparkles,
  Camera,
  FileImage,
  AlertTriangle
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const CloudinaryPhotoUpload = ({ userId = 'user_123', orderId = null, onUploadSuccess = null, showGallery = true }) => {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mockupUrl, setMockupUrl] = useState(null);
  const [showMockupDialog, setShowMockupDialog] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (showGallery) {
      loadUserPhotos();
    }
  }, [userId, showGallery]);

  const loadUserPhotos = async () => {
    try {
      setLoadingPhotos(true);
      const response = await axios.get(`${backendUrl}/api/users/${userId}/photos`);
      
      if (response.data.success) {
        setPhotos(response.data.photos || []);
      } else {
        console.error('Failed to load photos:', response.data);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Failed to load your photos');
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a photo first');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (orderId) {
        formData.append('order_id', orderId);
      }

      const response = await axios.post(
        `${backendUrl}/api/users/${userId}/photos/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('📸 Photo uploaded successfully!');
        
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Reload photos if gallery is shown
        if (showGallery) {
          await loadUserPhotos();
        }
        
        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to upload photo. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId, publicId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this photo? This action cannot be undone.');
      if (!confirmed) return;

      const response = await axios.delete(`${backendUrl}/api/users/${userId}/photos/${photoId}`);
      
      if (response.data.success) {
        toast.success('Photo deleted successfully');
        await loadUserPhotos(); // Reload photos
      } else {
        toast.error('Failed to delete photo');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete photo');
    }
  };

  const generateMockup = async (photoId, frameTemplate = 'wooden-frame') => {
    try {
      const formData = new FormData();
      formData.append('frame_template', frameTemplate);

      const response = await axios.post(
        `${backendUrl}/api/users/${userId}/photos/${photoId}/mockup`,
        formData
      );

      if (response.data.success) {
        setMockupUrl(response.data.mockup_url);
        setShowMockupDialog(true);
        toast.success('✨ Mockup generated successfully!');
      } else {
        toast.error('Failed to generate mockup');
      }
    } catch (error) {
      console.error('Mockup generation error:', error);
      toast.error('Failed to generate mockup');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-rose-600" />
            <span>Upload Photos</span>
          </CardTitle>
          <CardDescription>
            Upload your photos securely to your personal gallery. Files are stored safely and only you can access them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div>
            <Label htmlFor="photo-upload">Select Photo</Label>
            <div className="mt-2">
              <Input
                id="photo-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supported: JPG, PNG, WEBP • Max size: 5MB
            </p>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Preview</Label>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
              className="min-w-[120px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {showGallery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span>My Photos</span>
              {photos.length > 0 && (
                <Badge variant="outline">{photos.length} photos</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Your uploaded photos are stored securely and can only be accessed by you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPhotos ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading your photos...</span>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No photos uploaded yet</p>
                <p className="text-sm">Upload your first photo using the form above</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.photo_id} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
                      <img
                        src={photo.thumbnails?.medium || photo.secure_url}
                        alt="Uploaded photo"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.src = photo.secure_url; // Fallback to original if thumbnail fails
                        }}
                      />
                    </div>
                    
                    {/* Photo Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                      {/* Preview Button */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(photo.secure_url, '_blank')}
                        className="bg-white bg-opacity-90 text-black hover:bg-opacity-100"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {/* Generate Mockup Button */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => generateMockup(photo.photo_id)}
                        className="bg-blue-500 bg-opacity-90 text-white hover:bg-opacity-100"
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                      
                      {/* Delete Button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePhoto(photo.photo_id, photo.public_id)}
                        className="bg-red-500 bg-opacity-90 hover:bg-opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Photo Info */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                        <span>{photo.format?.toUpperCase()}</span>
                      </div>
                      {photo.is_order_photo && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Order Photo
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mockup Preview Dialog */}
      <Dialog open={showMockupDialog} onOpenChange={setShowMockupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Product Mockup Preview</span>
            </DialogTitle>
            <DialogDescription>
              Here's how your photo would look in our frame design
            </DialogDescription>
          </DialogHeader>
          
          {mockupUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={mockupUrl}
                  alt="Product mockup"
                  className="max-w-full max-h-96 object-contain rounded-lg border"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Like what you see? Add this frame to your cart!
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => window.open(mockupUrl, '_blank')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => toast.success('Frame added to cart! 🛒')}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Usage Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 rounded-full p-1 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Photo Upload Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-resolution photos for best quality prints</li>
                <li>• Photos are automatically optimized and thumbnails generated</li>
                <li>• Your photos are stored securely and only you can access them</li>
                <li>• Generate mockups to see how your photos look in different frames</li>
                <li>• Photos are auto-deleted after 30 days unless saved to favorites</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudinaryPhotoUpload;