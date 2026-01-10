package com.tribal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "serviceable_areas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceableArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String pincode;
    
    @Column(nullable = false)
    private String areaName;
    
    private String city;
    private String state;
    
    @Builder.Default
    private Boolean isActive = true;
    
    @Builder.Default
    private Boolean isPremium = false; // Premium areas with faster delivery
    
    @Builder.Default
    private Integer standardDeliveryDays = 3;
    
    @Builder.Default
    private Integer expressDeliveryDays = 1;
    
    @Builder.Default
    private Double deliveryCharge = 50.0;
    
    @Builder.Default
    private Double expressDeliveryCharge = 100.0;
    
    // Geographic coordinates for map display
    private Double latitude;
    private Double longitude;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Helper methods
    public boolean isServiceable() {
        return isActive;
    }
    
    public double getDeliveryChargeForType(String deliveryType) {
        if ("EXPRESS".equalsIgnoreCase(deliveryType)) {
            return expressDeliveryCharge;
        }
        return deliveryCharge;
    }
    
    public int getDeliveryDaysForType(String deliveryType) {
        if ("EXPRESS".equalsIgnoreCase(deliveryType)) {
            return expressDeliveryDays;
        }
        return standardDeliveryDays;
    }
}