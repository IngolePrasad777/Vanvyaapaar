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
import org.springframework.stereotype.Service;

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
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(userEmail);
        message.setSubject(appName + " - " + notification.getTitle());
        message.setText(buildEmailContent(notification));
        
        mailSender.send(message);
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
    
    // Custom email methods for specific scenarios
    
    public void sendWelcomeEmail(String email, String name, String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Welcome to " + appName + "!");
        
        String content = String.format(
            "Dear %s,\n\n" +
            "Welcome to %s! Your %s account has been created successfully.\n\n" +
            "You can now access your dashboard at: %s\n\n" +
            "Best regards,\n" +
            "%s Team",
            name, appName, role.toLowerCase(), appUrl, appName
        );
        
        message.setText(content);
        mailSender.send(message);
    }
    
    public void sendOrderConfirmationEmail(String email, String customerName, Long orderId, String orderDetails, double totalAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(appName + " - Order Confirmation #" + orderId);
        
        String content = String.format(
            "Dear %s,\n\n" +
            "Thank you for your order! Your order #%d has been confirmed.\n\n" +
            "Order Details:\n%s\n\n" +
            "Total Amount: ₹%.2f\n\n" +
            "You can track your order status at: %s/buyer/orders\n\n" +
            "Best regards,\n" +
            "%s Team",
            customerName, orderId, orderDetails, totalAmount, appUrl, appName
        );
        
        message.setText(content);
        mailSender.send(message);
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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(appName + " - " + notification.getTitle());
        
        String content = String.format(
            "Dear User,\n\n" +
            "%s\n\n" +
            "This is a test email sent at: %s\n\n" +
            "If you received this email, your VanVyapaar email system is configured correctly!\n\n" +
            "You can access your dashboard at: %s\n\n" +
            "Best regards,\n" +
            "%s Team\n\n" +
            "---\n" +
            "This is an automated test message from the VanVyapaar notification system.",
            notification.getMessage(),
            java.time.LocalDateTime.now().toString(),
            appUrl,
            appName
        );
        
        message.setText(content);
        mailSender.send(message);
    }
}