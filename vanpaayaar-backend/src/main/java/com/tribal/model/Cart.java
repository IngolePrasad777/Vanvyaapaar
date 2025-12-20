package com.tribal.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    @JsonIgnoreProperties({"cartItems", "orders", "password", "confirmPassword", "createdAt"})
    private Buyer buyer;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"carts", "reviews"}) // Don't include carts/reviews when showing product in cart
    private Product product;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"items", "buyer", "seller"}) // Prevent circular reference
    private Order order;


}

