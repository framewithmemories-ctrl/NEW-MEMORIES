import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { 
  Star, 
  Heart, 
  ThumbsUp, 
  MessageCircle, 
  Camera, 
  Send,
  Filter,
  ChevronDown,
  CheckCircle,
  Award,
  Users,
  TrendingUp,
  Loader2
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ReviewSystemEnhanced = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    photos: []
  });
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load reviews from localStorage on mount
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    try {
      const savedReviews = localStorage.getItem('memoriesReviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        // Initialize with some sample reviews
        const sampleReviews = [
          {
            id: 1,
            name: "Priya Sharma",
            rating: 5,
            comment: "Absolutely love my custom photo frame! The quality is outstanding and the delivery was super quick. The team at Memories really knows their craft. Will definitely order again! 💕",
            date: "2024-01-15",
            verified: true,
            helpful: 12,
            photos: [],
            response: "Thank you Priya! We're thrilled you love your frame. Your satisfaction means everything to us! 😊"
          },
          {
            id: 2,
            name: "Rajesh Kumar", 
            rating: 5,
            comment: "Ordered a bulk order for our office event and they delivered exactly what we needed. Professional service, great pricing, and the frames look amazing. Highly recommend for corporate orders!",
            date: "2024-01-10",
            verified: true,
            helpful: 8,
            photos: []
          },
          {
            id: 3,
            name: "Anitha Menon",
            rating: 4,
            comment: "Beautiful frames and good quality printing. The photo came out exactly as I wanted. Only minor issue was the delivery took an extra day, but overall very satisfied with the product.",
            date: "2024-01-08",
            verified: false,
            helpful: 5,
            photos: []
          },
          {
            id: 4,
            name: "Karthik Raman",
            rating: 5,
            comment: "Amazing service! I had a very specific custom request and they handled it perfectly. The AI Gift Finder feature helped me choose the perfect frame for my mother's birthday. She absolutely loved it! ⭐",
            date: "2024-01-05",
            verified: true,
            helpful: 15,
            photos: []
          },
          {
            id: 5,
            name: "Deepika Singh",
            rating: 5,
            comment: "The photo quality and frame finish exceeded my expectations. Great customer service too - they called to confirm all details before processing. Will recommend to friends and family!",
            date: "2024-01-03",
            verified: true,
            helpful: 9,
            photos: []
          }
        ];
        setReviews(sampleReviews);
        localStorage.setItem('memoriesReviews', JSON.stringify(sampleReviews));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    }
  };

  const saveReviews = (updatedReviews) => {
    setReviews(updatedReviews);
    localStorage.setItem('memoriesReviews', JSON.stringify(updatedReviews));
  };

  const handleSubmitReview = async () => {
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const review = {
        id: Date.now(),
        name: newReview.name.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        date: new Date().toISOString().split('T')[0],
        verified: false, // Would be true after purchase verification
        helpful: 0,
        photos: newReview.photos
      };

      const updatedReviews = [review, ...reviews];
      saveReviews(updatedReviews);

      // Reset form
      setNewReview({
        name: '',
        rating: 5,
        comment: '',
        photos: []
      });
      
      setShowReviewForm(false);
      
      toast.success('🎉 Thank you for your review!', {
        description: 'Your review has been submitted and is pending approval.',
        duration: 4000
      });
      
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewReview(prev => ({
          ...prev,
          photos: [...prev.photos, event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const markHelpful = (reviewId) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    );
    saveReviews(updatedReviews);
    toast.success('Thanks for your feedback!');
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;
    
    if (filterRating !== 'all') {
      filtered = reviews.filter(review => review.rating === parseInt(filterRating));
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const distribution = getRatingDistribution();
  const avgRating = getAverageRating();
  const filteredReviews = getFilteredAndSortedReviews();

  return (
    <div className="space-y-6">
      
      {/* Review Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                Customer Reviews
              </CardTitle>
              <CardDescription>
                What our customers say about Memories
              </CardDescription>
            </div>
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Share Your Experience</DialogTitle>
                  <DialogDescription>
                    Help others by sharing your experience with Memories
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reviewer-name">Your Name</Label>
                    <Input
                      id="reviewer-name"
                      value={newReview.name}
                      onChange={(e) => setNewReview(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      {renderStars(newReview.rating, true, (rating) => 
                        setNewReview(prev => ({...prev, rating}))
                      )}
                      <span className="text-sm text-gray-600 ml-2">
                        ({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="review-comment">Your Review</Label>
                    <Textarea
                      id="review-comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
                      placeholder="Share your experience with our products and service..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="review-photos">Add Photos (Optional)</Label>
                    <Input
                      id="review-photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="mt-1"
                    />
                    {newReview.photos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {newReview.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleSubmitReview}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    disabled={isSubmitting}
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{avgRating}</div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(Math.round(parseFloat(avgRating)))}
                <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
              </div>
              <p className="text-sm text-gray-600">Average customer rating</p>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-6">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ 
                        width: `${reviews.length > 0 ? (distribution[rating - 1] / reviews.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {distribution[rating - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Label>Filter by rating:</Label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label>Sort by:</Label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
        
        <Badge variant="secondary" className="text-sm">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </Badge>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600 mb-4">
                {filterRating !== 'all' 
                  ? `No reviews with ${filterRating} stars yet.`
                  : 'Be the first to share your experience!'
                }
              </p>
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                Write First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{review.name}</span>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.comment}
                </p>
                
                {review.photos && review.photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                )}
                
                {review.response && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-rose-100 text-rose-800">
                        Memories Team
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm">{review.response}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markHelpful(review.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Helpful ({review.helpful})
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    {review.helpful > 0 && `${review.helpful} people found this helpful`}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};