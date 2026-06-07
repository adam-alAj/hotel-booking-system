package com.hackops.elitereserve.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {
    @NotBlank(message = "Session ID is required")
    private String sessionId;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String role; // Optional: guest, hotel_manager, admin
}
