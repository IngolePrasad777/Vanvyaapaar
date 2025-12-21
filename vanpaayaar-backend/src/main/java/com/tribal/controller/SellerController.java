package com.tribal.controller;

import com.tribal.model.Product;
import com.tribal.model.Seller;
import com.tribal.model.Order;
import com.tribal.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/seller")
public class SellerController {

    @Autowired
    private SellerService sellerService;

    // --- Profile ---
    @GetMapping("/{sellerId}")
    public ResponseEntity<?> getSeller(@PathVariable Long sellerId) {
        Seller s = sellerService.getSellerById(sellerId);
        if (s == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found: " + sellerId);
        return ResponseEntity.ok(s);
    }

    @PutMapping("/{sellerId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long sellerId, @RequestBody Seller updated) {
        Seller s = sellerService.updateProfile(sellerId, updated);
        if (s == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found: " + sellerId);
        return ResponseEntity.ok(s);
    }

    @DeleteMapping("/{sellerId}")
    public ResponseEntity<?> deleteSeller(@PathVariable Long sellerId) {
        sellerService.deleteSeller(sellerId);
        return ResponseEntity.ok("Seller deleted if existed: " + sellerId);
    }

    // --- Products ---
    @PostMapping("/{sellerId}/products")
    public ResponseEntity<?> addProduct(@PathVariable Long sellerId, @RequestBody Product product) {
        Product p = sellerService.addProduct(sellerId, product);
        if (p == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found: " + sellerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(p);
    }

    @GetMapping("/{sellerId}/products")
    public ResponseEntity<?> getProducts(@PathVariable Long sellerId) {
        List<Product> items = sellerService.getProductsBySeller(sellerId);
        if (items.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No products for seller: " + sellerId);
        return ResponseEntity.ok(items);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Long productId, @RequestBody Product product) {
        Product p = sellerService.updateProduct(productId, product);
        if (p == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found: " + productId);
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        sellerService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted if existed: " + productId);
    }

    // --- Approval ---
    @PutMapping("/{sellerId}/status")
    public ResponseEntity<?> updateApprovalStatus(@PathVariable Long sellerId, @RequestParam String status) {
        Seller s = sellerService.updateApprovalStatus(sellerId, status);
        if (s == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found: " + sellerId);
        return ResponseEntity.ok(s);
    }

    // --- Orders ---
    @GetMapping("/{sellerId}/orders")
    public ResponseEntity<?> getOrdersBySeller(@PathVariable Long sellerId) {
        List<Order> orders = sellerService.getOrdersBySeller(sellerId);
        if (orders.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders for seller: " + sellerId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        Order updated = sellerService.updateOrderStatus(orderId, status);
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: " + orderId);
        return ResponseEntity.ok(updated);
    }

    // --- Dashboard ---
    @GetMapping("/{sellerId}/dashboard")
    public ResponseEntity<?> getDashboard(@PathVariable Long sellerId) {
        Map<String, Object> metrics = sellerService.getSellerDashboard(sellerId);
        return ResponseEntity.ok(metrics);
    }

    // --- Notifications ---
    @GetMapping("/{sellerId}/notifications")
    public ResponseEntity<?> getNotifications(@PathVariable Long sellerId) {
        List<String> notes = sellerService.getSellerNotifications(sellerId);
        if (notes == null || notes.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No notifications");
        return ResponseEntity.ok(notes);
    }

    // --- Analytics ---
    @GetMapping("/{sellerId}/analytics")
    public ResponseEntity<?> getAnalytics(@PathVariable Long sellerId, @RequestParam(defaultValue = "month") String period) {
        System.out.println("Analytics endpoint called for seller: " + sellerId + ", period: " + period);
        try {
            Map<String, Object> analytics = sellerService.getSellerAnalytics(sellerId, period);
            if (analytics == null) {
                System.out.println("Analytics returned null for seller: " + sellerId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found: " + sellerId);
            }
            System.out.println("Analytics data retrieved successfully for seller: " + sellerId);
            System.out.println("Analytics keys: " + analytics.keySet());
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            System.err.println("Error in analytics endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving analytics: " + e.getMessage());
        }
    }
}
