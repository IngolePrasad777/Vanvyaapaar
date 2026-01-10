package com.tribal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private DeliveryAgent agent;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.CREATED;
    
    // Address information
    @Column(nullable = false)
    private String pickupAddress;
    
    @Column(nullable = false)
    private String pickupPincode;
    
    @Column(nullable = false)
    private String deliveryAddress;
    
    @Column(nullable = false)
    private String deliveryPincode;
    
    // Contact information
    private String buyerName;
    private String buyerPhone;
    private String sellerName;
    private String sellerPhone;
    
    // Tracking information
    private String trackingId;
    
    // Location tracking
    private Double currentLatitude;
    private Double currentLongitude;
    
    // Estimated delivery time
    private LocalDateTime estimatedDeliveryTime;
    
    // Timestamps for each status
    private LocalDateTime createdAt;
    private LocalDateTime assignedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime inTransitAt;
    private LocalDateTime outForDeliveryAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime completedAt;
    
    // Additional information
    private String deliveryInstructions;
    private String agentNotes;
    private Integer attemptCount = 0;
    private String failureReason;
    
    // Rating and feedback
    private Integer buyerRating;
    private String buyerFeedback;
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum DeliveryStatus {
        CREATED,              // Delivery record created
        ASSIGNED,             // Agent assigned to delivery
        ACCEPTED_BY_AGENT,    // Agent accepted the delivery
        PICKED_UP,            // Package picked up from seller
        IN_TRANSIT,           // On the way to buyer
        OUT_FOR_DELIVERY,     // Near buyer location
        DELIVERED,            // Package delivered
        COMPLETED,            // Delivery completed and confirmed
        FAILED,               // Delivery failed
        RETURNED,             // Package returned to seller
        CANCELLED             // Delivery cancelled
    }
    
    // Helper methods
    public boolean canBeAssigned() {
        return status == DeliveryStatus.CREATED;
    }
    
    public boolean canBeAccepted() {
        return status == DeliveryStatus.ASSIGNED;
    }
    
    public boolean canBePickedUp() {
        return status == DeliveryStatus.ACCEPTED_BY_AGENT;
    }
    
    public boolean canBeDelivered() {
        return status == DeliveryStatus.OUT_FOR_DELIVERY;
    }
    
    public boolean isInProgress() {
        return status != DeliveryStatus.COMPLETED && 
               status != DeliveryStatus.FAILED && 
               status != DeliveryStatus.CANCELLED;
    }
    
    public void updateStatus(DeliveryStatus newStatus) {
        this.status = newStatus;
        this.updatedAt = LocalDateTime.now();
        
        // Set timestamp based on status
        switch (newStatus) {
            case CREATED:
                this.createdAt = LocalDateTime.now();
                break;
            case ASSIGNED:
                this.assignedAt = LocalDateTime.now();
                break;
            case ACCEPTED_BY_AGENT:
                this.acceptedAt = LocalDateTime.now();
                break;
            case PICKED_UP:
                this.pickedUpAt = LocalDateTime.now();
                break;
            case IN_TRANSIT:
                this.inTransitAt = LocalDateTime.now();
                break;
            case OUT_FOR_DELIVERY:
                this.outForDeliveryAt = LocalDateTime.now();
                break;
            case DELIVERED:
                this.deliveredAt = LocalDateTime.now();
                break;
            case COMPLETED:
                this.completedAt = LocalDateTime.now();
                break;
        }
    }
    
    public String generateTrackingId() {
        return "VV" + System.currentTimeMillis() + String.format("%04d", id != null ? id : 0);
    }
    
    public int getProgressPercentage() {
        switch (status) {
            case CREATED: return 0;
            case ASSIGNED: return 10;
            case ACCEPTED_BY_AGENT: return 20;
            case PICKED_UP: return 40;
            case IN_TRANSIT: return 60;
            case OUT_FOR_DELIVERY: return 80;
            case DELIVERED: return 90;
            case COMPLETED: return 100;
            default: return 0;
        }
    }
}