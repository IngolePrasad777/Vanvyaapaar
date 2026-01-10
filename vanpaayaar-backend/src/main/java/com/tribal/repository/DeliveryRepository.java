package com.tribal.repository;

import com.tribal.model.Delivery;
import com.tribal.model.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    // Find delivery by tracking ID
    Optional<Delivery> findByTrackingId(String trackingId);
    
    // Find deliveries by order ID
    Optional<Delivery> findByOrderId(Long orderId);
    
    // Find deliveries by agent
    List<Delivery> findByAgent(DeliveryAgent agent);
    
    // Find deliveries by agent ID
    List<Delivery> findByAgentId(Long agentId);
    
    // Find deliveries by status
    List<Delivery> findByStatus(Delivery.DeliveryStatus status);
    
    // Find active deliveries for an agent
    @Query("SELECT d FROM Delivery d WHERE d.agent.id = :agentId AND d.status NOT IN ('COMPLETED', 'FAILED', 'CANCELLED')")
    List<Delivery> findActiveDeliveriesByAgent(@Param("agentId") Long agentId);
    
    // Find deliveries by pincode
    List<Delivery> findByDeliveryPincode(String pincode);
    
    // Find deliveries created within date range
    @Query("SELECT d FROM Delivery d WHERE d.createdAt BETWEEN :startDate AND :endDate")
    List<Delivery> findDeliveriesByDateRange(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    // Find pending assignments (created but not assigned)
    List<Delivery> findByStatusOrderByCreatedAtAsc(Delivery.DeliveryStatus status);
    
    // Find deliveries that need agent assignment
    @Query("SELECT d FROM Delivery d WHERE d.status = 'CREATED' ORDER BY d.createdAt ASC")
    List<Delivery> findPendingAssignments();
    
    // Find overdue deliveries
    @Query("SELECT d FROM Delivery d WHERE d.estimatedDeliveryTime < :currentTime AND d.status NOT IN ('DELIVERED', 'COMPLETED', 'FAILED', 'CANCELLED')")
    List<Delivery> findOverdueDeliveries(@Param("currentTime") LocalDateTime currentTime);
    
    // Find deliveries by buyer (through order)
    @Query("SELECT d FROM Delivery d WHERE d.order.buyer.id = :buyerId")
    List<Delivery> findDeliveriesByBuyer(@Param("buyerId") Long buyerId);
    
    // Find deliveries by seller (through order)
    @Query("SELECT d FROM Delivery d WHERE d.order.seller.id = :sellerId")
    List<Delivery> findDeliveriesBySeller(@Param("sellerId") Long sellerId);
    
    // Count deliveries by status
    @Query("SELECT COUNT(d) FROM Delivery d WHERE d.status = :status")
    Long countByStatus(@Param("status") Delivery.DeliveryStatus status);
    
    // Find recent deliveries for dashboard
    @Query("SELECT d FROM Delivery d ORDER BY d.createdAt DESC")
    List<Delivery> findRecentDeliveries();
    
    // Find deliveries in transit
    @Query("SELECT d FROM Delivery d WHERE d.status IN ('PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY')")
    List<Delivery> findInTransitDeliveries();
    
    // Find failed deliveries that can be retried
    @Query("SELECT d FROM Delivery d WHERE d.status = 'FAILED' AND d.attemptCount < 3")
    List<Delivery> findRetryableDeliveries();
    
    // Performance analytics queries
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, d.createdAt, d.deliveredAt)) FROM Delivery d WHERE d.status = 'DELIVERED' AND d.deliveredAt IS NOT NULL")
    Double getAverageDeliveryTimeInHours();
    
    @Query("SELECT COUNT(d) * 100.0 / (SELECT COUNT(d2) FROM Delivery d2 WHERE d2.createdAt >= :startDate) FROM Delivery d WHERE d.status = 'DELIVERED' AND d.createdAt >= :startDate")
    Double getDeliverySuccessRate(@Param("startDate") LocalDateTime startDate);
}