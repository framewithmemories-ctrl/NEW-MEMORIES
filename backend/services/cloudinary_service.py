import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime, timedelta
import os
import uuid
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class CloudinaryService:
    def __init__(self):
        """Initialize Cloudinary service with environment configuration"""
        cloudinary.config(
            cloudinary_url="cloudinary://156525119115833:asHKc2dnS_Ys2AHqwNCkEkH2nBM@dgniboqvx"
        )
        self.cloud_name = "dgniboqvx"
        self.auto_delete_days = 30  # Auto-delete photos after 30 days unless saved
        
    async def upload_user_photo(self, user_id: str, file_data: bytes, filename: str, 
                               order_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Upload photo to user's private folder with proper organization
        
        Args:
            user_id: Unique user identifier
            file_data: Photo file bytes
            filename: Original filename
            order_id: Optional order ID for order-specific photos
            
        Returns:
            Dictionary with upload results and metadata
        """
        try:
            # Determine folder structure
            if order_id:
                folder = f"users/{user_id}/orders/{order_id}"
            else:
                folder = f"users/{user_id}/photos"
            
            # Generate unique public_id
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_id = str(uuid.uuid4())[:8]
            clean_filename = filename.split('.')[0][:20]  # Limit filename length
            public_id = f"{timestamp}_{unique_id}_{clean_filename}"
            
            # Upload with optimization and security
            result = cloudinary.uploader.upload(
                file_data,
                folder=folder,
                public_id=public_id,
                resource_type="image",
                quality="auto:good",
                fetch_format="auto",
                secure=True,
                overwrite=False,
                # Auto-generate thumbnails
                eager=[
                    {"width": 150, "height": 150, "crop": "fill", "quality": "auto:eco"},
                    {"width": 300, "height": 300, "crop": "fill", "quality": "auto:good"},
                    {"width": 600, "height": 600, "crop": "limit", "quality": "auto:good"},
                    {"width": 1200, "height": 1200, "crop": "limit", "quality": "auto:best"}
                ],
                # Add metadata
                context={
                    "user_id": user_id,
                    "order_id": order_id or "",
                    "upload_date": datetime.now().isoformat(),
                    "retention_policy": "30_days_auto_delete"
                }
            )
            
            logger.info(f"Photo uploaded successfully for user {user_id}: {public_id}")
            
            return {
                "success": True,
                "public_id": result["public_id"],
                "secure_url": result["secure_url"],
                "folder": folder,
                "width": result["width"],
                "height": result["height"],
                "format": result["format"],
                "bytes": result["bytes"],
                "thumbnails": {
                    "small": result["eager"][0]["secure_url"] if result.get("eager") else None,
                    "medium": result["eager"][1]["secure_url"] if len(result.get("eager", [])) > 1 else None,
                    "large": result["eager"][2]["secure_url"] if len(result.get("eager", [])) > 2 else None,
                    "xlarge": result["eager"][3]["secure_url"] if len(result.get("eager", [])) > 3 else None,
                },
                "metadata": {
                    "user_id": user_id,
                    "order_id": order_id,
                    "upload_date": datetime.now().isoformat(),
                    "auto_delete_date": (datetime.now() + timedelta(days=self.auto_delete_days)).isoformat()
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to upload photo for user {user_id}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to upload photo. Please try again."
            }
    
    async def generate_signed_url(self, public_id: str, user_id: str, 
                                 expires_in_hours: int = 4) -> Optional[str]:
        """
        Generate secure signed URL for user's photo with access control
        
        Args:
            public_id: Cloudinary public ID of the photo
            user_id: User requesting access
            expires_in_hours: URL expiration time in hours
            
        Returns:
            Signed URL or None if unauthorized
        """
        try:
            # Verify user owns this photo
            if not public_id.startswith(f"users/{user_id}/"):
                logger.warning(f"Unauthorized access attempt: user {user_id} tried to access {public_id}")
                return None
            
            # Generate signed URL with expiration
            expires_at = int((datetime.now() + timedelta(hours=expires_in_hours)).timestamp())
            
            url, options = cloudinary.utils.cloudinary_url(
                public_id,
                sign_url=True,
                secure=True,
                expires_at=expires_at,
                type="authenticated"  # Require authentication
            )
            
            logger.info(f"Generated signed URL for user {user_id}: {public_id}")
            return url
            
        except Exception as e:
            logger.error(f"Failed to generate signed URL for {public_id}: {str(e)}")
            return None
    
    async def get_user_photos(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get all photos for a specific user
        
        Args:
            user_id: User identifier
            limit: Maximum number of photos to return
            
        Returns:
            List of photo metadata
        """
        try:
            # Search for photos in user's folder
            result = cloudinary.api.resources(
                type="upload",
                prefix=f"users/{user_id}/",
                max_results=limit,
                context=True,
                metadata=True
            )
            
            photos = []
            for resource in result.get("resources", []):
                # Generate signed URL for each photo
                signed_url = await self.generate_signed_url(resource["public_id"], user_id)
                
                photos.append({
                    "public_id": resource["public_id"],
                    "secure_url": signed_url,
                    "width": resource["width"],
                    "height": resource["height"],
                    "format": resource["format"],
                    "bytes": resource["bytes"],
                    "created_at": resource["created_at"],
                    "folder": resource.get("folder", ""),
                    "context": resource.get("context", {}),
                    "is_order_photo": "/orders/" in resource["public_id"]
                })
            
            logger.info(f"Retrieved {len(photos)} photos for user {user_id}")
            return photos
            
        except Exception as e:
            logger.error(f"Failed to get photos for user {user_id}: {str(e)}")
            return []
    
    async def delete_user_photo(self, public_id: str, user_id: str) -> bool:
        """
        Delete a user's photo with authorization check
        
        Args:
            public_id: Photo to delete
            user_id: User requesting deletion
            
        Returns:
            True if deleted successfully, False otherwise
        """
        try:
            # Verify user owns this photo
            if not public_id.startswith(f"users/{user_id}/"):
                logger.warning(f"Unauthorized delete attempt: user {user_id} tried to delete {public_id}")
                return False
            
            # Delete photo and all its transformations
            result = cloudinary.uploader.destroy(public_id, invalidate=True)
            
            if result.get("result") == "ok":
                logger.info(f"Photo deleted successfully: {public_id}")
                return True
            else:
                logger.warning(f"Failed to delete photo {public_id}: {result}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to delete photo {public_id}: {str(e)}")
            return False
    
    async def cleanup_expired_photos(self) -> int:
        """
        Cleanup photos that have exceeded the retention period
        
        Returns:
            Number of photos deleted
        """
        try:
            cutoff_date = datetime.now() - timedelta(days=self.auto_delete_days)
            deleted_count = 0
            
            # This would typically be run as a scheduled job
            # For now, return 0 as we need a more sophisticated cleanup system
            logger.info(f"Cleanup job would delete photos older than {cutoff_date}")
            return deleted_count
            
        except Exception as e:
            logger.error(f"Failed to cleanup expired photos: {str(e)}")
            return 0
    
    async def generate_product_mockup(self, user_photo_public_id: str, frame_template: str, 
                                    user_id: str) -> Optional[str]:
        """
        Generate product mockup by combining user photo with frame template
        
        Args:
            user_photo_public_id: User's uploaded photo
            frame_template: Frame design template
            user_id: User requesting mockup
            
        Returns:
            URL of generated mockup or None if failed
        """
        try:
            # Verify user owns the photo
            if not user_photo_public_id.startswith(f"users/{user_id}/"):
                return None
            
            # Generate mockup using Cloudinary transformations
            mockup_url, _ = cloudinary.utils.cloudinary_url(
                user_photo_public_id,
                transformation=[
                    {"width": 800, "height": 800, "crop": "fill"},
                    {"overlay": f"frames/{frame_template}", "flags": "layer_apply"},
                    {"quality": "auto:good", "fetch_format": "auto"}
                ],
                secure=True
            )
            
            logger.info(f"Generated mockup for user {user_id}: {frame_template}")
            return mockup_url
            
        except Exception as e:
            logger.error(f"Failed to generate mockup: {str(e)}")
            return None

# Global instance
cloudinary_service = CloudinaryService()