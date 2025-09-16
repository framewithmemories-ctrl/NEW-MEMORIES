import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, BaseLoader
from datetime import datetime
import os
import logging
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

class HostingerEmailService:
    def __init__(self):
        """Initialize Hostinger email service with SMTP configuration"""
        self.smtp_server = "smtp.hostinger.com"
        self.smtp_port = 587
        self.username = "admin@memoriesngifts.com"
        # Password will be set via environment variable
        self.password = os.getenv("EMAIL_PASSWORD", "")
        self.from_email = "admin@memoriesngifts.com"
        self.from_name = "Memories Photo Frames"
        
        # Jinja2 template environment
        self.template_env = Environment(loader=BaseLoader())
        
    async def _send_email(self, to_email: str, subject: str, html_content: str, 
                         text_content: Optional[str] = None) -> bool:
        """
        Send email using Hostinger SMTP
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email content
            text_content: Optional plain text content
            
        Returns:
            True if sent successfully, False otherwise
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email
            
            # Add text content if provided
            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)
            
            # Add HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_server,
                port=self.smtp_port,
                start_tls=True,
                username=self.username,
                password=self.password,
            )
            
            logger.info(f"Email sent successfully to {to_email}: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    async def send_order_confirmation(self, order_data: Dict[str, Any]) -> bool:
        """
        Send order confirmation email to customer
        
        Args:
            order_data: Dictionary containing order information
            
        Returns:
            True if sent successfully
        """
        template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #e11d48; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .order-details { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
                .button { background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📸 Order Confirmed!</h1>
                <p>Thank you for choosing Memories Photo Frames</p>
            </div>
            
            <div class="content">
                <h2>Dear {{ customer_name }},</h2>
                <p>Your order has been confirmed and we're preparing it with care! 🎉</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> #{{ order_id }}</p>
                    <p><strong>Order Date:</strong> {{ order_date }}</p>
                    <p><strong>Total Amount:</strong> ₹{{ total_amount }}</p>
                    <p><strong>Payment Method:</strong> {{ payment_method }}</p>
                    <p><strong>Expected Delivery:</strong> {{ delivery_date }}</p>
                </div>
                
                <h3>Items Ordered:</h3>
                <ul>
                {% for item in items %}
                    <li>{{ item.name }} - Quantity: {{ item.quantity }} - ₹{{ item.price }}</li>
                {% endfor %}
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://memoriesngifts.com/track/{{ order_id }}" class="button">Track Your Order</a>
                </div>
                
                <p><strong>Delivery Address:</strong><br>
                {{ delivery_address }}</p>
                
                <p>We'll send you updates as your order progresses. If you have any questions, feel free to reach out!</p>
                
                <p>WhatsApp: <a href="https://wa.me/918148040148">+91 81480 40148</a><br>
                Email: <a href="mailto:support@memoriesngifts.com">support@memoriesngifts.com</a></p>
            </div>
            
            <div class="footer">
                <p>Memories - Photo Frames & Custom Gifts<br>
                19B Kani Illam, Keeranatham Road, Coimbatore<br>
                <a href="https://memoriesngifts.com">memoriesngifts.com</a></p>
            </div>
        </body>
        </html>
        """
        
        try:
            # Render template
            template_obj = self.template_env.from_string(template)
            html_content = template_obj.render(**order_data)
            
            subject = f"Order Confirmed - #{order_data['order_id']} 📸"
            
            return await self._send_email(
                order_data['customer_email'],
                subject,
                html_content
            )
            
        except Exception as e:
            logger.error(f"Failed to send order confirmation: {str(e)}")
            return False
    
    async def send_shipping_notification(self, shipping_data: Dict[str, Any]) -> bool:
        """
        Send shipping notification to customer
        
        Args:
            shipping_data: Dictionary containing shipping information
            
        Returns:
            True if sent successfully
        """
        template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #059669; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .tracking-box { background: #f0fdf4; border: 2px solid #059669; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
                .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
                .button { background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📦 Your Order is Shipped!</h1>
            </div>
            
            <div class="content">
                <h2>Dear {{ customer_name }},</h2>
                <p>Great news! Your order #{{ order_id }} is on its way to you! 🚚</p>
                
                <div class="tracking-box">
                    <h3>Tracking Information</h3>
                    <p><strong>Courier Partner:</strong> {{ courier_name }}</p>
                    <p><strong>Tracking Number:</strong> {{ tracking_number }}</p>
                    <p><strong>Expected Delivery:</strong> {{ expected_delivery }}</p>
                    
                    <div style="margin: 20px 0;">
                        <a href="{{ tracking_url }}" class="button">Track Package</a>
                    </div>
                </div>
                
                <p>Your package is carefully packed and will reach you soon. You can track its progress using the tracking number above.</p>
                
                <p>For any queries:<br>
                WhatsApp: <a href="https://wa.me/918148040148">+91 81480 40148</a><br>
                Email: <a href="mailto:support@memoriesngifts.com">support@memoriesngifts.com</a></p>
            </div>
            
            <div class="footer">
                <p>Memories - Photo Frames & Custom Gifts<br>
                <a href="https://memoriesngifts.com">memoriesngifts.com</a></p>
            </div>
        </body>
        </html>
        """
        
        try:
            template_obj = self.template_env.from_string(template)
            html_content = template_obj.render(**shipping_data)
            
            subject = f"📦 Order #{shipping_data['order_id']} Shipped - Track Your Package"
            
            return await self._send_email(
                shipping_data['customer_email'],
                subject,
                html_content
            )
            
        except Exception as e:
            logger.error(f"Failed to send shipping notification: {str(e)}")
            return False
    
    async def send_admin_notification(self, notification_data: Dict[str, Any]) -> bool:
        """
        Send notification to admin about new orders, issues, etc.
        
        Args:
            notification_data: Dictionary containing notification information
            
        Returns:
            True if sent successfully
        """
        template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .alert-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .info-box { background: #e0f2fe; border: 2px solid #0284c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔔 Admin Notification</h1>
            </div>
            
            <div class="content">
                <h2>{{ notification_title }}</h2>
                <p>{{ notification_message }}</p>
                
                {% if notification_type == 'new_order' %}
                <div class="info-box">
                    <h3>New Order Details</h3>
                    <p><strong>Order ID:</strong> #{{ order_id }}</p>
                    <p><strong>Customer:</strong> {{ customer_name }}</p>
                    <p><strong>Amount:</strong> ₹{{ amount }}</p>
                    <p><strong>Payment:</strong> {{ payment_method }}</p>
                    <p><strong>Time:</strong> {{ order_time }}</p>
                </div>
                {% endif %}
                
                {% if notification_type == 'alert' %}
                <div class="alert-box">
                    <h3>Alert Details</h3>
                    <p><strong>Type:</strong> {{ alert_type }}</p>
                    <p><strong>Details:</strong> {{ alert_details }}</p>
                    <p><strong>Time:</strong> {{ alert_time }}</p>
                </div>
                {% endif %}
                
                <p>Login to admin panel: <a href="https://memoriesngifts.com/admin">memoriesngifts.com/admin</a></p>
            </div>
        </body>
        </html>
        """
        
        try:
            template_obj = self.template_env.from_string(template)
            html_content = template_obj.render(**notification_data)
            
            subject = f"[Admin] {notification_data.get('notification_title', 'System Notification')}"
            
            return await self._send_email(
                self.from_email,  # Send to admin email
                subject,
                html_content
            )
            
        except Exception as e:
            logger.error(f"Failed to send admin notification: {str(e)}")
            return False
    
    async def send_welcome_email(self, user_data: Dict[str, Any]) -> bool:
        """
        Send welcome email to new users
        
        Args:
            user_data: Dictionary containing user information
            
        Returns:
            True if sent successfully
        """
        template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #e11d48; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .welcome-box { background: #fef2f2; border: 2px solid #e11d48; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
                .button { background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Welcome to Memories!</h1>
            </div>
            
            <div class="content">
                <h2>Hello {{ user_name }}!</h2>
                <p>Welcome to Memories - Photo Frames & Custom Gifts! We're thrilled to have you join our family. 📸</p>
                
                <div class="welcome-box">
                    <h3>What You Can Do:</h3>
                    <ul>
                        <li>Upload your photos securely to your personal gallery</li>
                        <li>Create custom photo frames with our design tools</li>
                        <li>Get AI-powered gift recommendations</li>
                        <li>Track your orders and delivery status</li>
                        <li>Manage important dates for reminders</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://memoriesngifts.com/profile" class="button">Complete Your Profile</a>
                </div>
                
                <p><strong>Need Help?</strong><br>
                Our team is here to help you create beautiful memories!</p>
                
                <p>WhatsApp: <a href="https://wa.me/918148040148">+91 81480 40148</a><br>
                Email: <a href="mailto:support@memoriesngifts.com">support@memoriesngifts.com</a><br>
                Hours: Mon-Sat 9:30 AM - 9:00 PM</p>
            </div>
            
            <div class="footer">
                <p>Memories - Photo Frames & Custom Gifts<br>
                19B Kani Illam, Keeranatham Road, Coimbatore<br>
                <a href="https://memoriesngifts.com">memoriesngifts.com</a></p>
            </div>
        </body>
        </html>
        """
        
        try:
            template_obj = self.template_env.from_string(template)
            html_content = template_obj.render(**user_data)
            
            subject = "🎉 Welcome to Memories - Let's Create Beautiful Memories Together!"
            
            return await self._send_email(
                user_data['email'],
                subject,
                html_content
            )
            
        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")
            return False

# Global instance
email_service = HostingerEmailService()