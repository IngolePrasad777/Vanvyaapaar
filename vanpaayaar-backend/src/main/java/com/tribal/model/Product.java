package com.tribal.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(length = 2000) // Changed from LONGTEXT to avoid CLOB issues with search
    private String description;
    
    private String category;
    private Double price;
    private Integer stock;
    
    @Column(length = 500)
    private String imageUrl;
    
    private Boolean featured;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    @JsonIgnoreProperties({"password", "confirmPassword", "email", "phone", "address", "pincode", 
                           "bankAccountNumber", "ifscCode", "panNumber", "bio", "createdAt"})
    private Seller seller;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"product", "buyer"}) // Prevent circular reference
    private List<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"product", "buyer", "order"}) // Ignore to prevent infinite loop
    private List<Cart> carts;
}

