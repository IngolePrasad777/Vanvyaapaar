package com.tribal.service;

import com.tribal.model.Notification;
import com.tribal.model.Admin;
import com.tribal.model.Buyer;
import com.tribal.model.Seller;
import com.tribal.repository.AdminRepository;
import com.tribal.repository.BuyerRepository;
import com.tribal.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final BuyerRepository buyerRepository;
    private final SellerRepository sellerRepository;
    private final AdminRepository adminRepository;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.name:VanVyapaar}")
    private String appName;
    
    @Value("${app.url:http://localhost:3000}")
    private String appUrl;
    
    public void sendNotificationEmail(Notification notification) {
        String userEmail = getUserEmail(notification.getUserId(), notification.getUserRole());
        if (userEmail == null) {
            throw new RuntimeException("User email not found");
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(userEmail);
            helper.setSubject("🎨 " + appName + " - " + notification.getTitle());
            helper.setText(buildEnhancedEmailContent(notification), true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    private String getUserEmail(Long userId, String userRole) {
        switch (userRole) {
            case "BUYER":
                Optional<Buyer> buyer = buyerRepository.findById(userId);
                return buyer.map(Buyer::getEmail).orElse(null);
            case "SELLER":
                Optional<Seller> seller = sellerRepository.findById(userId);
                return seller.map(Seller::getEmail).orElse(null);
            case "ADMIN":
                Optional<Admin> admin = adminRepository.findById(userId);
                return admin.map(Admin::getEmail).orElse(null);
            default:
                return null;
        }
    }
    
    private String buildEmailContent(Notification notification) {
        StringBuilder content = new StringBuilder();
        
        content.append("Dear User,\n\n");
        content.append(notification.getMessage()).append("\n\n");
        
        if (notification.getActionUrl() != null) {
            content.append("You can view more details by visiting: ");
            content.append(appUrl).append(notification.getActionUrl()).append("\n\n");
        }
        
        content.append("Best regards,\n");
        content.append(appName).append(" Team\n\n");
        content.append("---\n");
        content.append("This is an automated message. Please do not reply to this email.\n");
        content.append("If you have any questions, please contact our support team.");
        
        return content.toString();
    }
    
    private String buildEnhancedEmailContent(Notification notification) {
        String userName = getUserName(notification.getUserId(), notification.getUserRole());
        
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #FAFAF9; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #f59532 0%%, #e35d00 100%%); padding: 40px 30px; text-align: center; color: white; position: relative; }
                    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23ffffff' fill-opacity='0.1'%%3E%%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .header h1 { margin: 0; font-size: 32px; font-weight: 700; font-family: 'Playfair Display', serif; text-shadow: 0 2px 4px rgba(0,0,0,0.3); position: relative; z-index: 1; }
                    .header .subtitle { margin: 15px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 400; position: relative; z-index: 1; }
                    .content { padding: 40px 30px; background: #FAFAF9; }
                    .greeting { font-size: 20px; color: #8B4513; margin-bottom: 25px; font-weight: 600; font-family: 'Playfair Display', serif; }
                    .message-box { background: linear-gradient(135deg, #FFF8F0 0%%, #F5F5DC 100%%); border-left: 5px solid #f59532; padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(245, 149, 50, 0.1); }
                    .message-text { font-size: 16px; line-height: 1.7; color: #2D1810; margin: 0; font-weight: 400; }
                    .action-button { display: inline-block; background: linear-gradient(135deg, #f59532 0%%, #e35d00 100%%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 10px 0 0; box-shadow: 0 8px 25px rgba(245, 149, 50, 0.3); transition: all 0.3s ease; font-family: 'Inter', sans-serif; }
                    .footer { background: #2D1810; color: #D4A574; padding: 40px 30px; text-align: center; position: relative; }
                    .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23D4A574' fill-opacity='0.05'%%3E%%3Ccircle cx='50' cy='50' r='4'/%%3E%%3Ccircle cx='50' cy='50' r='12' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.1'/%%3E%%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.08'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .footer-brand { font-size: 24px; font-weight: 700; margin-bottom: 10px; font-family: 'Playfair Display', serif; color: #D4A574; position: relative; z-index: 1; }
                    .footer-tagline { font-style: italic; opacity: 0.9; margin-bottom: 25px; font-size: 14px; color: #C9A86A; position: relative; z-index: 1; }
                    .footer-links { margin: 25px 0; position: relative; z-index: 1; }
                    .footer-links a { color: #f59532; text-decoration: none; margin: 0 15px; font-weight: 500; font-size: 14px; }
                    .tribal-border { height: 8px; background: linear-gradient(90deg, #f59532 0%%, #e35d00 25%%, #D4A574 50%%, #C9A86A 75%%, #8B7355 100%%); }
                    .disclaimer { font-size: 12px; color: #A0826D; margin-top: 25px; line-height: 1.5; position: relative; z-index: 1; }
                    .heritage-message { background: linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%%, rgba(201, 168, 106, 0.1) 100%%); border: 1px solid rgba(212, 165, 116, 0.3); padding: 20px; border-radius: 12px; margin: 25px 0; }
                    .heritage-text { color: #8B4513; font-size: 15px; line-height: 1.6; margin: 0; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="tribal-border"></div>
                    <div class="header">
                        <h1>🎨 VanVyapaar</h1>
                        <div class="subtitle">Celebrating Tribal Crafts & Artisan Heritage</div>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            🙏 Namaste %s,
                        </div>
                        
                        <div class="message-box">
                            <p class="message-text">%s</p>
                        </div>
                        
                        %s
                        
                        <div class="heritage-message">
                            <p class="heritage-text">
                                "Thank you for being part of our mission to preserve and celebrate authentic tribal craftsmanship. 
                                Every interaction supports our artisan communities and helps keep traditional art forms alive 
                                for future generations."
                            </p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-brand">🌿 VanVyapaar</div>
                        <div class="footer-tagline">"Where Heritage Meets Contemporary Elegance"</div>
                        
                        <div class="footer-links">
                            <a href="%s">🏠 Home</a>
                            <a href="%s/products">🎨 Products</a>
                            <a href="%s/artisans">👥 Artisans</a>
                            <a href="%s/about">ℹ️ About Us</a>
                        </div>
                        
                        <div class="disclaimer">
                            This is an automated message from VanVyapaar. Please do not reply to this email.<br>
                            For support, contact us at support@vanvyapaar.com or visit our help center.<br>
                            <br>
                            🌱 <em>Supporting Tribal Communities • Preserving Heritage • Promoting Sustainability</em>
                        </div>
                    </div>
                    
                    <div class="tribal-border"></div>
                </div>
            </body>
            </html>
            """, 
            notification.getTitle(),
            userName != null ? userName : "Valued Customer",
            notification.getMessage(),
            notification.getActionUrl() != null ? 
                String.format("<a href=\"%s%s\" class=\"action-button\">🔗 View Details</a>", appUrl, notification.getActionUrl()) : "",
            appUrl, appUrl, appUrl, appUrl
        );
    }
    
    private String getUserName(Long userId, String userRole) {
        switch (userRole) {
            case "BUYER":
                Optional<Buyer> buyer = buyerRepository.findById(userId);
                return buyer.map(Buyer::getName).orElse(null);
            case "SELLER":
                Optional<Seller> seller = sellerRepository.findById(userId);
                return seller.map(Seller::getName).orElse(null);
            case "ADMIN":
                Optional<Admin> admin = adminRepository.findById(userId);
                return admin.map(Admin::getName).orElse(null);
            default:
                return null;
        }
    }
    
    // Custom email methods for specific scenarios
    
    public void sendWelcomeEmail(String email, String name, String role) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("🎉 Welcome to " + appName + " - Your Journey Begins!");
            helper.setText(buildWelcomeEmail(name, role), true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }
    
    private String buildWelcomeEmail(String name, String role) {
        String roleMessage = "";
        String roleIcon = "";
        String roleSpecificContent = "";
        
        switch (role.toUpperCase()) {
            case "BUYER":
                roleIcon = "🛍️";
                roleMessage = "Welcome to our marketplace of authentic tribal crafts!";
                roleSpecificContent = """
                    <li>🎨 Browse thousands of handcrafted products from master artisans</li>
                    <li>💝 Create your personal wishlist of favorite items</li>
                    <li>🛒 Enjoy seamless shopping with secure checkout</li>
                    <li>📦 Track your orders in real-time from craft to doorstep</li>
                    <li>⭐ Share your experience through reviews and ratings</li>
                    """;
                break;
            case "SELLER":
                roleIcon = "🎨";
                roleMessage = "Welcome to our vibrant artisan community!";
                roleSpecificContent = """
                    <li>📸 Showcase your handcrafted masterpieces to the world</li>
                    <li>💰 Manage your earnings and track sales performance</li>
                    <li>📊 Access detailed analytics and customer insights</li>
                    <li>🤝 Connect directly with customers who value your craft</li>
                    <li>🌟 Build your artisan brand and tell your story</li>
                    """;
                break;
            case "ADMIN":
                roleIcon = "⚡";
                roleMessage = "Welcome to the VanVyapaar admin dashboard!";
                roleSpecificContent = """
                    <li>👥 Manage and support our artisan and buyer communities</li>
                    <li>📦 Oversee orders and ensure smooth transactions</li>
                    <li>📊 Monitor platform analytics and growth metrics</li>
                    <li>🛡️ Moderate content and maintain quality standards</li>
                    <li>⚙️ Configure platform settings and features</li>
                    """;
                break;
        }
        
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to VanVyapaar</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #FAFAF9; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #f59532 0%%, #e35d00 100%%); padding: 40px 30px; text-align: center; color: white; position: relative; }
                    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23ffffff' fill-opacity='0.1'%%3E%%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .welcome-icon { font-size: 64px; margin-bottom: 20px; position: relative; z-index: 1; }
                    .header h1 { margin: 0; font-size: 32px; font-weight: 700; font-family: 'Playfair Display', serif; text-shadow: 0 2px 4px rgba(0,0,0,0.3); position: relative; z-index: 1; }
                    .header .subtitle { margin: 15px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 400; position: relative; z-index: 1; }
                    .content { padding: 40px 30px; background: #FAFAF9; }
                    .greeting { font-size: 20px; color: #8B4513; margin-bottom: 25px; font-weight: 600; font-family: 'Playfair Display', serif; }
                    .welcome-message { background: linear-gradient(135deg, #FFF8F0 0%%, #F5F5DC 100%%); border-left: 5px solid #f59532; padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(245, 149, 50, 0.1); }
                    .features-list { background: linear-gradient(135deg, #FFF8F0 0%%, #F5F5DC 100%%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(212, 165, 116, 0.2); }
                    .features-list h3 { color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; }
                    .features-list ul { color: #2D1810; line-height: 1.8; font-weight: 400; }
                    .features-list li { margin-bottom: 8px; }
                    .action-button { display: inline-block; background: linear-gradient(135deg, #f59532 0%%, #e35d00 100%%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 10px 0 0; box-shadow: 0 8px 25px rgba(245, 149, 50, 0.3); transition: all 0.3s ease; font-family: 'Inter', sans-serif; }
                    .footer { background: #2D1810; color: #D4A574; padding: 40px 30px; text-align: center; position: relative; }
                    .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23D4A574' fill-opacity='0.05'%%3E%%3Ccircle cx='50' cy='50' r='4'/%%3E%%3Ccircle cx='50' cy='50' r='12' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.1'/%%3E%%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.08'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .footer-brand { font-size: 24px; font-weight: 700; margin-bottom: 10px; font-family: 'Playfair Display', serif; color: #D4A574; position: relative; z-index: 1; }
                    .footer-tagline { font-style: italic; opacity: 0.9; margin-bottom: 25px; font-size: 14px; color: #C9A86A; position: relative; z-index: 1; }
                    .tribal-border { height: 8px; background: linear-gradient(90deg, #f59532 0%%, #e35d00 25%%, #D4A574 50%%, #C9A86A 75%%, #8B7355 100%%); }
                    .disclaimer { font-size: 12px; color: #A0826D; margin-top: 25px; line-height: 1.5; position: relative; z-index: 1; }
                    .heritage-message { background: linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%%, rgba(201, 168, 106, 0.1) 100%%); border: 1px solid rgba(212, 165, 116, 0.3); padding: 20px; border-radius: 12px; margin: 25px 0; }
                    .heritage-text { color: #8B4513; font-size: 15px; line-height: 1.6; margin: 0; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="tribal-border"></div>
                    <div class="header">
                        <div class="welcome-icon">%s</div>
                        <h1>🎨 Welcome to VanVyapaar!</h1>
                        <div class="subtitle">Celebrating Tribal Crafts & Artisan Heritage</div>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            🙏 Namaste %s,
                        </div>
                        
                        <div class="welcome-message">
                            <p style="margin: 0; color: #2D1810; font-size: 16px; line-height: 1.7;">
                                <strong>%s</strong><br><br>
                                Your %s account has been created successfully! We're thrilled to have you join our community 
                                dedicated to preserving and celebrating authentic tribal craftsmanship.
                            </p>
                        </div>
                        
                        <div class="features-list">
                            <h3>🌟 What you can do:</h3>
                            <ul>
                                %s
                            </ul>
                        </div>
                        
                        <div class="heritage-message">
                            <p class="heritage-text">
                                At VanVyapaar, every interaction supports tribal communities and helps preserve traditional art forms 
                                for future generations. Together, we're building a sustainable ecosystem where heritage meets 
                                contemporary elegance.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="%s" class="action-button">🚀 Get Started</a>
                            <a href="%s/about" class="action-button">📖 Learn More</a>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-brand">🌿 VanVyapaar</div>
                        <div class="footer-tagline">"Where Heritage Meets Contemporary Elegance"</div>
                        
                        <div class="disclaimer">
                            Welcome to the VanVyapaar family! For any questions, contact us at support@vanvyapaar.com<br>
                            <br>
                            🌱 <em>Supporting Tribal Communities • Preserving Heritage • Promoting Sustainability</em>
                        </div>
                    </div>
                    
                    <div class="tribal-border"></div>
                </div>
            </body>
            </html>
            """, 
            roleIcon, name != null ? name : "Valued User", roleMessage, role.toLowerCase(), 
            roleSpecificContent, appUrl, appUrl
        );
    }
    
    public void sendOrderConfirmationEmail(String email, String customerName, Long orderId, String orderDetails, double totalAmount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("🎉 " + appName + " - Payment Successful! Order #" + orderId);
            helper.setText(buildPaymentSuccessEmail(customerName, orderId, orderDetails, totalAmount), true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send order confirmation email", e);
        }
    }
    
    private String buildPaymentSuccessEmail(String customerName, Long orderId, String orderDetails, double totalAmount) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Successful - VanVyapaar</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #FAFAF9; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%); padding: 40px 30px; text-align: center; color: white; position: relative; }
                    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23ffffff' fill-opacity='0.15'%%3E%%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .success-icon { font-size: 64px; margin-bottom: 20px; position: relative; z-index: 1; }
                    .header h1 { margin: 0; font-size: 32px; font-weight: 700; font-family: 'Playfair Display', serif; text-shadow: 0 2px 4px rgba(0,0,0,0.3); position: relative; z-index: 1; }
                    .header .subtitle { margin: 15px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 400; position: relative; z-index: 1; }
                    .content { padding: 40px 30px; background: #FAFAF9; }
                    .greeting { font-size: 20px; color: #8B4513; margin-bottom: 25px; font-weight: 600; font-family: 'Playfair Display', serif; }
                    .order-summary { background: linear-gradient(135deg, #FFF8F0 0%%, #F5F5DC 100%%); border: 2px solid #28a745; padding: 30px; border-radius: 15px; margin: 30px 0; box-shadow: 0 8px 25px rgba(40, 167, 69, 0.15); }
                    .order-header { font-size: 22px; font-weight: 700; color: #28a745; margin-bottom: 20px; text-align: center; font-family: 'Playfair Display', serif; }
                    .order-details { font-size: 16px; line-height: 2; color: #2D1810; font-weight: 500; }
                    .amount-highlight { background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%); color: white; padding: 20px; border-radius: 15px; text-align: center; font-size: 28px; font-weight: 700; margin: 25px 0; box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3); font-family: 'Playfair Display', serif; }
                    .action-button { display: inline-block; background: linear-gradient(135deg, #f59532 0%%, #e35d00 100%%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 10px 0 0; box-shadow: 0 8px 25px rgba(245, 149, 50, 0.3); transition: all 0.3s ease; font-family: 'Inter', sans-serif; }
                    .artisan-message { background: linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%%, rgba(201, 168, 106, 0.15) 100%%); border-left: 5px solid #D4A574; padding: 25px; border-radius: 12px; margin: 30px 0; }
                    .footer { background: #2D1810; color: #D4A574; padding: 40px 30px; text-align: center; position: relative; }
                    .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23D4A574' fill-opacity='0.05'%%3E%%3Ccircle cx='50' cy='50' r='4'/%%3E%%3Ccircle cx='50' cy='50' r='12' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.1'/%%3E%%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.08'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .footer-brand { font-size: 24px; font-weight: 700; margin-bottom: 10px; font-family: 'Playfair Display', serif; color: #D4A574; position: relative; z-index: 1; }
                    .footer-tagline { font-style: italic; opacity: 0.9; margin-bottom: 25px; font-size: 14px; color: #C9A86A; position: relative; z-index: 1; }
                    .footer-links { margin: 25px 0; position: relative; z-index: 1; }
                    .footer-links a { color: #f59532; text-decoration: none; margin: 0 15px; font-weight: 500; font-size: 14px; }
                    .tribal-border { height: 8px; background: linear-gradient(90deg, #28a745 0%%, #20c997 25%%, #D4A574 50%%, #C9A86A 75%%, #8B7355 100%%); }
                    .disclaimer { font-size: 12px; color: #A0826D; margin-top: 25px; line-height: 1.5; position: relative; z-index: 1; }
                    .next-steps { background: linear-gradient(135deg, #FFF8F0 0%%, #F5F5DC 100%%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(212, 165, 116, 0.2); }
                    .next-steps h3 { color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; }
                    .next-steps ul { color: #2D1810; line-height: 1.8; font-weight: 400; }
                    .next-steps li { margin-bottom: 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="tribal-border"></div>
                    <div class="header">
                        <div class="success-icon">✅</div>
                        <h1>🎨 Payment Successful!</h1>
                        <div class="subtitle">Your order has been confirmed</div>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            🙏 Namaste %s,
                        </div>
                        
                        <p style="color: #2D1810; font-size: 16px; line-height: 1.7; margin-bottom: 25px;">
                            Thank you for your purchase! Your payment has been processed successfully, and your order is now confirmed. 
                            Our skilled artisans are excited to prepare your handcrafted treasures with love and traditional care.
                        </p>
                        
                        <div class="order-summary">
                            <div class="order-header">📦 Order Summary</div>
                            <div class="order-details">
                                <strong>Order Number:</strong> #%d<br>
                                <strong>Order Date:</strong> %s<br>
                                <strong>Status:</strong> <span style="color: #28a745; font-weight: 700;">✅ Confirmed & Processing</span>
                            </div>
                        </div>
                        
                        <div class="amount-highlight">
                            💰 Total Paid: ₹%.2f
                        </div>
                        
                        <div class="artisan-message">
                            <p style="margin: 0; color: #8B4513; font-size: 16px; line-height: 1.7; font-style: italic;">
                                <strong>🎨 Message from Our Artisan Community:</strong><br><br>
                                "Dhanyawad! Thank you for supporting our tribal heritage and craftsmanship. Your purchase helps preserve 
                                our ancestral art forms and provides sustainable livelihoods for our families. Each item is crafted 
                                with generations of inherited skills, love, and cultural pride."
                            </p>
                        </div>
                        
                        <div class="next-steps">
                            <h3>📋 What happens next?</h3>
                            <ul>
                                <li><strong>Artisan Assignment:</strong> Your order is assigned to our master craftspeople within 2 hours</li>
                                <li><strong>Handcrafting Process:</strong> Each item is carefully made using traditional techniques</li>
                                <li><strong>Quality Assurance:</strong> Every piece undergoes thorough quality inspection</li>
                                <li><strong>Eco-Friendly Packaging:</strong> Sustainably packaged with biodegradable materials</li>
                                <li><strong>Secure Shipping:</strong> Tracking details sent once your order ships</li>
                                <li><strong>Delivery:</strong> Expected delivery within 5-7 business days</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="%s/buyer/orders" class="action-button">📱 Track Your Order</a>
                            <a href="%s/products" class="action-button">🛍️ Continue Shopping</a>
                        </div>
                        
                        <p style="color: #8B4513; line-height: 1.7; margin-top: 30px; text-align: center; font-style: italic; background: linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%%, rgba(201, 168, 106, 0.1) 100%%); padding: 20px; border-radius: 12px;">
                            🌱 <strong>Sustainable Commitment:</strong> We use eco-friendly, biodegradable packaging materials 
                            to protect both your precious handcrafted items and our beautiful environment.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-brand">🌿 VanVyapaar</div>
                        <div class="footer-tagline">"Where Heritage Meets Contemporary Elegance"</div>
                        
                        <div class="footer-links">
                            <a href="%s">🏠 Home</a>
                            <a href="%s/products">🎨 Products</a>
                            <a href="%s/buyer/orders">📦 My Orders</a>
                            <a href="%s/about">ℹ️ About Us</a>
                        </div>
                        
                        <div class="disclaimer">
                            This is an automated confirmation from VanVyapaar. Please save this email for your records.<br>
                            For support, contact us at support@vanvyapaar.com or WhatsApp: +91-XXXXXXXXXX<br>
                            <br>
                            🌱 <em>Supporting Tribal Communities • Preserving Heritage • Promoting Sustainability</em><br>
                            💚 <em>Thank you for choosing authentic, handcrafted products!</em>
                        </div>
                    </div>
                    
                    <div class="tribal-border"></div>
                </div>
            </body>
            </html>
            """, 
            customerName != null ? customerName : "Valued Customer",
            orderId,
            java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")),
            totalAmount,
            appUrl, appUrl, appUrl, appUrl, appUrl, appUrl
        );
    }
    
    public void sendPasswordResetEmail(String email, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(appName + " - Password Reset Request");
        
        String resetUrl = appUrl + "/reset-password?token=" + resetToken;
        String content = String.format(
            "Dear User,\n\n" +
            "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you did not request this password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "%s Team",
            resetUrl, appName
        );
        
        message.setText(content);
        mailSender.send(message);
    }
    
    public void sendTestEmail(String email, Notification notification) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("🧪 " + appName + " - Test Email: " + notification.getTitle());
            helper.setText(buildTestEmail(notification), true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send test email", e);
        }
    }
    
    private String buildTestEmail(Notification notification) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Test Email - VanVyapaar</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #FAFAF9; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #17a2b8 0%%, #6f42c1 100%%); padding: 40px 30px; text-align: center; color: white; position: relative; }
                    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23ffffff' fill-opacity='0.15'%%3E%%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .test-icon { font-size: 64px; margin-bottom: 20px; position: relative; z-index: 1; }
                    .header h1 { margin: 0; font-size: 32px; font-weight: 700; font-family: 'Playfair Display', serif; text-shadow: 0 2px 4px rgba(0,0,0,0.3); position: relative; z-index: 1; }
                    .header .subtitle { margin: 15px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 400; position: relative; z-index: 1; }
                    .content { padding: 40px 30px; background: #FAFAF9; }
                    .test-info { background: linear-gradient(135deg, #E3F2FD 0%%, #E1F5FE 100%%); border: 2px solid #17a2b8; padding: 30px; border-radius: 15px; margin: 30px 0; box-shadow: 0 8px 25px rgba(23, 162, 184, 0.15); }
                    .test-details { font-size: 14px; color: #0c5460; line-height: 1.8; font-weight: 500; }
                    .message-box { background: linear-gradient(135deg, #FFF8F0 0%%, #F5F5DC 100%%); border-left: 5px solid #17a2b8; padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(23, 162, 184, 0.1); }
                    .footer { background: #2D1810; color: #D4A574; padding: 40px 30px; text-align: center; position: relative; }
                    .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%%3E%%3Cg fill='none' fill-rule='evenodd'%%3E%%3Cg fill='%%23D4A574' fill-opacity='0.05'%%3E%%3Ccircle cx='50' cy='50' r='4'/%%3E%%3Ccircle cx='50' cy='50' r='12' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.1'/%%3E%%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='%%23D4A574' stroke-width='1' stroke-opacity='0.08'/%%3E%%3C/g%%3E%%3C/g%%3E%%3C/svg%%3E"); opacity: 0.3; }
                    .footer-brand { font-size: 24px; font-weight: 700; margin-bottom: 10px; font-family: 'Playfair Display', serif; color: #D4A574; position: relative; z-index: 1; }
                    .tribal-border { height: 8px; background: linear-gradient(90deg, #17a2b8 0%%, #6f42c1 25%%, #D4A574 50%%, #C9A86A 75%%, #8B7355 100%%); }
                    .disclaimer { font-size: 12px; color: #A0826D; margin-top: 25px; line-height: 1.5; position: relative; z-index: 1; }
                    .success-badge { background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%); color: white; padding: 12px 25px; border-radius: 25px; display: inline-block; font-weight: 600; margin: 20px 0; font-family: 'Inter', sans-serif; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3); }
                    .next-steps { background: linear-gradient(135deg, #FFF3CD 0%%, #FFEAA7 100%%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(255, 193, 7, 0.3); }
                    .next-steps h3 { color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; }
                    .next-steps ul { color: #2D1810; line-height: 1.8; font-weight: 400; }
                    .next-steps li { margin-bottom: 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="tribal-border"></div>
                    <div class="header">
                        <div class="test-icon">🧪</div>
                        <h1>🎨 Email System Test</h1>
                        <div class="subtitle">VanVyapaar Notification Service</div>
                    </div>
                    
                    <div class="content">
                        <div class="success-badge">✅ Email System Working Perfectly!</div>
                        
                        <p style="color: #2D1810; font-size: 16px; line-height: 1.7; margin-bottom: 25px;">
                            🙏 Namaste! This is a test email from the VanVyapaar notification system to verify that 
                            our email infrastructure is functioning correctly.
                        </p>
                        
                        <div class="message-box">
                            <p style="margin: 0; color: #2D1810; font-size: 16px; line-height: 1.7;">
                                <strong>Test Message:</strong><br><br>
                                %s
                            </p>
                        </div>
                        
                        <div class="test-info">
                            <div class="test-details">
                                <strong>📧 Email Configuration Status:</strong> ✅ Operational<br>
                                <strong>🕐 Test Executed At:</strong> %s<br>
                                <strong>🎯 Test Type:</strong> Notification System Verification<br>
                                <strong>🔧 Email Service:</strong> VanVyapaar Mail System<br>
                                <strong>📱 Technology Stack:</strong> Spring Boot + JavaMail + Gmail SMTP<br>
                                <strong>🌐 Environment:</strong> Production Ready
                            </div>
                        </div>
                        
                        <p style="color: #2D1810; line-height: 1.7; margin: 30px 0; text-align: center; font-size: 16px;">
                            <strong>🎉 Congratulations!</strong><br>
                            Your VanVyapaar email system is properly configured and ready to deliver beautiful, 
                            branded notifications to your users.
                        </p>
                        
                        <div class="next-steps">
                            <h3>🔍 System Verification Complete</h3>
                            <ul>
                                <li><strong>✅ SMTP Configuration:</strong> Gmail integration working</li>
                                <li><strong>✅ HTML Templates:</strong> Branded email templates active</li>
                                <li><strong>✅ Notification Service:</strong> Ready for production use</li>
                                <li><strong>✅ Email Delivery:</strong> Successfully reaching recipients</li>
                                <li><strong>✅ Template Rendering:</strong> All styles and fonts loading</li>
                                <li><strong>✅ Mobile Compatibility:</strong> Responsive design verified</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-brand">🌿 VanVyapaar</div>
                        
                        <div class="disclaimer">
                            This is an automated test message from the VanVyapaar notification system.<br>
                            Email infrastructure is functioning correctly! 🚀<br>
                            <br>
                            🌱 <em>Supporting Tribal Communities • Preserving Heritage • Promoting Sustainability</em>
                        </div>
                    </div>
                    
                    <div class="tribal-border"></div>
                </div>
            </body>
            </html>
            """, 
            notification.getMessage(),
            java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm:ss a"))
        );
    }
}