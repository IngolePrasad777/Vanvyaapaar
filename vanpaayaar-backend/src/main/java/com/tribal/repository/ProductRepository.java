package com.tribal.repository;

import com.tribal.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    java.util.List<Product> findBySellerId(Long sellerId);

    // Search by keyword in name or description - Using custom query for LONGTEXT compatibility
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(CAST(p.description AS string)) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    java.util.List<Product> searchByKeyword(@Param("keyword") String keyword);

    // Filter by category (case-insensitive)
    java.util.List<Product> findByCategoryIgnoreCase(String category);

    // Filter by price range
    java.util.List<Product> findByPriceBetween(Double min, Double max);
    
    // Find products under a certain price
    java.util.List<Product> findByPriceLessThanEqual(Double maxPrice);
    
    // Find products by category containing keyword (case-insensitive)
    java.util.List<Product> findByCategoryContainingIgnoreCase(String category);
}
