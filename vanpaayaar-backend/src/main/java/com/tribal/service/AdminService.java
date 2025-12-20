package com.tribal.service;
import com.tribal.model.Order;
import java.util.List;
import com.tribal.model.*;
import java.util.Map;
import java.util.Optional;

public interface AdminService {

    // --- DASHBOARD ---

    Map<String, Object> getDashboardMetrics();


    // --- SELLER MANAGEMENT ---

    List<Seller> getAllSellers();
    List<Seller> getPendingSellers(String status);
    Seller getSellerbyId(Long sellerId);
    Seller approveSeller(Long sellerId);
    Seller suspendSeller(Long sellerId);
    Seller deleteSeller(Long sellerId);


    // --- BUYER MANAGEMENT ---

    List<Buyer> getAllBuyers();
    Buyer suspendBuyer(Long buyerId);
    //Buyer reactivateBuyer(Long buyerId);
    Buyer getBuyerbyId(Long buyerId);
    Buyer deleteBuyer(Long buyerId);



    // --- PRODUCT MANAGEMENT ---
    List<Product> getAllProducts();
    List<Product> getPendingProducts();
    Product approveProduct(Long productId);
//    Product deactivateProduct(Long productId);
    Product deleteProduct(Long productId);



    // --- ORDER MANAGEMENT ---
    List<Order> getAllOrders();
    public Order getOrderById(Long id);
//    Order updateOrderStatus(Long orderId, String status);



    // --- COUPON MANAGEMENT ---
    List<Coupon> getAllCoupons();
    Coupon createCoupon(Coupon coupon);
    Coupon updateCoupon(Long couponId, Coupon couponDetails);
    Coupon deactivateCoupon(Long couponId);
    Coupon deleteCoupon(Long couponId);



    // --- COMPLAINT MANAGEMENT ---
    List<Complaint> getAllComplaints();
    Complaint resolveComplaint(Long complaintId);
    Complaint closeComplaint(Long complaintId);

    // --- REPORTS & ANALYTICS ---
//    Map<String, Object> getReportsSummary();

    // --- ADMIN PROFILE ---
    Admin getProfile();
    Admin updateProfile(Long adminId , Admin updatedAdmin);
    void changePassword(String oldPassword, String newPassword);
}
