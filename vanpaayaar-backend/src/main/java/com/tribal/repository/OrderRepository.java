package com.tribal.repository;

import com.tribal.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findBySellerId(Long sellerId);
    
    // Admin dashboard methods
    long countByStatusNotIn(List<String> statuses);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN :statuses")
    Double sumTotalAmountByStatusIn(@Param("statuses") List<String> statuses);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN :statuses AND o.orderDate >= :date")
    Double sumTotalAmountByStatusInAndOrderDateAfter(@Param("statuses") List<String> statuses, @Param("date") java.time.LocalDateTime date);
}
