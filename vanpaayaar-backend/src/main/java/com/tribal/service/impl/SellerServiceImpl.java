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

    // --- ANALYTICS ---
    @Override
    public Map<String, Object> getSellerAnalytics(Long sellerId, String period) {
        Optional<Seller> sellerOptional = sellerRepository.findById(sellerId);
        if (!sellerOptional.isPresent()) {
            return null;
        }

        Map<String, Object> analytics = new HashMap<>();
        List<Product> products = productRepository.findBySellerId(sellerId);
        List<Order> orders = orderRepository.findBySellerId(sellerId);

        // Basic metrics
        double totalRevenue = orders.stream()
                .mapToDouble(o -> o.getTotalAmount() == null ? 0.0 : o.getTotalAmount())
                .sum();
        
        long totalOrders = orders.size();
        long totalProducts = products.size();
        
        // Calculate total sales (sum of quantities from cart items in orders)
        long totalSales = orders.stream()
                .filter(order -> order.getItems() != null)
                .flatMap(order -> order.getItems().stream())
                .filter(cartItem -> cartItem.getQuantity() != null)
                .mapToLong(cartItem -> cartItem.getQuantity())
                .sum();

        // Growth calculations (simplified - comparing with previous period)
        double monthlyGrowth = 12.5; // Mock data - in real implementation, compare with previous month
        double orderGrowth = 8.3;    // Mock data

        // Top products (simplified - by order frequency)
        Map<Product, Long> productOrderCount = orders.stream()
                .filter(order -> order.getItems() != null)
                .flatMap(order -> order.getItems().stream())
                .filter(cartItem -> cartItem.getProduct() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                    cartItem -> cartItem.getProduct(),
                    java.util.stream.Collectors.counting()
                ));

        List<Map<String, Object>> topProducts = productOrderCount.entrySet().stream()
                .sorted(Map.Entry.<Product, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> productData = new HashMap<>();
                    Product product = entry.getKey();
                    Long sales = entry.getValue();
                    productData.put("id", product.getId());
                    productData.put("name", product.getName());
                    productData.put("sales", sales);
                    productData.put("revenue", sales * (product.getPrice() != null ? product.getPrice() : 0.0));
                    productData.put("image", product.getImageUrl());
                    return productData;
                })
                .collect(java.util.stream.Collectors.toList());

        // Recent orders (last 5)
        List<Map<String, Object>> recentOrders = orders.stream()
                .sorted((o1, o2) -> {
                    if (o1.getOrderDate() == null && o2.getOrderDate() == null) return 0;
                    if (o1.getOrderDate() == null) return 1;
                    if (o2.getOrderDate() == null) return -1;
                    return o2.getOrderDate().compareTo(o1.getOrderDate());
                })
                .limit(5)
                .map(order -> {
                    Map<String, Object> orderData = new HashMap<>();
                    orderData.put("id", order.getId());
                    orderData.put("buyerName", order.getBuyer() != null ? order.getBuyer().getName() : "Unknown");
                    orderData.put("amount", order.getTotalAmount());
                    orderData.put("status", order.getStatus());
                    orderData.put("date", order.getOrderDate() != null ? order.getOrderDate().toString() : "N/A");
                    return orderData;
                })
                .collect(java.util.stream.Collectors.toList());

        // Sales data (mock monthly data - in real implementation, group by actual dates)
        List<Map<String, Object>> salesData = java.util.List.of(
                createSalesDataPoint("Jul", 35000, 45),
                createSalesDataPoint("Aug", 42000, 52),
                createSalesDataPoint("Sep", 38000, 48),
                createSalesDataPoint("Oct", 55000, 68),
                createSalesDataPoint("Nov", 48000, 58),
                createSalesDataPoint("Dec", (int)totalRevenue, (int)totalOrders)
        );

        // Build response
        analytics.put("totalSales", totalSales);
        analytics.put("totalOrders", totalOrders);
        analytics.put("totalProducts", totalProducts);
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("monthlyGrowth", monthlyGrowth);
        analytics.put("orderGrowth", orderGrowth);
        analytics.put("topProducts", topProducts);
        analytics.put("recentOrders", recentOrders);
        analytics.put("salesData", salesData);

        return analytics;
    }

    private Map<String, Object> createSalesDataPoint(String month, int sales, int orders) {
        Map<String, Object> dataPoint = new HashMap<>();
        dataPoint.put("month", month);
        dataPoint.put("sales", sales);
        dataPoint.put("orders", orders);
        return dataPoint;
    }
}
