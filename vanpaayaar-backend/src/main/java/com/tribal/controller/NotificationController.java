package com.tribal.controller;

import com.tribal.model.Notification;
import com.tribal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    // Get all notifications for a user
    @GetMapping("/{userId}/{userRole}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId,
            @PathVariable String userRole) {
        List<Notification> notifications = notificationService.getUserNotifications(userId, userRole);
        return ResponseEntity.ok(notifications);
    }
    
    // Get unread notifications for a user
    @GetMapping("/{userId}/{userRole}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Long userId,
            @PathVariable String userRole) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId, userRole);
        return ResponseEntity.ok(notifications);
    }
    
    // Get unread count
    @GetMapping("/{userId}/{userRole}/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long userId,
            @PathVariable String userRole) {
        Long count = notificationService.getUnreadCount(userId, userRole);
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }
    
    // Mark all notifications as read
    @PutMapping("/{userId}/{userRole}/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @PathVariable Long userId,
            @PathVariable String userRole) {
        notificationService.markAllAsRead(userId, userRole);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
    
    // Delete notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }
    
    // Create a test notification (for development/testing)
    @PostMapping("/test")
    public ResponseEntity<Notification> createTestNotification(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String userRole = request.get("userRole").toString();
        String type = request.get("type").toString();
        String title = request.get("title").toString();
        String message = request.get("message").toString();
        String priority = request.getOrDefault("priority", "NORMAL").toString();
        boolean sendEmail = Boolean.parseBoolean(request.getOrDefault("sendEmail", "false").toString());
        
        Notification notification = notificationService.createNotification(
            userId, userRole, type, title, message, priority,
            null, null, null, sendEmail
        );
        
        return ResponseEntity.ok(notification);
    }
    
    // Simple health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "timestamp", java.time.LocalDateTime.now().toString(),
            "message", "Notification service is running"
        ));
    }
    
    // Simple ping endpoint for CORS testing
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
    
    // Simple email test endpoint
    @PostMapping("/test-email")
    public ResponseEntity<Map<String, String>> testEmail(@RequestParam String email) {
        try {
            // Send test email using notification service
            notificationService.sendTestEmail(email);
            
            return ResponseEntity.ok(Map.of(
                "success", "true",
                "message", "Test email sent successfully to " + email,
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", "false",
                "error", "Failed to send test email: " + e.getMessage(),
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        }
    }
}