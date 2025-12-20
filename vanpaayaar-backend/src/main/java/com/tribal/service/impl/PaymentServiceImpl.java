package com.tribal.service.impl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.tribal.dto.PaymentRequest;
import com.tribal.dto.PaymentVerificationRequest;
import com.tribal.model.Buyer;
import com.tribal.model.Payment;
import com.tribal.repository.BuyerRepository;
import com.tribal.repository.PaymentRepository;
import com.tribal.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BuyerRepository buyerRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            BuyerRepository buyerRepository,
            @Value("${razorpay.key.id}") String keyId,
            @Value("${razorpay.key.secret}") String keySecret
    ) throws RazorpayException {
        this.paymentRepository = paymentRepository;
        this.buyerRepository = buyerRepository;
        this.razorpayClient = new RazorpayClient(keyId, keySecret);
        this.razorpayKeyId = keyId;
        this.razorpayKeySecret = keySecret;
    }

    @Override
    public JSONObject createRazorpayOrder(PaymentRequest request) throws Exception {
        try {
            // Validate buyer
            Buyer buyer = buyerRepository.findById(request.getBuyerId())
                    .orElseThrow(() -> new RuntimeException("Buyer not found"));

            // Convert amount to paise (Razorpay uses smallest currency unit)
            int amountInPaise = (int) (request.getAmount() * 100);

            // Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            // Save payment record
            Payment payment = Payment.builder()
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .status("CREATED")
                    .buyer(buyer)
                    .createdAt(LocalDateTime.now())
                    .build();

            paymentRepository.save(payment);

            // Return order details for frontend
            JSONObject response = new JSONObject();
            response.put("orderId", (String) razorpayOrder.get("id"));
            response.put("amount", (Integer) amountInPaise);
            response.put("currency", (String) request.getCurrency());
            response.put("keyId", (String) razorpayKeyId);

            return response;

        } catch (RazorpayException e) {
            throw new Exception("Failed to create Razorpay order: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new Exception("Error creating payment order: " + e.getMessage(), e);
        }
    }

    @Override
    public Payment verifyPayment(PaymentVerificationRequest request) throws Exception {
        try {
            // Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (!isValidSignature) {
                throw new Exception("Invalid payment signature");
            }

            // Update payment record
            Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setStatus("SUCCESS");
            payment.setCompletedAt(LocalDateTime.now());

            return paymentRepository.save(payment);

        } catch (RazorpayException e) {
            throw new Exception("Payment verification failed: " + e.getMessage(), e);
        } catch (Exception e) {
            // Update payment status to failed
            Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElse(null);
            if (payment != null) {
                payment.setStatus("FAILED");
                payment.setErrorMessage(e.getMessage());
                paymentRepository.save(payment);
            }
            throw new Exception("Error verifying payment: " + e.getMessage(), e);
        }
    }

    @Override
    public Payment getPaymentByRazorpayOrderId(String razorpayOrderId) {
        return paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElse(null);
    }

    @Override
    public List<Payment> getPaymentsByBuyerId(Long buyerId) {
        return paymentRepository.findByBuyerId(buyerId);
    }

    @Override
    public Payment updatePaymentStatus(String razorpayPaymentId, String status, String errorMessage) {
        Payment payment = paymentRepository.findByRazorpayPaymentId(razorpayPaymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(status);
        if (errorMessage != null) {
            payment.setErrorMessage(errorMessage);
        }
        if ("SUCCESS".equals(status)) {
            payment.setCompletedAt(LocalDateTime.now());
        }

        return paymentRepository.save(payment);
    }

    public Payment updatePayment(Payment payment) {
        return paymentRepository.save(payment);
    }
}
