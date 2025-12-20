package com.tribal.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String comment;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    @JsonIgnoreProperties({"cartItems", "orders", "password", "confirmPassword", "email", 
                           "phone", "address", "pincode", "createdAt"})
    private Buyer buyer;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"carts", "reviews"}) // Prevent circular reference
    private Product product;
}

