package com.tribal.controller;

import com.tribal.dto.ChatbotRequest;
import com.tribal.dto.ChatbotResponse;
import com.tribal.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatbotController {
    
    private final ChatbotService chatbotService;
    
    @PostMapping("/message")
    public ResponseEntity<ChatbotResponse> processMessage(@RequestBody ChatbotRequest request) {
        try {
            ChatbotResponse response = chatbotService.processMessage(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ChatbotResponse errorResponse = ChatbotResponse.builder()
                    .message("🤖 Sorry, I'm having technical difficulties. Please try again later.")
                    .type("ERROR")
                    .build();
            return ResponseEntity.ok(errorResponse);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("VanMitra is ready to help! 🤖");
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Chatbot endpoint is accessible!");
    }
}