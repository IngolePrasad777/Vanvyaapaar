package com.tribal.repository;

import com.tribal.model.ServiceableArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceableAreaRepository extends JpaRepository<ServiceableArea, Long> {
    
    // Find serviceable area by pincode
    Optional<ServiceableArea> findByPincode(String pincode);
    
    // Check if pincode is serviceable
    @Query("SELECT CASE WHEN COUNT(sa) > 0 THEN true ELSE false END FROM ServiceableArea sa WHERE sa.pincode = :pincode AND sa.isActive = true")
    Boolean isPincodeServiceable(@Param("pincode") String pincode);
    
    // Find all active serviceable areas
    List<ServiceableArea> findByIsActiveTrue();
    
    // Find serviceable areas by city
    List<ServiceableArea> findByCityAndIsActiveTrue(String city);
    
    // Find serviceable areas by state
    List<ServiceableArea> findByStateAndIsActiveTrue(String state);
    
    // Find premium areas
    List<ServiceableArea> findByIsPremiumTrueAndIsActiveTrue();
    
    // Find areas with express delivery
    @Query("SELECT sa FROM ServiceableArea sa WHERE sa.expressDeliveryDays <= :days AND sa.isActive = true")
    List<ServiceableArea> findAreasWithExpressDelivery(@Param("days") Integer days);
    
    // Find areas by delivery charge range
    @Query("SELECT sa FROM ServiceableArea sa WHERE sa.deliveryCharge BETWEEN :minCharge AND :maxCharge AND sa.isActive = true")
    List<ServiceableArea> findAreasByDeliveryChargeRange(@Param("minCharge") Double minCharge, 
                                                        @Param("maxCharge") Double maxCharge);
    
    // Search areas by name or pincode
    @Query("SELECT sa FROM ServiceableArea sa WHERE (sa.areaName LIKE %:searchTerm% OR sa.pincode LIKE %:searchTerm%) AND sa.isActive = true")
    List<ServiceableArea> searchServiceableAreas(@Param("searchTerm") String searchTerm);
    
    // Count serviceable areas by city
    @Query("SELECT COUNT(sa) FROM ServiceableArea sa WHERE sa.city = :city AND sa.isActive = true")
    Long countServiceableAreasByCity(@Param("city") String city);
    
    // Find nearby areas (simplified - in real implementation would use geo queries)
    @Query("SELECT sa FROM ServiceableArea sa WHERE sa.city = :city AND sa.isActive = true")
    List<ServiceableArea> findNearbyAreas(@Param("city") String city);
}