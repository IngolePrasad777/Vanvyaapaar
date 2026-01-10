package com.tribal.service;

import com.tribal.model.Delivery;
import com.tribal.model.DeliveryAgent;
import com.tribal.model.Order;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DeliveryService {
    
    // Core delivery management
    Delivery createDelivery(Order order, String deliveryAddress, String deliveryPincode);
    Delivery createDelivery(Long orderId, String deliveryPincode); // Convenience method
    Optional<Delivery> assignBestAgent(Long deliveryId);
    boolean acceptDelivery(Long deliveryId, Long agentId);
    boolean updateDeliveryStatus(Long deliveryId, Delivery.DeliveryStatus status, String notes);
    
    // Agent management
    DeliveryAgent createAgent(DeliveryAgent agent);
    DeliveryAgent updateAgent(Long agentId, DeliveryAgent agentDetails);
    boolean toggleAgentOnlineStatus(Long agentId);
    List<DeliveryAgent> getAvailableAgents(String pincode);
    
    // Tracking and monitoring
    Optional<Delivery> trackDelivery(String trackingId);
    List<Delivery> getDeliveriesForAgent(Long agentId);
    List<Delivery> getActiveDeliveries();
    Map<String, Object> getDeliveryAnalytics();
    
    // Serviceability
    boolean isPincodeServiceable(String pincode);
    Double getDeliveryCharge(String pincode, String deliveryType);
    Integer getEstimatedDeliveryDays(String pincode, String deliveryType);
    
    // Admin functions
    List<Delivery> getAllDeliveries();
    boolean reassignDelivery(Long deliveryId, Long newAgentId);
    List<Delivery> getOverdueDeliveries();
    Map<String, Object> getAgentPerformanceStats(Long agentId);
    
    // Simulation and automation
    void simulateDeliveryProgress(Long deliveryId);
    void processAutomaticAssignments();
    void updateAgentLocations();
}