package com.tribal.repository;

import com.tribal.model.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {
    
    // Find agents by status
    List<DeliveryAgent> findByStatus(DeliveryAgent.AgentStatus status);
    
    // Find online agents
    List<DeliveryAgent> findByIsOnlineTrue();
    
    // Find agents who can take new orders
    @Query("SELECT da FROM DeliveryAgent da WHERE da.isOnline = true AND da.status = 'FREE' AND da.currentWorkload < 3")
    List<DeliveryAgent> findAvailableAgents();
    
    // Find agents serving a specific pincode
    @Query("SELECT da FROM DeliveryAgent da WHERE da.serviceablePincodes LIKE CONCAT('%', :pincode, '%') AND da.isOnline = true")
    List<DeliveryAgent> findAgentsByPincode(@Param("pincode") String pincode);
    
    // Find available agents for a specific pincode
    @Query("SELECT da FROM DeliveryAgent da WHERE da.serviceablePincodes LIKE CONCAT('%', :pincode, '%') AND da.isOnline = true AND da.status = 'FREE' AND da.currentWorkload < 3")
    List<DeliveryAgent> findAvailableAgentsByPincode(@Param("pincode") String pincode);
    
    // Find agents by current location (pincode)
    List<DeliveryAgent> findByCurrentPincode(String pincode);
    
    // Find agents with low workload (for load balancing)
    @Query("SELECT da FROM DeliveryAgent da WHERE da.isOnline = true AND da.status = 'FREE' ORDER BY da.currentWorkload ASC, da.rating DESC")
    List<DeliveryAgent> findAgentsOrderedByWorkloadAndRating();
    
    // Find top rated agents
    @Query("SELECT da FROM DeliveryAgent da WHERE da.isOnline = true ORDER BY da.rating DESC, da.totalDeliveries DESC")
    List<DeliveryAgent> findTopRatedAgents();
    
    // Find agent by email
    Optional<DeliveryAgent> findByEmail(String email);
    
    // Find agent by phone
    Optional<DeliveryAgent> findByPhone(String phone);
    
    // Count agents by status
    @Query("SELECT COUNT(da) FROM DeliveryAgent da WHERE da.status = :status")
    Long countByStatus(@Param("status") DeliveryAgent.AgentStatus status);
    
    // Find agents with high workload (for monitoring)
    @Query("SELECT da FROM DeliveryAgent da WHERE da.currentWorkload >= 3")
    List<DeliveryAgent> findOverloadedAgents();
}