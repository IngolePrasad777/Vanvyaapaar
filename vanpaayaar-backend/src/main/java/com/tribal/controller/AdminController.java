package com.tribal.controller;

import com.tribal.model.*;
import com.tribal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // --- Dashboard Metrics ---
    @GetMapping("/dashboard/metrics")
    public ResponseEntity<?> getDashboardMetrics() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    // ********** SELLER**************

    @GetMapping("/sellers")
    public ResponseEntity<?> getAllSellers() {
        List<Seller> sellers = adminService.getAllSellers();
        if(sellers.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No seller found !");
        }
        return ResponseEntity.ok(sellers);
    }

    @GetMapping("/sellers/pending")
    public ResponseEntity<?> getPendingSellers(@RequestParam String status){
        List<Seller> sellers = adminService.getPendingSellers(status);
        if(sellers.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No " + status + " seller found !");
        }
        return ResponseEntity.ok(sellers);
    }

    @GetMapping("/sellers/{id}")
    public ResponseEntity<?> getSellerbyId(@PathVariable Long id){
        Seller seller = adminService.getSellerbyId(id);
//        return ResponseEntity.ok(seller);
        if(seller != null){
            return ResponseEntity.ok(seller);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO seller Exits With ID : " + id);
    }

    @PutMapping("/sellers/{id}/approve")
    public ResponseEntity<?> approveSeller(@PathVariable Long id){
        Seller seller = adminService.approveSeller(id);
        if(seller != null){
            return ResponseEntity.ok("Seller Approved Succesfully " + seller.getId() );
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Seller Found With id " + id);
    }

    @PutMapping("/sellers/{id}/suspend")
    public ResponseEntity<?> sespendSeller(@PathVariable Long id){
        Seller seller = adminService.suspendSeller(id);
        if(seller != null){
            return ResponseEntity.ok("Seller Has Been Suspended : " + seller.getId());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Seller Found With id " + id);
    }

    @PutMapping("/sellers/{id}/delete")
    public ResponseEntity<?> deleteSeller(@PathVariable Long id){
        Seller seller = adminService.deleteSeller(id);
        if(seller != null){
            return ResponseEntity.ok("Seller Has Been Deleted : " + seller.getId());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Seller Found With id " + id);
    }


//    ************ BUYERRRRRRRRRRR *****************

    @GetMapping("/buyers")
    public ResponseEntity<?> getAllBuyers(){
        List<Buyer> buyers = adminService.getAllBuyers();
        if(buyers.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Buyers Exist ");
        }
        return ResponseEntity.ok(buyers);
    }

    @GetMapping("/buyers/{id}")
    public ResponseEntity<?> getBuyerById(@PathVariable Long id){
        Buyer buyer = adminService.getBuyerbyId(id);
        if(buyer != null){
            return ResponseEntity.ok(buyer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Buyer Found : " + buyer.getId());
    }

    @DeleteMapping("/buyers/{id}")
    public ResponseEntity<?> deleteBuyerById(@PathVariable Long id){
        Buyer buyer = adminService.deleteBuyer(id);
        if(buyer != null){
            return ResponseEntity.ok(buyer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Buyer Not Found " + buyer.getId());
    }

    @PutMapping("/buyers/{id}/suspend")
    public ResponseEntity<?> suspendById(@PathVariable Long id){
        Buyer buyer = adminService.suspendBuyer(id);
        if(buyer != null){
            return ResponseEntity.ok(buyer);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Buyer Found " + buyer.getId());
    }

//    PRODUCTTTTTTTTTTTTTTT*************************

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts(){
        List<Product> products = adminService.getAllProducts();
        if(products.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No Product Found ");
        }
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Product product = adminService.deleteProduct(id);
        if(product != null){
            return ResponseEntity.ok("🗑️ Product deleted: " + product.getId());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No product found with ID: " + id);
    }

//    ***************** ORDERSSSSSS******************

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = adminService.getAllOrders();
        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders found");
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Order order = adminService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No order found with ID: " + id);
    }

//    ********** COUPONNNNNNNNNNNNNNN*******************

    @GetMapping("/coupons")
    public ResponseEntity<?> getAllCoupons() {
        List<Coupon> coupons = adminService.getAllCoupons();
        if (coupons.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No coupons found");
        }
        return ResponseEntity.ok(coupons);
    }

    @PostMapping("/coupons")
    public ResponseEntity<?> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createCoupon(coupon));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<?> updateCoupon(@PathVariable Long id, @RequestBody Coupon coupon) {
        Coupon updated = adminService.updateCoupon(id, coupon);
        if(updated != null){
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No coupon found with ID: " + id);
    }

    @PutMapping("/coupons/{id}/deactivate")
    public ResponseEntity<?> deactivateCoupon(@PathVariable Long id) {
        Coupon coupon = adminService.deactivateCoupon(id);
        if(coupon != null){
            return ResponseEntity.ok("⚠️ Coupon deactivated: " + coupon.getId());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No coupon found with ID: " + id);
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        Coupon coupon = adminService.deleteCoupon(id);
        if(coupon != null){
            return ResponseEntity.ok("🗑️ Coupon deleted: " + coupon.getId());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No coupon found with ID: " + id);
    }

// **************** COMPLAINTSSSSSSSSSSSSSS*************

    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints() {
        List<Complaint> complaints = adminService.getAllComplaints();
        if (complaints.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No complaints found");
        }
        return ResponseEntity.ok(complaints);
    }

    @PutMapping("/complaints/{id}/close")
    public ResponseEntity<?> closeComplaint(@PathVariable Long id) {
        Complaint complaint = adminService.closeComplaint(id);
        if(complaint != null){
            return ResponseEntity.ok("✅ Complaint closed: " + complaint.getId());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No complaint found with ID: " + id);
    }

//    ******************* ADMIN PROFILEEEEE**************************

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Admin admin = adminService.getProfile();
        if(admin != null){
            return ResponseEntity.ok(admin);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin profile not found");
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Admin updatedAdmin) {
        Admin admin = adminService.updateProfile(id, updatedAdmin);
        if(admin != null){
            return ResponseEntity.ok(admin);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found with ID: " + id);
    }

    @PutMapping("/profile/change-password")
    public ResponseEntity<?> changePassword(@RequestParam String oldPassword, @RequestParam String newPassword) {
        adminService.changePassword(oldPassword, newPassword);
        return ResponseEntity.ok("🔒 Password change request processed");
    }

}

