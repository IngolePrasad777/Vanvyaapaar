package com.tribal.repository;

import com.tribal.model.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer,Long> {
    java.util.Optional<Buyer> findByEmail(String email);
}
