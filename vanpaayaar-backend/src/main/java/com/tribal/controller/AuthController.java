package com.tribal.controller;

import com.tribal.model.Admin;
import com.tribal.model.Buyer;
import com.tribal.model.Seller;
import com.tribal.repository.AdminRepository;
import com.tribal.repository.BuyerRepository;
import com.tribal.repository.SellerRepository;
import com.tribal.security.JwtUtil;
import com.tribal.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AdminRepository adminRepository;
    private final BuyerRepository buyerRepository;
    private final SellerRepository sellerRepository;
    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;

    public AuthController(AdminRepository adminRepository, BuyerRepository buyerRepository, SellerRepository sellerRepository, JwtUtil jwtUtil, NotificationService notificationService) {
        this.adminRepository = adminRepository;
        this.buyerRepository = buyerRepository;
        this.sellerRepository = sellerRepository;
        this.jwtUtil = jwtUtil;
        this.notificationService = notificationService;
    }

    public static class LoginRequest {
        public String email;
        public String password;
        public String role; // ADMIN, BUYER, SELLER
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.email == null || req.password == null || req.role == null) {
            return ResponseEntity.badRequest().body("email, password, role are required");
        }

        String role = req.role.toUpperCase();
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        String name = "";
        Long id = null;

        switch (role) {
            case "ADMIN": {
                Admin a = adminRepository.findByEmail(req.email).orElse(null);
                if (a == null || !req.password.equals(a.getPassword())) return ResponseEntity.status(401).body("Invalid credentials");
                name = a.getName(); id = a.getId();
                break;
            }
            case "BUYER": {
                Buyer b = buyerRepository.findByEmail(req.email).orElse(null);
                if (b == null || !req.password.equals(b.getPassword())) return ResponseEntity.status(401).body("Invalid credentials");
                name = b.getName(); id = b.getId();
                break;
            }
            case "SELLER": {
                Seller s = sellerRepository.findByEmail(req.email).orElse(null);
                if (s == null || !req.password.equals(s.getPassword())) return ResponseEntity.status(401).body("Invalid credentials");
                name = s.getName(); id = s.getId();
                break;
            }
            default:
                return ResponseEntity.badRequest().body("Unknown role");
        }

        String token = jwtUtil.generateToken(req.email, claims, 1000L * 60 * 60 * 10); // 10 hours
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("role", role);
        resp.put("name", name);
        resp.put("id", id);
        return ResponseEntity.ok(resp);
    }

    // -------------------- SIGNUP --------------------
    public static class BuyerSignupRequest {
        public String name;
        public String email;
        public String password;
        public String confirmPassword;
        public String phone;
        public String address;
        public String pincode;
    }

    @PostMapping("/signup/buyer")
    public ResponseEntity<?> signupBuyer(@RequestBody BuyerSignupRequest req) {
        if (req.email == null || req.password == null || req.confirmPassword == null || req.name == null) {
            return ResponseEntity.badRequest().body("name, email, password, confirmPassword are required");
        }
        if (!req.password.equals(req.confirmPassword)) {
            return ResponseEntity.badRequest().body("password and confirmPassword do not match");
        }
        if (buyerRepository.findByEmail(req.email).isPresent()) {
            return ResponseEntity.status(409).body("Email already registered as Buyer");
        }
        Buyer buyer = Buyer.builder()
                .name(req.name)
                .email(req.email)
                .password(req.password)
                .confirmPassword(req.confirmPassword)
                .phone(req.phone)
                .address(req.address)
                .pincode(req.pincode)
                .build();
        buyer = buyerRepository.save(buyer);
        return ResponseEntity.ok(buyer);
    }

    public static class SellerSignupRequest {
        public String name;
        public String email;
        public String password;
        public String confirmPassword;
        public String phone;
        public String address;
        public String pincode;
        public String tribeName;
        public String artisanCategory;
        public String region;
        public String bio;
        public String bankAccountNumber;
        public String ifscCode;
        public String panNumber;
        public boolean termsAccepted;
        public boolean consentAccepted;
    }

    @PostMapping("/signup/seller")
    public ResponseEntity<?> signupSeller(@RequestBody SellerSignupRequest req) {
        if (req.email == null || req.password == null || req.confirmPassword == null || req.name == null) {
            return ResponseEntity.badRequest().body("name, email, password, confirmPassword are required");
        }
        if (!req.password.equals(req.confirmPassword)) {
            return ResponseEntity.badRequest().body("password and confirmPassword do not match");
        }
        if (sellerRepository.findByEmail(req.email).isPresent()) {
            return ResponseEntity.status(409).body("Email already registered as Seller");
        }
        if (!req.termsAccepted || !req.consentAccepted) {
            return ResponseEntity.badRequest().body("termsAccepted and consentAccepted must be true");
        }
        Seller seller = Seller.builder()
                .name(req.name)
                .email(req.email)
                .password(req.password)
                .confirmPassword(req.confirmPassword)
                .phone(req.phone)
                .address(req.address)
                .pincode(req.pincode)
                .tribeName(req.tribeName)
                .artisanCategory(req.artisanCategory)
                .region(req.region)
                .bio(req.bio)
                .bankAccountNumber(req.bankAccountNumber)
                .ifscCode(req.ifscCode)
                .panNumber(req.panNumber)
                .termsAccepted(true)
                .consentAccepted(true)
                .adminApprovalStatus("PENDING")
                .build();
        seller = sellerRepository.save(seller);
        
        // Notify admin about new seller registration
        notificationService.notifyAdminNewSeller(1L, seller.getId(), seller.getName());
        
        return ResponseEntity.ok(seller);
    }
}
