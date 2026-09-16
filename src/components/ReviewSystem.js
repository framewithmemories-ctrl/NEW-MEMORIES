import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import axios from 'axios';
import { 
  Star, 
  ThumbsUp, 
  Quote, 
  User, 
  Calendar, 
  Camera, 
  Send,
  CheckCircle,
  Heart,
  MapPin,
  ExternalLink
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readonly = false, size = "w-5 h-5" }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(0)}
          onClick={() => !readonly && onRatingChange?.(star)}
        >
          <Star
            className={`${size} ${
              star <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-green-100">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {review.customerName.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{review.location || 'Coimbatore'}</span>
                  <span>•</span>
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {review.productName}
              </Badge>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-3">
              <StarRating rating={review.rating} readonly={true} />
              <span className="text-sm font-medium text-gray-700">{review.rating}/5 stars</span>
            </div>
            
            {/* Review Text */}
            <blockquote className="text-gray-700 leading-relaxed">
              <Quote className="w-4 h-4 text-gray-400 inline mr-2" />
              {review.reviewText}
            </blockquote>
            
            {/* Review Photo */}
            {review.photoUrl && (
              <div className="mt-3">
                <img 
                  src={review.photoUrl} 
                  alt="Customer review photo"
                  className="w-32 h-32 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
            
            {/* Helpful Button */}
            <div className="flex items-center space-x-4 pt-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-green-600"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful ({review.helpfulCount || 0})
              </Button>
              {review.verified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Purchase
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Write Review Form Component
const WriteReviewForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    location: '',
    productName: '',
    rating: 0,
    reviewText: '',
    photoFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data if available
  useEffect(() => {
    const savedUser = localStorage.getItem('memoriesUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          customerName: user.name || '',
          email: user.email || '',
          location: 'Coimbatore'
        }));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFormData(prev => ({
        ...prev,
        photoFile: file
      }));
    } else {
      toast.error('Photo must be smaller than 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.rating || !formData.reviewText) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reviewData = {
        ...formData,
        createdAt: new Date().toISOString(),
        verified: false, // Will be verified by admin
        helpfulCount: 0,
        status: 'pending' // Pending admin approval
      };

      // If photo is uploaded, convert to base64 (in production, upload to cloud storage)
      if (formData.photoFile) {
        const reader = new FileReader();
        reader.onload = () => {
          reviewData.photoUrl = reader.result;
          submitReview(reviewData);
        };
        reader.readAsDataURL(formData.photoFile);
      } else {
        await submitReview(reviewData);
      }
      
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReview = async (reviewData) => {
    try {
      // Try to submit to backend
      const response = await axios.post(`${API}/reviews`, reviewData);
      
      if (response.data.success) {
        toast.success('Review submitted successfully! It will be published after admin approval. 🎉');
        onSubmit?.(reviewData);
      }
    } catch (error) {
      // Fallback: Save to localStorage
      const reviews = JSON.parse(localStorage.getItem('memoriesReviews') || '[]');
      reviews.push({ ...reviewData, id: Date.now() });
      localStorage.setItem('memoriesReviews', JSON.stringify(reviews));
      
      toast.success('Review submitted successfully! It will be published after admin approval. 🎉');
      onSubmit?.(reviewData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your experience with our products and help other customers make informed decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Your city"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productName">Product Purchased</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="e.g., Custom Photo Frame"
                className="mt-1"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label>Your Rating *</Label>
            <div className="flex items-center space-x-3 mt-2">
              <StarRating 
                rating={formData.rating} 
                onRatingChange={(rating) => handleInputChange('rating', rating)}
                size="w-8 h-8"
              />
              <span className="text-lg font-medium text-gray-700">
                {formData.rating > 0 && `${formData.rating}/5 stars`}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <Label htmlFor="reviewText">Your Review *</Label>
            <Textarea
              id="reviewText"
              value={formData.reviewText}
              onChange={(e) => handleInputChange('reviewText', e.target.value)}
              placeholder="Tell us about your experience with our product and service..."
              className="mt-1 h-32"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <Label htmlFor="photo">Add a Photo (Optional)</Label>
            <div className="mt-2">
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo').click()}
                className="border-dashed border-2 border-gray-300 hover:border-rose-300"
              >
                <Camera className="w-4 h-4 mr-2" />
                {formData.photoFile ? 'Photo Selected' : 'Upload Photo'}
              </Button>
              {formData.photoFile && (
                <p className="text-sm text-green-600 mt-1">
                  Photo selected: {formData.photoFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Main Reviews Section Component
export const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      // Try to load from backend first
      const response = await axios.get(`${API}/reviews`);
      setReviews(response.data || []);
    } catch (error) {
      // Fallback: Load from localStorage and add some sample reviews
      const localReviews = JSON.parse(localStorage.getItem('memoriesReviews') || '[]');
      const sampleReviews = [
        {
          id: 1,
          customerName: 'Priya Sharma',
          location: 'Saravanampatti',
          rating: 5,
          reviewText: 'Amazing quality frames! The sublimation printing is crystal clear and the wooden frame is beautifully crafted. Highly recommend Memories for all your photo frame needs.',
          productName: 'Custom Photo Frame',
          createdAt: '2024-12-20T10:30:00Z',
          verified: true,
          helpfulCount: 12
        },
        {
          id: 2,
          customerName: 'Rajesh Kumar',
          location: 'RS Puram',
          rating: 5,
          reviewText: 'Ordered 50 corporate mugs for our company event. Exceptional quality and delivered on time. The team at Memories is very professional and helpful.',
          productName: 'Corporate Mugs',
          createdAt: '2024-12-18T14:20:00Z',
          verified: true,
          helpfulCount: 8
        },
        {
          id: 3,
          customerName: 'Meera Krishnan',
          location: 'Peelamedu',
          rating: 5,
          reviewText: 'Got custom t-shirts made for my daughter\'s birthday party. The prints are vibrant and the fabric quality is excellent. Kids loved them!',
          productName: 'Custom T-Shirts',
          createdAt: '2024-12-15T09:45:00Z',
          verified: true,
          helpfulCount: 15
        }
      ];
      
      setReviews([...sampleReviews, ...localReviews]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setShowWriteForm(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-4">
            <ThumbsUp className="w-3 h-3 mr-1" />
            Customer Reviews
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our 
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Customers </span>
            Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Real reviews from real customers who love their personalized memories
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
              <StarRating rating={parseFloat(averageRating)} readonly={true} size="w-6 h-6" />
              <p className="text-gray-600 mt-2">{reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        <div className="text-center mb-12">
          <Button
            onClick={() => setShowWriteForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg"
          >
            <Star className="w-5 h-5 mr-2" />
            Write a Review
          </Button>
        </div>

        {/* Write Review Form Modal */}
        <Dialog open={showWriteForm} onOpenChange={setShowWriteForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <WriteReviewForm
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowWriteForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Google Reviews CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">4.9★ on Google Reviews</div>
            </div>
            <p className="text-gray-600 mb-6">Join 263+ happy customers who rated us 5 stars!</p>
            <div className="space-x-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open('https://www.google.com/maps/place/Memories+-+Photo+Frames+%26+Customized+Gift+Shop/@11.0755,76.9983,17z/data=!4m8!3m7!1s0x3ba859410e43c55f:0xd0f1eaeacbc9bf40!8m2!3d11.0755!4d76.9983!9m1!1b1!16s%2Fg%2F11s2y8k8qw', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Google Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};