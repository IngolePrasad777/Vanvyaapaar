package com.tribal.repository;

import com.tribal.model.Admin;
import com.tribal.model.Order;
import com.tribal.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
//<ClassName , DataType of PK>
public interface AdminRepository extends JpaRepository<Admin,Long> {
    Optional<Admin> findByEmail(String email);
}
