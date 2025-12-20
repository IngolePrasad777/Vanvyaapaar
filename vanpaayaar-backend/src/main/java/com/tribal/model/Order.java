package com.tribal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status; // Pending, Shipped, Delivered
    private Double totalAmount;
    
    @Builder.Default
    private LocalDateTime orderDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    @JsonIgnoreProperties({"cartItems", "orders", "password", "confirmPassword", "createdAt"})
    private Buyer buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    @JsonIgnoreProperties({"password", "confirmPassword", "email", "phone", "address", "pincode", 
                           "bankAccountNumber", "ifscCode", "panNumber", "bio", "createdAt"})
    private Seller seller;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"order", "buyer"}) // Prevent circular reference
    private List<Cart> items;

    // Getters and Setters
}

