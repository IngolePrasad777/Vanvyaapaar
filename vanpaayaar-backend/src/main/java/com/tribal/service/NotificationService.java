package com.tribal.service;

import com.tribal.model.Notification;
import com.tribal.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    
    // Create a new notification
    @Transactional
    public Notification createNotification(Long userId, String userRole, String type, 
                                          String title, String message, String priority,
                                          Long relatedEntityId, String relatedEntityType,
                                          String actionUrl, boolean sendEmail) {
        Notification notification = Notification.builder()
                .userId(userId)
                .userRole(userRole)
                .type(type)
                .title(title)
                .message(message)
                .priority(priority)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .actionUrl(actionUrl)
                .isRead(false)
                .isEmailSent(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        Notification saved = notificationRepository.save(notification);
        
        // Send email if requested
        if (sendEmail) {
            try {
                emailService.sendNotificationEmail(saved);
                saved.setIsEmailSent(true);
                notificationRepository.save(saved);
            } catch (Exception e) {
                // Log error but don't fail the notification creation
                System.err.println("Failed to send email notification: " + e.getMessage());
            }
        }
        
        return saved;
    }
    
    // Get all notifications for a user
    public List<Notification> getUserNotifications(Long userId, String userRole) {
        return notificationRepository.findByUserIdAndUserRoleOrderByCreatedAtDesc(userId, userRole);
    }
    
    // Get unread notifications for a user
    public List<Notification> getUnreadNotifications(Long userId, String userRole) {
        return notificationRepository.findByUserIdAndUserRoleAndIsReadFalseOrderByCreatedAtDesc(userId, userRole);
    }
    
    // Get unread count
    public Long getUnreadCount(Long userId, String userRole) {
        return notificationRepository.countByUserIdAndUserRoleAndIsReadFalse(userId, userRole);
    }
    
    // Mark notification as read
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.markAsRead(notificationId, LocalDateTime.now());
    }
    
    // Mark all notifications as read
    @Transactional
    public void markAllAsRead(Long userId, String userRole) {
        notificationRepository.markAllAsRead(userId, userRole, LocalDateTime.now());
    }
    
    // Delete notification
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    // Delete old notifications (older than 30 days)
    @Transactional
    public void deleteOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteOldNotifications(cutoffDate);
    }
    
    // Notification type constants and helper methods
    public static final String ORDER_PLACED = "ORDER_PLACED";
    public static final String ORDER_CONFIRMED = "ORDER_CONFIRMED";
    public static final String ORDER_SHIPPED = "ORDER_SHIPPED";
    public static final String ORDER_DELIVERED = "ORDER_DELIVERED";
    public static final String ORDER_CANCELLED = "ORDER_CANCELLED";
    public static final String PAYMENT_SUCCESS = "PAYMENT_SUCCESS";
    public static final String PAYMENT_FAILED = "PAYMENT_FAILED";
    public static final String PRODUCT_APPROVED = "PRODUCT_APPROVED";
    public static final String PRODUCT_REJECTED = "PRODUCT_REJECTED";
    public static final String LOW_STOCK = "LOW_STOCK";
    public static final String ACCOUNT_APPROVED = "ACCOUNT_APPROVED";
    public static final String ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED";
    public static final String NEW_SELLER = "NEW_SELLER";
    public static final String NEW_COMPLAINT = "NEW_COMPLAINT";
    public static final String REVIEW_ADDED = "REVIEW_ADDED";
    
    // Email test method
    public void sendTestEmail(String email) {
        Notification testNotification = Notification.builder()
            .userId(1L)
            .userRole("BUYER")
            .type("EMAIL_TEST")
            .title("VanVyapaar Email System Test")
            .message("This is a test email to verify that the VanVyapaar email system is working correctly. If you receive this email, the SMTP configuration is successful!")
            .priority("NORMAL")
            .isRead(false)
            .isEmailSent(false)
            .createdAt(LocalDateTime.now())
            .build();
        
        // Send email using a custom recipient
        try {
            emailService.sendTestEmail(email, testNotification);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send test email: " + e.getMessage(), e);
        }
    }
    
    // Helper methods for common notifications
    
    public void notifyOrderPlaced(Long buyerId, Long orderId, String orderDetails) {
        createNotification(
            buyerId, "BUYER", ORDER_PLACED,
            "Order Placed Successfully",
            "Your order #" + orderId + " has been placed successfully. " + orderDetails,
            "NORMAL", orderId, "ORDER", "/buyer/orders", true
        );
    }
    
    public void notifySellerNewOrder(Long sellerId, Long orderId, String orderDetails) {
        createNotification(
            sellerId, "SELLER", ORDER_PLACED,
            "New Order Received",
            "You have received a new order #" + orderId + ". " + orderDetails,
            "HIGH", orderId, "ORDER", "/seller/orders", true
        );
    }
    
    public void notifyOrderStatusUpdate(Long buyerId, Long orderId, String status, String details) {
        String title = "Order " + status;
        createNotification(
            buyerId, "BUYER", "ORDER_" + status.toUpperCase(),
            title,
            "Your order #" + orderId + " has been " + status.toLowerCase() + ". " + details,
            "NORMAL", orderId, "ORDER", "/buyer/orders", true
        );
    }
    
    public void notifyProductApproved(Long sellerId, Long productId, String productName) {
        createNotification(
            sellerId, "SELLER", PRODUCT_APPROVED,
            "Product Approved",
            "Your product '" + productName + "' has been approved and is now live on the platform.",
            "NORMAL", productId, "PRODUCT", "/seller/products", true
        );
    }
    
    public void notifyProductRejected(Long sellerId, Long productId, String productName, String reason) {
        createNotification(
            sellerId, "SELLER", PRODUCT_REJECTED,
            "Product Rejected",
            "Your product '" + productName + "' has been rejected. Reason: " + reason,
            "HIGH", productId, "PRODUCT", "/seller/products", true
        );
    }
    
    public void notifyLowStock(Long sellerId, Long productId, String productName, int stock) {
        createNotification(
            sellerId, "SELLER", LOW_STOCK,
            "Low Stock Alert",
            "Your product '" + productName + "' is running low on stock. Current stock: " + stock,
            "HIGH", productId, "PRODUCT", "/seller/products", true
        );
    }
    
    public void notifyAccountApproved(Long sellerId, String sellerName) {
        createNotification(
            sellerId, "SELLER", ACCOUNT_APPROVED,
            "Account Approved",
            "Congratulations! Your seller account has been approved. You can now start listing products.",
            "HIGH", sellerId, "USER", "/seller", true
        );
    }
    
    public void notifyAccountSuspended(Long sellerId, String reason) {
        createNotification(
            sellerId, "SELLER", ACCOUNT_SUSPENDED,
            "Account Suspended",
            "Your account has been suspended. Reason: " + reason + ". Please contact support for more information.",
            "URGENT", sellerId, "USER", "/seller/profile", true
        );
    }
    
    public void notifyAdminNewSeller(Long adminId, Long sellerId, String sellerName) {
        createNotification(
            adminId, "ADMIN", NEW_SELLER,
            "New Seller Registration",
            "A new seller '" + sellerName + "' has registered and is awaiting approval.",
            "NORMAL", sellerId, "USER", "/admin/sellers", false
        );
    }
    
    public void notifyAdminNewComplaint(Long adminId, Long complaintId, String subject) {
        createNotification(
            adminId, "ADMIN", NEW_COMPLAINT,
            "New Complaint Raised",
            "A new complaint has been raised: " + subject,
            "HIGH", complaintId, "COMPLAINT", "/admin/complaints", false
        );
    }
}