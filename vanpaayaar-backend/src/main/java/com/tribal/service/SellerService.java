package com.tribal.service;

import com.tribal.model.Seller;
import com.tribal.model.Product;
import com.tribal.model.Order;

import java.util.List;
import java.util.Map;

public interface SellerService {

    // --- SELLER PROFILE ---
    Seller getSellerById(Long sellerId);

    Seller updateProfile(Long sellerId, Seller updatedSeller);

    void deleteSeller(Long sellerId);

    // --- PRODUCT MANAGEMENT ---
    Product addProduct(Long sellerId, Product product);

    List<Product> getProductsBySeller(Long sellerId);

    Product updateProduct(Long productId, Product product);

    void deleteProduct(Long productId);

    // --- AUTH / STATUS ---
    Seller registerSeller(Seller seller);

    Seller updateApprovalStatus(Long sellerId, String status);

    // --- ORDER MANAGEMENT ---
    List<Order> getOrdersBySeller(Long sellerId);
    Order updateOrderStatus(Long orderId, String status);  // e.g. DISPATCHED, DELIVERED

    // --- DASHBOARD ---
    Map<String, Object> getSellerDashboard(Long sellerId); // total products, sales, pending orders

    // --- MESSAGE / NOTIFICATION ---
    List<String> getSellerNotifications(Long sellerId);

    // --- ANALYTICS ---
    Map<String, Object> getSellerAnalytics(Long sellerId, String period);
}
