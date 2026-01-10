package com.tribal.controller;

import com.tribal.model.Delivery;
import com.tribal.model.DeliveryAgent;
import com.tribal.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "*")
public class DeliveryAgentController {

    @Autowired
    private DeliveryService deliveryService;

    // Create new delivery agent
    @PostMapping("/register")
    public ResponseEntity<?> registerAgent(@RequestBody DeliveryAgent agent) {
        try {
            DeliveryAgent createdAgent = deliveryService.createAgent(agent);
            return ResponseEntity.ok(createdAgent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating agent: " + e.getMessage());
        }
    }

    // Update agent details
    @PutMapping("/{agentId}")
    public ResponseEntity<?> updateAgent(@PathVariable Long agentId, @RequestBody DeliveryAgent agentDetails) {
        try {
            DeliveryAgent updatedAgent = deliveryService.updateAgent(agentId, agentDetails);
            if (updatedAgent != null) {
                return ResponseEntity.ok(updatedAgent);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating agent: " + e.getMessage());
        }
    }

    // Toggle agent online/offline status
    @PutMapping("/{agentId}/toggle-status")
    public ResponseEntity<?> toggleAgentStatus(@PathVariable Long agentId) {
        try {
            boolean success = deliveryService.toggleAgentOnlineStatus(agentId);
            if (success) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Status updated successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling status: " + e.getMessage());
        }
    }

    // Get agent's assigned deliveries
    @GetMapping("/{agentId}/deliveries")
    public ResponseEntity<?> getAgentDeliveries(@PathVariable Long agentId) {
        try {
            List<Delivery> deliveries = deliveryService.getDeliveriesForAgent(agentId);
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting agent deliveries: " + e.getMessage());
        }
    }

    // Accept delivery assignment
    @PostMapping("/accept-delivery")
    public ResponseEntity<?> acceptDelivery(@RequestBody Map<String, Object> request) {
        try {
            Long deliveryId = Long.valueOf(request.get("deliveryId").toString());
            Long agentId = Long.valueOf(request.get("agentId").toString());
            
            boolean accepted = deliveryService.acceptDelivery(deliveryId, agentId);
            if (accepted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Delivery accepted successfully"));
            }
            return ResponseEntity.badRequest().body("Failed to accept delivery");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error accepting delivery: " + e.getMessage());
        }
    }

    // Get available agents for a pincode
    @GetMapping("/available/{pincode}")
    public ResponseEntity<?> getAvailableAgents(@PathVariable String pincode) {
        try {
            List<DeliveryAgent> agents = deliveryService.getAvailableAgents(pincode);
            return ResponseEntity.ok(agents);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting available agents: " + e.getMessage());
        }
    }

    // Get agent performance statistics
    @GetMapping("/{agentId}/stats")
    public ResponseEntity<?> getAgentStats(@PathVariable Long agentId) {
        try {
            Map<String, Object> stats = deliveryService.getAgentPerformanceStats(agentId);
            if (!stats.isEmpty()) {
                return ResponseEntity.ok(stats);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting agent stats: " + e.getMessage());
        }
    }

    // Update agent location (for GPS tracking simulation)
    @PutMapping("/{agentId}/location")
    public ResponseEntity<?> updateAgentLocation(
            @PathVariable Long agentId,
            @RequestBody Map<String, Object> locationData) {
        try {
            // In real implementation, this would update GPS coordinates
            Double latitude = Double.valueOf(locationData.get("latitude").toString());
            Double longitude = Double.valueOf(locationData.get("longitude").toString());
            String pincode = (String) locationData.get("pincode");
            
            // For now, just update the pincode
            DeliveryAgent agentUpdate = DeliveryAgent.builder()
                    .currentPincode(pincode)
                    .currentLatitude(latitude)
                    .currentLongitude(longitude)
                    .build();
            
            DeliveryAgent updatedAgent = deliveryService.updateAgent(agentId, agentUpdate);
            if (updatedAgent != null) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Location updated"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating location: " + e.getMessage());
        }
    }
}