package com.tribal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotResponse {
    private String message;
    private String type; // TEXT, PRODUCT_LIST, ORDER_INFO, FAQ
    private List<Object> data; // Additional data like products, orders
    private List<String> suggestions; // Quick reply suggestions
}