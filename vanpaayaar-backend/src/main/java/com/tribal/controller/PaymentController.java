package com.tribal.controller;

import com.tribal.dto.PaymentRequest;
import com.tribal.dto.PaymentVerificationRequest;
import com.tribal.model.Payment;
import com.tribal.service.PaymentService;
import com.tribal.service.NotificationService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private NotificationService notificationService;

    /**
     * Create a new Razorpay order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest request) {
        try {
            // Validate request
            if (request.getBuyerId() == null || request.getAmount() == null || request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body("Invalid payment request");
            }

            JSONObject orderDetails = paymentService.createRazorpayOrder(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", orderDetails.get("orderId"));
            response.put("amount", orderDetails.get("amount"));
            response.put("currency", orderDetails.get("currency"));
            response.put("keyId", orderDetails.get("keyId"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create payment order");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Handle payment success (simpler endpoint for success flow)
     */
    @PostMapping("/success")
    public ResponseEntity<?> paymentSuccess(@RequestBody Map<String, String> data) {
        try {
            String orderId = data.get("razorpay_order_id");
            String paymentId = data.get("razorpay_payment_id");
            String signature = data.get("razorpay_signature");

            if (orderId == null || paymentId == null || signature == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Missing required payment data"
                ));
            }

            // Find payment by order ID
            Payment payment = paymentService.getPaymentByRazorpayOrderId(orderId);

            if (payment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Payment record not found"
                ));
            }

            // Verify signature first
            try {
                PaymentVerificationRequest verifyRequest = PaymentVerificationRequest.builder()
                    .razorpayOrderId(orderId)
                    .razorpayPaymentId(paymentId)
                    .razorpaySignature(signature)
                    .build();
                
                paymentService.verifyPayment(verifyRequest);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Payment verification failed: " + e.getMessage()
                ));
            }

            // Mark payment as success
            payment.setStatus("SUCCESS");
            payment.setRazorpayPaymentId(paymentId);
            payment.setRazorpaySignature(signature);
            payment.setCompletedAt(LocalDateTime.now());
            payment.setErrorMessage(null);

            paymentService.updatePayment(payment);

            // Send payment success notification
            try {
                if (payment.getBuyer() != null) {
                    notificationService.createNotification(
                        payment.getBuyer().getId(), "BUYER", "PAYMENT_SUCCESS",
                        "Payment Successful",
                        "Your payment of ₹" + payment.getAmount() + " was processed successfully.",
                        "NORMAL", payment.getId(), "PAYMENT", null, true
                    );
                }
            } catch (Exception e) {
                System.err.println("Failed to send payment success notification: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment successful",
                "orderId", orderId,
                "paymentId", paymentId
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error processing payment: " + e.getMessage()
            ));
        }
    }

    /**
     * Verify payment after successful payment
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            // Validate request
            if (request.getRazorpayOrderId() == null || 
                request.getRazorpayPaymentId() == null || 
                request.getRazorpaySignature() == null) {
                return ResponseEntity.badRequest().body("Invalid verification request");
            }

            Payment payment = paymentService.verifyPayment(request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment verified successfully");
            response.put("payment", payment);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Payment verification failed");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Get payment by Razorpay order ID
     */
    @GetMapping("/order/{razorpayOrderId}")
    public ResponseEntity<?> getPaymentByOrderId(@PathVariable String razorpayOrderId) {
        try {
            Payment payment = paymentService.getPaymentByRazorpayOrderId(razorpayOrderId);
            if (payment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Payment not found for order ID: " + razorpayOrderId);
            }
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching payment: " + e.getMessage());
        }
    }

    /**
     * Get all payments for a buyer
     */
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<?> getPaymentsByBuyer(@PathVariable Long buyerId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByBuyerId(buyerId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching payments: " + e.getMessage());
        }
    }

    /**
     * Handle payment failure
     */
    @PostMapping("/failure")
    public ResponseEntity<?> handlePaymentFailure(@RequestBody Map<String, String> request) {
        try {
            String razorpayOrderId = request.get("razorpayOrderId");
            String razorpayPaymentId = request.get("razorpayPaymentId");
            String errorMessage = request.get("errorMessage");

            // Try to find payment by order ID first (always available)
            Payment payment = null;
            if (razorpayOrderId != null) {
                payment = paymentService.getPaymentByRazorpayOrderId(razorpayOrderId);
            } else if (razorpayPaymentId != null) {
                // Fallback to payment ID if order ID not available
                paymentService.updatePaymentStatus(razorpayPaymentId, "FAILED", errorMessage);
            }

            // Update payment status if found
            if (payment != null) {
                payment.setStatus("FAILED");
                payment.setErrorMessage(errorMessage != null ? errorMessage : "Payment failed");
                payment.setCompletedAt(LocalDateTime.now());
                paymentService.updatePayment(payment);
                
                // Send payment failure notification
                try {
                    if (payment.getBuyer() != null) {
                        notificationService.createNotification(
                            payment.getBuyer().getId(), "BUYER", "PAYMENT_FAILED",
                            "Payment Failed",
                            "Your payment of ₹" + payment.getAmount() + " failed. Please try again or contact support.",
                            "HIGH", payment.getId(), "PAYMENT", null, true
                        );
                    }
                } catch (Exception e) {
                    System.err.println("Failed to send payment failure notification: " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment failure recorded");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Don't throw error, just log and return success
            System.err.println("Error handling payment failure: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment failure acknowledged");
            
            return ResponseEntity.ok(response);
        }
    }
}
