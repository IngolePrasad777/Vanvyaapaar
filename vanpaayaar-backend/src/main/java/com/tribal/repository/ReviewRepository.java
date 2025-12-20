package com.tribal.repository;

import com.tribal.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {
    java.util.List<Review> findByProductId(Long productId);
}
