package com.tribal.repository;

import com.tribal.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller,Long> {
    List<Seller> findByAdminApprovalStatus(String status);
    Optional<Seller> findByEmail(String email);
    long countByAdminApprovalStatus(String status);
}
