package com.tribal.dto;

import lombok.Data;

@Data
public class ChatbotRequest {
    private String message;
    private String userRole; // GUEST, BUYER, SELLER, ADMIN
    private Long userId; // null for guests
}