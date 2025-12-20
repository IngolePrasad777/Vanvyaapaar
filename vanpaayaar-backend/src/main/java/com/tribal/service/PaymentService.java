package com.tribal.service;

import com.tribal.dto.PaymentRequest;
import com.tribal.dto.PaymentVerificationRequest;
import com.tribal.model.Payment;
import org.json.JSONObject;

import java.util.List;

public interface PaymentService {
    JSONObject createRazorpayOrder(PaymentRequest request) throws Exception;
    Payment verifyPayment(PaymentVerificationRequest request) throws Exception;
    Payment getPaymentByRazorpayOrderId(String razorpayOrderId);
    List<Payment> getPaymentsByBuyerId(Long buyerId);
    Payment updatePaymentStatus(String razorpayPaymentId, String status, String errorMessage);
    Payment updatePayment(Payment payment);
}
