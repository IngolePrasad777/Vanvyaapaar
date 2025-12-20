package com.tribal.service.impl;

import com.tribal.model.*;
import com.tribal.repository.*;
import com.tribal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.*;

@Service

public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Override
    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Count totals
        long totalSellers = sellerRepository.count();
        long totalBuyers = buyerRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        
        // Count pending sellers
        long pendingSellers = sellerRepository.countByAdminApprovalStatus("PENDING");
        
        // Count active orders (not delivered/cancelled)
        long activeOrders = orderRepository.countByStatusNotIn(Arrays.asList("DELIVERED", "CANCELLED"));
        
        // Calculate revenue (sum of all completed orders)
        Double totalRevenue = orderRepository.sumTotalAmountByStatusIn(Arrays.asList("DELIVERED", "SHIPPED"));
        if (totalRevenue == null) totalRevenue = 0.0;
        
        // Calculate monthly revenue (current month)
        Double monthlyRevenue = orderRepository.sumTotalAmountByStatusInAndOrderDateAfter(
            Arrays.asList("DELIVERED", "SHIPPED"), 
            java.time.LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0)
        );
        if (monthlyRevenue == null) monthlyRevenue = 0.0;
        
        metrics.put("totalSellers", totalSellers);
        metrics.put("totalBuyers", totalBuyers);
        metrics.put("totalProducts", totalProducts);
        metrics.put("totalOrders", totalOrders);
        metrics.put("pendingSellers", pendingSellers);
        metrics.put("activeOrders", activeOrders);
        metrics.put("totalRevenue", totalRevenue);
        metrics.put("monthlyRevenue", monthlyRevenue);
        
        return metrics;
    }

    @Override
    public List<Seller> getAllSellers(){
         return sellerRepository.findAll();
    }

    @Override
    public List<Seller> getPendingSellers(String status) {
        return sellerRepository.findByAdminApprovalStatus(status);
    }

    @Override
    public Seller getSellerbyId(Long sellerId) {

        Optional<Seller> sellerOption = sellerRepository.findById(sellerId);
        if(sellerOption.isPresent()){
            Seller seller = sellerOption.get();
            return seller;
        }
        else{
            return null;
        }

    }

    @Override
    public Seller approveSeller(Long sellerId) {

        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);

        if(optionalSeller.isPresent()){
            Seller seller = optionalSeller.get();
            seller.setAdminApprovalStatus("APPROVED");
            return sellerRepository.save(seller);
        }else {
            return null;
        }
    }

    @Override
    public Seller suspendSeller(Long sellerId) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);

        if(optionalSeller.isPresent()){
            Seller seller = optionalSeller.get();
            seller.setAdminApprovalStatus("REJECTED");
            return sellerRepository.save(seller);
        }
        return null;
    }

    @Override
    public Seller deleteSeller(Long sellerId) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if(optionalSeller.isPresent()){
            Seller seller = optionalSeller.get();
            sellerRepository.deleteById(sellerId);
            return seller;
        }else{
            return null;
        }
    }

    @Override
    public List<Buyer> getAllBuyers() {
        return buyerRepository.findAll();
    }

    @Override
    public Buyer suspendBuyer(Long buyerId) {

        Optional<Buyer> optionalBuyer = buyerRepository.findById(buyerId);
        if(optionalBuyer.isPresent()){
            Buyer buyer = optionalBuyer.get();
            buyerRepository.deleteById(buyerId);
            return buyer;
        }

        return null;
    }

    @Override
    public Buyer getBuyerbyId(Long buyerId) {
        Optional<Buyer> optionalBuyer = buyerRepository.findById(buyerId);
        if(optionalBuyer.isPresent()){
            Buyer buyer = optionalBuyer.get();
            return buyer;
        }
        return null;
    }

    @Override
    public Buyer deleteBuyer(Long buyerId) {
        Optional<Buyer> optionalBuyer = buyerRepository.findById(buyerId);
        if(optionalBuyer.isPresent()){
            Buyer buyer = optionalBuyer.get();
            buyerRepository.deleteById(buyerId);
            return buyer ;
        }else{
            return null;
        }
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getPendingProducts() {
        // List<Product> pendingProducts = productRepository.findById()
        return null;
    }

    @Override
    public Product approveProduct(Long productId) {
//        Optional<Product> optionalProduct = productRepository.findById(productId);
//        if (optionalProduct.isPresent()){
//            Product product = optionalProduct.get();
//            product.set
//        }
        return null;
    }

    @Override
    public Product deleteProduct(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            productRepository.deleteById(productId);
            return product;
        }
        return null;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id){
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();
            return order;
        }
        return null;
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon updateCoupon(Long couponId, Coupon couponDetails) {

        Optional<Coupon> optionalCoupon = couponRepository.findById(couponId);
        if(optionalCoupon.isPresent()){
            Coupon coupon = optionalCoupon.get();

            coupon.setCode(couponDetails.getCode());
            coupon.setDiscountPercent(couponDetails.getDiscountPercent());
            coupon.setValidTill(couponDetails.getValidTill());
            coupon.setStatus(couponDetails.getStatus());
//            coupon.setCategory(couponDetails.getCategory());
            return couponRepository.save(coupon);
        }

        return null;
    }

    @Override
    public Coupon deactivateCoupon(Long couponId) {
        Optional<Coupon> optionalCoupon = couponRepository.findById(couponId);
        if (optionalCoupon.isPresent()){
            Coupon coupon = optionalCoupon.get();
            coupon.setStatus("EXPIRED");
            return couponRepository.save(coupon);
        }
        return null;
    }

    @Override
    public Coupon deleteCoupon(Long couponId) {
        Optional<Coupon> optionalCoupon = couponRepository.findById(couponId);
        if (optionalCoupon.isPresent()){
            Coupon coupon = optionalCoupon.get();
            couponRepository.deleteById(couponId);
            return coupon;
        }
        return null;
    }

    @Override
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @Override
    public Complaint resolveComplaint(Long complaintId) {
        return null;
    }

    @Override
    public Complaint closeComplaint(Long complaintId) {
        Optional<Complaint> optionalComplaint = complaintRepository.findById(complaintId);
        if (optionalComplaint.isPresent()){
            Complaint complaint = optionalComplaint.get();
            complaint.setStatus("RESOLVED");
            return complaintRepository.save(complaint);
        }
        return null;
    }

    @Override
    public Admin getProfile() {
        List<Admin> admins = adminRepository.findAll();
        if (admins.isEmpty()){
            return null;
        }
        return admins.get(0);
    }

    @Override
    public Admin updateProfile(Long adminId , Admin updatedAdmin) {
        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);
        if (optionalAdmin.isPresent()){
            Admin admin = optionalAdmin.get();
            admin.setName(updatedAdmin.getName());
            admin.setAddress(updatedAdmin.getAddress());
            admin.setEmail(updatedAdmin.getEmail());
            admin.setPhone(updatedAdmin.getPhone());
            admin.setPincode(updatedAdmin.getPincode());
            admin.setConfirmPassword(updatedAdmin.getConfirmPassword());

            return adminRepository.save(admin);
        }
        return null;
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        Admin admin = getProfile();
        if (admin != null){

            if(oldPassword == newPassword){
                admin.setPassword(oldPassword);
                admin.setConfirmPassword(oldPassword);
                adminRepository.save(admin);
            }else{
                admin.setPassword(newPassword);
                admin.setConfirmPassword(newPassword);
                adminRepository.save(admin);
            }
        }
        else{
            System.out.println("Admin Profile Not Found");
        }
    }
}
