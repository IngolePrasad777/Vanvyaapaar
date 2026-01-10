package com.tribal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<?> hello() {
        return ResponseEntity.ok(Map.of(
            "message", "Hello from VanVyaapaar API!",
            "timestamp", LocalDateTime.now().toString(),
            "status", "API is working"
        ));
    }

    @GetMapping("/delivery-endpoints")
    public ResponseEntity<?> listDeliveryEndpoints() {
        return ResponseEntity.ok(Map.of(
            "message", "Available delivery endpoints",
            "endpoints", Map.of(
                "test", "/api/delivery/test",
                "track", "/api/delivery/track/{trackingId}",
                "serviceable", "/api/delivery/serviceable/{pincode}",
                "charge", "/api/delivery/charge/{pincode}/{deliveryType}",
                "analytics", "/api/delivery/analytics"
            ),
            "note", "These endpoints should be publicly accessible"
        ));
    }
}