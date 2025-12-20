package com.tribal.repository;

import com.tribal.model.Cart;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart,Long> {

    // Fetch all cart items for a buyer (including those already ordered)
    List<Cart> findByBuyerId(Long buyerId);

    // Fetch only active cart items (not attached to any order yet)
    List<Cart> findByBuyerIdAndOrderIsNull(Long buyerId);

    // Find a single active cart item for product to merge quantities
    java.util.Optional<Cart> findByBuyerIdAndProductIdAndOrderIsNull(Long buyerId, Long productId);

}
