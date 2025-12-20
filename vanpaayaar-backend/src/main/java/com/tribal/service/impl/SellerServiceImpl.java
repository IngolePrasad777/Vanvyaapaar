package com.tribal.service.impl;

import com.tribal.model.Product;
import com.tribal.model.Seller;
import com.tribal.repository.ProductRepository;
import com.tribal.repository.SellerRepository;
import com.tribal.service.SellerService;
import com.tribal.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import com.tribal.model.Order;
import com.tribal.repository.OrderRepository;

@Service
public class SellerServiceImpl implements SellerService {
    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Seller getSellerById(Long sellerId) {
        Optional<Seller> sellerOptional = sellerRepository.findById(sellerId);
        if(sellerOptional.isPresent()){
            Seller seller = sellerOptional.get();
            return seller;
        }
        else{
            return null;
        }
    }

    @Override
    public Seller updateProfile(Long sellerId, Seller updatedSeller) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if(optionalSeller.isPresent()){
            Seller seller = optionalSeller.get();
            // Basic field updates (beginner-friendly): copy only non-null fields
            if (updatedSeller.getName() != null) seller.setName(updatedSeller.getName());
            if (updatedSeller.getEmail() != null) seller.setEmail(updatedSeller.getEmail());
            if (updatedSeller.getPassword() != null) seller.setPassword(updatedSeller.getPassword());
            if (updatedSeller.getConfirmPassword() != null) seller.setConfirmPassword(updatedSeller.getConfirmPassword());
            if (updatedSeller.getPhone() != null) seller.setPhone(updatedSeller.getPhone());
            if (updatedSeller.getAddress() != null) seller.setAddress(updatedSeller.getAddress());
            if (updatedSeller.getPincode() != null) seller.setPincode(updatedSeller.getPincode());

            if (updatedSeller.getTribeName() != null) seller.setTribeName(updatedSeller.getTribeName());
            if (updatedSeller.getArtisanCategory() != null) seller.setArtisanCategory(updatedSeller.getArtisanCategory());
            if (updatedSeller.getRegion() != null) seller.setRegion(updatedSeller.getRegion());
            if (updatedSeller.getBio() != null) seller.setBio(updatedSeller.getBio());
            if (updatedSeller.getBankAccountNumber() != null) seller.setBankAccountNumber(updatedSeller.getBankAccountNumber());
            if (updatedSeller.getIfscCode() != null) seller.setIfscCode(updatedSeller.getIfscCode());
            if (updatedSeller.getPanNumber() != null) seller.setPanNumber(updatedSeller.getPanNumber());
            seller.setTermsAccepted(updatedSeller.isTermsAccepted());
            seller.setConsentAccepted(updatedSeller.isConsentAccepted());

            // Do not directly set adminApprovalStatus here unless part of business rules
            Seller saved = sellerRepository.save(seller);
            return saved;
        }
        return null;
    }

    @Override
    public void deleteSeller(Long sellerId) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if(optionalSeller.isPresent()){
            Seller seller = optionalSeller.get();
            sellerRepository.deleteById(sellerId);
            return;
        }
        return;
    }

    @Override
    public Product addProduct(Long sellerId, Product product) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) return null;
        Seller seller = optionalSeller.get();
        product.setSeller(seller);
        return productRepository.save(product);
    }

    @Override
    public List<Product> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    @Override
    public Product updateProduct(Long productId, Product product) {
        Optional<Product> optional = productRepository.findById(productId);
        if (optional.isEmpty()) return null;
        Product existing = optional.get();
        // Beginner-friendly field copy: only non-null updates
        if (product.getName() != null) existing.setName(product.getName());
        if (product.getDescription() != null) existing.setDescription(product.getDescription());
        if (product.getCategory() != null) existing.setCategory(product.getCategory());
        if (product.getPrice() != null) existing.setPrice(product.getPrice());
        if (product.getStock() != null) existing.setStock(product.getStock());
        if (product.getImageUrl() != null) existing.setImageUrl(product.getImageUrl());
        if (product.getFeatured() != null) existing.setFeatured(product.getFeatured());
        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
        }
    }

    @Override
    public Seller registerSeller(Seller seller) {
        // Default status PENDING from entity
        Seller savedSeller = sellerRepository.save(seller);
        
        // Notify admin about new seller registration
        try {
            notificationService.createNotification(
                1L, "ADMIN", "NEW_SELLER",
                "New Seller Registration",
                "New seller '" + seller.getName() + "' has registered and needs approval.",
                "HIGH", seller.getId(), "SELLER", null, false
            );
        } catch (Exception e) {
            // Log error but don't fail the registration
            System.err.println("Failed to send new seller notification: " + e.getMessage());
        }
        
        return savedSeller;
    }

    @Override
    public Seller updateApprovalStatus(Long sellerId, String status) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) return null;
        Seller s = optionalSeller.get();
        s.setAdminApprovalStatus(status);
        Seller savedSeller = sellerRepository.save(s);
        
        // Send notification to seller about approval status change
        try {
            if ("APPROVED".equals(status)) {
                notificationService.createNotification(
                    s.getId(), "SELLER", "ACCOUNT_APPROVED",
                    "Account Approved",
                    "Congratulations! Your seller account has been approved. You can now start selling.",
                    "HIGH", s.getId(), "SELLER", null, true
                );
            } else if ("REJECTED".equals(status)) {
                notificationService.createNotification(
                    s.getId(), "SELLER", "ACCOUNT_REJECTED",
                    "Account Rejected",
                    "Your seller account application has been rejected. Please contact support for more details.",
                    "HIGH", s.getId(), "SELLER", null, true
                );
            } else if ("SUSPENDED".equals(status)) {
                notificationService.createNotification(
                    s.getId(), "SELLER", "ACCOUNT_SUSPENDED",
                    "Account Suspended",
                    "Your seller account has been suspended. Contact support for details.",
                    "URGENT", s.getId(), "SELLER", null, true
                );
            }
        } catch (Exception e) {
            // Log error but don't fail the status update
            System.err.println("Failed to send approval status notification: " + e.getMessage());
        }
        
        return savedSeller;
    }

    // --- ORDER MANAGEMENT ---
    @Override
    public List<Order> getOrdersBySeller(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> optional = orderRepository.findById(orderId);
        if (optional.isEmpty()) return null;
        Order order = optional.get();
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);
        
        // Send notification to buyer about order status change
        try {
            if (order.getBuyer() != null) {
                String title = "Order " + status;
                String message = "Your order #" + order.getId() + " is now " + status.toLowerCase();
                String notificationType = "ORDER_" + status.toUpperCase().replace(" ", "_");
                
                notificationService.createNotification(
                    order.getBuyer().getId(), "BUYER", notificationType,
                    title, message, "NORMAL",
                    order.getId(), "ORDER", null, true
                );
            }
        } catch (Exception e) {
            // Log error but don't fail the order update
            System.err.println("Failed to send order status notification: " + e.getMessage());
        }
        
        return savedOrder;
    }

    // --- DASHBOARD ---
    @Override
    public Map<String, Object> getSellerDashboard(Long sellerId) {
        Map<String, Object> data = new HashMap<>();
        List<Product> products = productRepository.findBySellerId(sellerId);
        List<Order> orders = orderRepository.findBySellerId(sellerId);

        long pending = orders.stream().filter(o -> "Pending".equalsIgnoreCase(o.getStatus())).count();
        double sales = orders.stream().mapToDouble(o -> o.getTotalAmount() == null ? 0.0 : o.getTotalAmount()).sum();

        data.put("totalProducts", products.size());
        data.put("totalSales", sales);
        data.put("pendingOrders", pending);
        data.put("totalOrders", orders.size());
        return data;
    }

    // --- NOTIFICATIONS ---
    @Override
    public List<String> getSellerNotifications(Long sellerId) {
        List<Order> orders = orderRepository.findBySellerId(sellerId);
        long pending = orders.stream().filter(o -> "Pending".equalsIgnoreCase(o.getStatus())).count();
        return java.util.List.of(
                "You have " + pending + " pending orders.",
                "Total products listed: " + productRepository.findBySellerId(sellerId).size()
        );
    }
}
