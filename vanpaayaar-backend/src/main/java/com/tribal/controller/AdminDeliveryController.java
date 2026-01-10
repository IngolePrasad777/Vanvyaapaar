package com.tribal.controller;

import com.tribal.model.Delivery;
import com.tribal.model.DeliveryAgent;
import com.tribal.model.ServiceableArea;
import com.tribal.repository.DeliveryAgentRepository;
import com.tribal.repository.ServiceableAreaRepository;
import com.tribal.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/delivery")
@CrossOrigin(origins = "*")
public class AdminDeliveryController {

    @Autowired
    private DeliveryService deliveryService;
    
    @Autowired
    private DeliveryAgentRepository agentRepository;
    
    @Autowired
    private ServiceableAreaRepository serviceableAreaRepository;

    // Get all deliveries
    @GetMapping("/all")
    public ResponseEntity<?> getAllDeliveries() {
        try {
            List<Delivery> deliveries = deliveryService.getAllDeliveries();
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting deliveries: " + e.getMessage());
        }
    }

    // Get all delivery agents
    @GetMapping("/agents")
    public ResponseEntity<?> getAllAgents() {
        try {
            List<DeliveryAgent> agents = agentRepository.findAll();
            return ResponseEntity.ok(agents);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting agents: " + e.getMessage());
        }
    }

    // Get overdue deliveries
    @GetMapping("/overdue")
    public ResponseEntity<?> getOverdueDeliveries() {
        try {
            List<Delivery> overdueDeliveries = deliveryService.getOverdueDeliveries();
            return ResponseEntity.ok(overdueDeliveries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting overdue deliveries: " + e.getMessage());
        }
    }

    // Reassign delivery to different agent
    @PutMapping("/{deliveryId}/reassign")
    public ResponseEntity<?> reassignDelivery(
            @PathVariable Long deliveryId,
            @RequestBody Map<String, Object> request) {
        try {
            Long newAgentId = Long.valueOf(request.get("agentId").toString());
            boolean success = deliveryService.reassignDelivery(deliveryId, newAgentId);
            
            if (success) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Delivery reassigned successfully"));
            }
            return ResponseEntity.badRequest().body("Failed to reassign delivery");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error reassigning delivery: " + e.getMessage());
        }
    }

    // Get comprehensive delivery analytics
    @GetMapping("/analytics/detailed")
    public ResponseEntity<?> getDetailedAnalytics() {
        try {
            Map<String, Object> analytics = deliveryService.getDeliveryAnalytics();
            
            // Add additional admin-specific metrics
            List<DeliveryAgent> overloadedAgents = agentRepository.findOverloadedAgents();
            List<DeliveryAgent> topAgents = agentRepository.findTopRatedAgents();
            
            analytics.put("overloadedAgents", overloadedAgents.size());
            analytics.put("topRatedAgents", topAgents.subList(0, Math.min(5, topAgents.size())));
            
            // Status breakdown
            analytics.put("statusBreakdown", Map.of(
                "created", deliveryService.getAllDeliveries().stream()
                    .filter(d -> d.getStatus() == Delivery.DeliveryStatus.CREATED).count(),
                "assigned", deliveryService.getAllDeliveries().stream()
                    .filter(d -> d.getStatus() == Delivery.DeliveryStatus.ASSIGNED).count(),
                "inTransit", deliveryService.getAllDeliveries().stream()
                    .filter(d -> d.getStatus() == Delivery.DeliveryStatus.IN_TRANSIT).count(),
                "delivered", deliveryService.getAllDeliveries().stream()
                    .filter(d -> d.getStatus() == Delivery.DeliveryStatus.DELIVERED).count()
            ));
            
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting detailed analytics: " + e.getMessage());
        }
    }

    // Manage serviceable areas
    @GetMapping("/serviceable-areas")
    public ResponseEntity<?> getServiceableAreas() {
        try {
            List<ServiceableArea> areas = serviceableAreaRepository.findAll();
            return ResponseEntity.ok(areas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting serviceable areas: " + e.getMessage());
        }
    }

    @PostMapping("/serviceable-areas")
    public ResponseEntity<?> addServiceableArea(@RequestBody ServiceableArea area) {
        try {
            ServiceableArea savedArea = serviceableAreaRepository.save(area);
            return ResponseEntity.ok(savedArea);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding serviceable area: " + e.getMessage());
        }
    }

    @PutMapping("/serviceable-areas/{areaId}")
    public ResponseEntity<?> updateServiceableArea(@PathVariable Long areaId, @RequestBody ServiceableArea areaDetails) {
        try {
            return serviceableAreaRepository.findById(areaId)
                .map(area -> {
                    if (areaDetails.getAreaName() != null) area.setAreaName(areaDetails.getAreaName());
                    if (areaDetails.getCity() != null) area.setCity(areaDetails.getCity());
                    if (areaDetails.getState() != null) area.setState(areaDetails.getState());
                    if (areaDetails.getIsActive() != null) area.setIsActive(areaDetails.getIsActive());
                    if (areaDetails.getDeliveryCharge() != null) area.setDeliveryCharge(areaDetails.getDeliveryCharge());
                    if (areaDetails.getStandardDeliveryDays() != null) area.setStandardDeliveryDays(areaDetails.getStandardDeliveryDays());
                    
                    ServiceableArea updatedArea = serviceableAreaRepository.save(area);
                    return ResponseEntity.ok(updatedArea);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating serviceable area: " + e.getMessage());
        }
    }

    // Force process automatic assignments
    @PostMapping("/process-assignments")
    public ResponseEntity<?> processAutomaticAssignments() {
        try {
            deliveryService.processAutomaticAssignments();
            return ResponseEntity.ok(Map.of("success", true, "message", "Automatic assignments processed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing assignments: " + e.getMessage());
        }
    }

    // Update all agent locations (simulation)
    @PostMapping("/update-agent-locations")
    public ResponseEntity<?> updateAgentLocations() {
        try {
            deliveryService.updateAgentLocations();
            return ResponseEntity.ok(Map.of("success", true, "message", "Agent locations updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating locations: " + e.getMessage());
        }
    }

    // Get agent workload distribution
    @GetMapping("/agent-workload")
    public ResponseEntity<?> getAgentWorkloadDistribution() {
        try {
            List<DeliveryAgent> agents = agentRepository.findAll();
            
            Map<String, Object> workloadStats = Map.of(
                "freeAgents", agents.stream().filter(a -> a.getStatus() == DeliveryAgent.AgentStatus.FREE).count(),
                "busyAgents", agents.stream().filter(a -> a.getStatus() == DeliveryAgent.AgentStatus.BUSY).count(),
                "offlineAgents", agents.stream().filter(a -> a.getStatus() == DeliveryAgent.AgentStatus.OFFLINE).count(),
                "averageWorkload", agents.stream().mapToInt(DeliveryAgent::getCurrentWorkload).average().orElse(0.0),
                "maxWorkload", agents.stream().mapToInt(DeliveryAgent::getCurrentWorkload).max().orElse(0),
                "totalAgents", agents.size()
            );
            
            return ResponseEntity.ok(workloadStats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting workload distribution: " + e.getMessage());
        }
    }
}