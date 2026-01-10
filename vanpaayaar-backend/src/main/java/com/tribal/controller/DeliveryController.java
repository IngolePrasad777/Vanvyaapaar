package com.tribal.controller;

import com.tribal.model.Delivery;
import com.tribal.model.DeliveryAgent;
import com.tribal.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    // Test endpoint to verify delivery system is working
    @GetMapping("/test")
    public ResponseEntity<?> testDeliverySystem() {
        try {
            Map<String, Object> testResult = Map.of(
                "status", "Delivery system is working",
                "timestamp", java.time.LocalDateTime.now().toString(),
                "endpoints", List.of(
                    "/api/delivery/track/{trackingId}",
                    "/api/delivery/serviceable/{pincode}",
                    "/api/delivery/charge/{pincode}/{deliveryType}",
                    "/api/delivery/analytics"
                )
            );
            return ResponseEntity.ok(testResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error in delivery system: " + e.getMessage());
        }
    }

    // Public tracking endpoint
    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> trackDelivery(@PathVariable String trackingId) {
        try {
            Optional<Delivery> delivery = deliveryService.trackDelivery(trackingId);
            if (delivery.isPresent()) {
                return ResponseEntity.ok(delivery.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error tracking delivery: " + e.getMessage());
        }
    }

    // Check pincode serviceability
    @GetMapping("/serviceable/{pincode}")
    public ResponseEntity<?> checkServiceability(@PathVariable String pincode) {
        try {
            boolean isServiceable = deliveryService.isPincodeServiceable(pincode);
            return ResponseEntity.ok(isServiceable);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking serviceability: " + e.getMessage());
        }
    }

    // Get delivery charge for specific type
    @GetMapping("/charge/{pincode}/{deliveryType}")
    public ResponseEntity<?> getDeliveryCharge(@PathVariable String pincode, @PathVariable String deliveryType) {
        try {
            Double charge = deliveryService.getDeliveryCharge(pincode, deliveryType);
            return ResponseEntity.ok(charge);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting delivery charge: " + e.getMessage());
        }
    }

    // Get estimated delivery days
    @GetMapping("/estimate/{pincode}/{deliveryType}")
    public ResponseEntity<?> getEstimatedDeliveryDays(@PathVariable String pincode, @PathVariable String deliveryType) {
        try {
            Integer days = deliveryService.getEstimatedDeliveryDays(pincode, deliveryType);
            return ResponseEntity.ok(days);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting delivery estimate: " + e.getMessage());
        }
    }

    // Check pincode serviceability (alternative endpoint)
    @GetMapping("/serviceability/{pincode}")
    public ResponseEntity<?> checkServiceabilityDetailed(@PathVariable String pincode) {
        try {
            boolean isServiceable = deliveryService.isPincodeServiceable(pincode);
            Double deliveryCharge = deliveryService.getDeliveryCharge(pincode, "STANDARD");
            Integer deliveryDays = deliveryService.getEstimatedDeliveryDays(pincode, "STANDARD");
            
            Map<String, Object> response = Map.of(
                "serviceable", isServiceable,
                "deliveryCharge", deliveryCharge,
                "estimatedDays", deliveryDays,
                "pincode", pincode
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking serviceability: " + e.getMessage());
        }
    }

    // Get delivery charges for different types
    @GetMapping("/charges/{pincode}")
    public ResponseEntity<?> getDeliveryCharges(@PathVariable String pincode) {
        try {
            Double standardCharge = deliveryService.getDeliveryCharge(pincode, "STANDARD");
            Double expressCharge = deliveryService.getDeliveryCharge(pincode, "EXPRESS");
            Integer standardDays = deliveryService.getEstimatedDeliveryDays(pincode, "STANDARD");
            Integer expressDays = deliveryService.getEstimatedDeliveryDays(pincode, "EXPRESS");
            
            Map<String, Object> response = Map.of(
                "standard", Map.of("charge", standardCharge, "days", standardDays),
                "express", Map.of("charge", expressCharge, "days", expressDays),
                "pincode", pincode
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting delivery charges: " + e.getMessage());
        }
    }

    // Update delivery status (for agents)
    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<?> updateDeliveryStatus(
            @PathVariable Long deliveryId,
            @RequestBody Map<String, Object> request) {
        try {
            String status = (String) request.get("status");
            String notes = (String) request.get("notes");
            
            Delivery.DeliveryStatus deliveryStatus = Delivery.DeliveryStatus.valueOf(status);
            boolean updated = deliveryService.updateDeliveryStatus(deliveryId, deliveryStatus, notes);
            
            if (updated) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Status updated successfully"));
            }
            return ResponseEntity.badRequest().body("Failed to update delivery status");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }

    // Get delivery details by ID
    @GetMapping("/{deliveryId}")
    public ResponseEntity<?> getDeliveryDetails(@PathVariable Long deliveryId) {
        try {
            Optional<Delivery> delivery = deliveryService.trackDelivery(String.valueOf(deliveryId));
            if (delivery.isPresent()) {
                return ResponseEntity.ok(delivery.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting delivery details: " + e.getMessage());
        }
    }

    // Get active deliveries (for monitoring)
    @GetMapping("/active")
    public ResponseEntity<?> getActiveDeliveries() {
        try {
            List<Delivery> activeDeliveries = deliveryService.getActiveDeliveries();
            return ResponseEntity.ok(activeDeliveries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting active deliveries: " + e.getMessage());
        }
    }

    // Get delivery analytics
    @GetMapping("/analytics")
    public ResponseEntity<?> getDeliveryAnalytics() {
        try {
            Map<String, Object> analytics = deliveryService.getDeliveryAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting analytics: " + e.getMessage());
        }
    }

    // Get deliveries for buyer
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<?> getDeliveriesForBuyer(@PathVariable Long buyerId) {
        try {
            List<Delivery> deliveries = deliveryService.getAllDeliveries().stream()
                .filter(d -> d.getOrder() != null && d.getOrder().getBuyer() != null && 
                            d.getOrder().getBuyer().getId().equals(buyerId))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting buyer deliveries: " + e.getMessage());
        }
    }

    // Get deliveries for seller
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getDeliveriesForSeller(@PathVariable Long sellerId) {
        try {
            List<Delivery> deliveries = deliveryService.getAllDeliveries().stream()
                .filter(d -> d.getOrder() != null && d.getOrder().getSeller() != null && 
                            d.getOrder().getSeller().getId().equals(sellerId))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting seller deliveries: " + e.getMessage());
        }
    }

    // Get available agents for pincode
    @GetMapping("/agents/available/{pincode}")
    public ResponseEntity<?> getAvailableAgents(@PathVariable String pincode) {
        try {
            List<DeliveryAgent> agents = deliveryService.getAvailableAgents(pincode);
            return ResponseEntity.ok(agents);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting available agents: " + e.getMessage());
        }
    }

    // Get agent performance stats
    @GetMapping("/agents/{agentId}/performance")
    public ResponseEntity<?> getAgentPerformance(@PathVariable Long agentId) {
        try {
            Map<String, Object> performance = deliveryService.getAgentPerformanceStats(agentId);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting agent performance: " + e.getMessage());
        }
    }

    // Get deliveries for agent
    @GetMapping("/agent/{agentId}/deliveries")
    public ResponseEntity<?> getAgentDeliveries(@PathVariable Long agentId) {
        try {
            List<Delivery> deliveries = deliveryService.getDeliveriesForAgent(agentId);
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting agent deliveries: " + e.getMessage());
        }
    }
}