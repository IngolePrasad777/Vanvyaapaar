package com.tribal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "delivery_agents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAgent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String currentPincode;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AgentStatus status = AgentStatus.FREE;
    
    @Builder.Default
    private Integer currentWorkload = 0;
    
    @Builder.Default
    private Double rating = 5.0;
    
    @Builder.Default
    private Integer totalDeliveries = 0;
    
    @Builder.Default
    private Boolean isOnline = true;
    
    @Builder.Default
    private LocalDateTime lastActiveTime = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Vehicle information
    private String vehicleType; // BIKE, SCOOTER, BICYCLE, WALKING
    private String vehicleNumber;
    
    // Location tracking
    private Double currentLatitude;
    private Double currentLongitude;
    
    // Serviceability - Many-to-Many relationship with pincodes
    @ElementCollection
    @CollectionTable(name = "agent_serviceable_pincodes", 
                    joinColumns = @JoinColumn(name = "agent_id"))
    @Column(name = "pincode")
    private List<String> serviceablePincodes;
    
    public enum AgentStatus {
        FREE,           // Available for new assignments
        ASSIGNED,       // Order assigned but not accepted yet
        BUSY,          // Currently on delivery
        OFFLINE,       // Not available
        ON_BREAK       // Temporarily unavailable
    }
    
    // Helper methods
    public boolean canTakeNewOrder() {
        return isOnline && status == AgentStatus.FREE && currentWorkload < 3;
    }
    
    public boolean servicesArea(String pincode) {
        return serviceablePincodes != null && serviceablePincodes.contains(pincode);
    }
    
    public void incrementWorkload() {
        this.currentWorkload++;
        if (this.currentWorkload >= 3) {
            this.status = AgentStatus.BUSY;
        }
        this.updatedAt = LocalDateTime.now();
    }
    
    public void decrementWorkload() {
        this.currentWorkload = Math.max(0, this.currentWorkload - 1);
        if (this.currentWorkload < 3 && this.status == AgentStatus.BUSY) {
            this.status = AgentStatus.FREE;
        }
        this.updatedAt = LocalDateTime.now();
    }
}