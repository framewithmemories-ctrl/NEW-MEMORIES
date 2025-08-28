import React, { useState, useRef, useCallback } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { ProfilePhotoStorage } from './ProfilePhotoStorage';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  Zap,
  RotateCcw,
  Move,
  ZoomIn,
  Save,
  Heart,
  Tag
} from "lucide-react";

export const DragDropPhotoUpload = ({ 
  onPhotoUploaded, 
  onPhotoAnalyzed, 
  maxSize = 25, // MB
  acceptedFormats = ['jpg', 'jpeg', 'png', 'heic', 'webp'],
  className = "" 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  // Drag and Drop Handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  // File Selection Handler
  const handleFileSelection = async (file) => {
    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      toast.error(`Please upload ${acceptedFormats.join(', ')} files only`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size should be less than ${maxSize}MB`);
      return;
    }

    // Process the file
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoData = {
          file: file,
          url: e.target.result,
          name: file.name,
          size: fileSizeMB.toFixed(2),
          type: file.type,
          dimensions: null
        };

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          photoData.dimensions = {
            width: img.width,
            height: img.height,
            ratio: img.width / img.height
          };
          
          setUploadedPhoto(photoData);
          onPhotoUploaded?.(photoData);
          
          // Auto-analyze the photo
          analyzePhoto(photoData);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      
      toast.success('Photo uploaded successfully! 📸');
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Failed to process the photo. Please try again.');
    }
  };

  // AI Photo Analysis
  const analyzePhoto = async (photoData) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis (in production, this would call your AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { width, height } = photoData.dimensions;
      const ratio = width / height;
      
      // Analysis logic
      let quality = 'excellent';
      let recommendations = [];
      
      // Resolution check
      const totalPixels = width * height;
      if (totalPixels < 1000000) { // Less than 1MP
        quality = 'low';
        recommendations.push('Consider using a higher resolution image for better print quality');
      } else if (totalPixels < 4000000) { // Less than 4MP
        quality = 'good';
        recommendations.push('Image quality is good for standard prints');
      } else {
        quality = 'excellent';
        recommendations.push('Excellent resolution - perfect for all frame sizes');
      }
      
      // Orientation recommendations
      if (ratio > 1.5) {
        recommendations.push('Perfect for landscape-oriented frames');
      } else if (ratio < 0.7) {
        recommendations.push('Ideal for portrait-oriented frames');
      } else {
        recommendations.push('Great for square or standard frames');
      }
      
      // Suggested frame sizes
      let suggestedSizes = ['8x10', '12x16'];
      if (quality === 'excellent') {
        suggestedSizes = ['8x10', '12x16', '16x20', '20x24'];
      }
      
      const analysis = {
        quality,
        score: quality === 'excellent' ? 95 : quality === 'good' ? 80 : 65,
        recommendations,
        suggestedSizes,
        orientation: ratio > 1 ? 'landscape' : ratio < 1 ? 'portrait' : 'square',
        printReady: quality !== 'low'
      };
      
      setAnalysisResult(analysis);
      onPhotoAnalyzed?.(analysis);
      
      toast.success(`Photo analysis complete! Quality: ${quality}`, {
        description: `Score: ${analysis.score}/100`,
        duration: 4000
      });
      
    } catch (error) {
      console.error('Photo analysis error:', error);
      toast.error('Photo analysis failed, but you can still proceed with customization');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Clear uploaded photo
  const clearPhoto = () => {
    setUploadedPhoto(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {!uploadedPhoto ? (
        // Upload Area
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-rose-400 bg-rose-50 scale-105'
              : 'border-gray-300 hover:border-rose-300 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver && (
            <div className="absolute inset-0 bg-rose-100 bg-opacity-80 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-16 h-16 text-rose-600 mx-auto mb-4 animate-bounce" />
                <p className="text-xl font-semibold text-rose-800">Drop your photo here!</p>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Camera className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Your Photo</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Drag & drop your photo here, or click to browse files
                <br />
                <span className="text-sm text-gray-500">
                  Supports: {acceptedFormats.map(f => f.toUpperCase()).join(', ')} • Max {maxSize}MB
                </span>
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.map(f => `.${f}`).join(',')}
                onChange={(e) => e.target.files[0] && handleFileSelection(e.target.files[0])}
                className="hidden"
                id="photo-upload"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Photo
              </Button>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant Preview</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI Quality Check</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>Smart Recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Move className="w-4 h-4 text-orange-500" />
                  <span>Drag & Drop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Photo Preview & Analysis
        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Photo Uploaded Successfully</h3>
                    <p className="text-sm text-gray-600">{uploadedPhoto.name} • {uploadedPhoto.size}MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearPhoto}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photo Preview */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Preview</h4>
                  <div className="relative bg-white rounded-lg p-4 shadow-sm">
                    <img
                      src={uploadedPhoto.url}
                      alt="Uploaded photo"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs">
                      {uploadedPhoto.dimensions?.width} × {uploadedPhoto.dimensions?.height}
                    </div>
                  </div>
                </div>
                
                {/* Analysis Results */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    {isAnalyzing ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                        Analyzing Photo...
                      </span>
                    ) : (
                      'AI Analysis Results'
                    )}
                  </h4>
                  
                  {analysisResult && (
                    <div className="space-y-3">
                      {/* Quality Score */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quality Score</span>
                        <Badge className={getQualityColor(analysisResult.quality)}>
                          {analysisResult.score}/100 - {analysisResult.quality}
                        </Badge>
                      </div>
                      
                      {/* Recommendations */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-gray-900">Recommendations:</span>
                        {analysisResult.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Sparkles className="w-3 h-3 text-purple-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Suggested Sizes */}
                      <div>
                        <span className="text-sm font-medium text-gray-900 block mb-2">Suggested Frame Sizes:</span>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.suggestedSizes.map((size) => (
                            <Badge key={size} variant="outline" className="text-xs">
                              {size}"
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Print Ready Status */}
                      <div className="flex items-center space-x-2 pt-2">
                        {analysisResult.printReady ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">Ready for high-quality printing</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-700 font-medium">May need higher resolution for best quality</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-green-200">
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={() => {
                    // Scroll to customizer
                    document.getElementById('customizer')?.scrollIntoView({behavior: 'smooth'});
                  }}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Start Customizing
                </Button>
                <Button
                  variant="outline"
                  onClick={clearPhoto}
                  className="flex-1 border-gray-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Upload Different Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};