package com.tribal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String userRole; // BUYER, SELLER, ADMIN
    
    @Column(nullable = false)
    private String type; // ORDER_PLACED, ORDER_SHIPPED, PRODUCT_APPROVED, etc.
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;
    
    @Column(name = "is_email_sent")
    @Builder.Default
    private Boolean isEmailSent = false;
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    // Optional: Reference to related entity
    private Long relatedEntityId; // Order ID, Product ID, etc.
    private String relatedEntityType; // ORDER, PRODUCT, USER, etc.
    
    // Priority level
    @Column(nullable = false)
    @Builder.Default
    private String priority = "NORMAL"; // LOW, NORMAL, HIGH, URGENT
    
    // Action URL (for frontend navigation)
    private String actionUrl;
}