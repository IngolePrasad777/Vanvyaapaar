package com.tribal.controller;

import com.tribal.model.Product;
import com.tribal.model.Seller;
import com.tribal.repository.ProductRepository;
import com.tribal.repository.SellerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "*")
public class PublicController {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;

    public PublicController(ProductRepository productRepository, SellerRepository sellerRepository) {
        this.productRepository = productRepository;
        this.sellerRepository = sellerRepository;
    }

    // Get product details (public access for debugging)
    @GetMapping("/products/{productId}")
    public ResponseEntity<?> getProduct(@PathVariable Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all products (public access)
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    // Get all sellers (public access for debugging)
    @GetMapping("/sellers")
    public ResponseEntity<List<Seller>> getAllSellers() {
        List<Seller> sellers = sellerRepository.findAll();
        return ResponseEntity.ok(sellers);
    }

    // Get seller by ID (public access for debugging)
    @GetMapping("/sellers/{sellerId}")
    public ResponseEntity<?> getSeller(@PathVariable Long sellerId) {
        Optional<Seller> seller = sellerRepository.findById(sellerId);
        if (seller.isPresent()) {
            return ResponseEntity.ok(seller.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("Public API is working");
    }

    // Test review submission (public access for debugging)
    @PostMapping("/test-review")
    public ResponseEntity<?> testReview(@RequestBody TestReviewRequest request) {
        try {
            // This is a simplified test - in real app, use BuyerService
            return ResponseEntity.ok("Test review endpoint working - buyerId: " + request.getBuyerId() + 
                ", productId: " + request.getProductId() + ", rating: " + request.getRating());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Simple DTO for test review
    public static class TestReviewRequest {
        private Long buyerId;
        private Long productId;
        private Integer rating;
        private String comment;

        // Getters and setters
        public Long getBuyerId() { return buyerId; }
        public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}