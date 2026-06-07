package com.hackops.elitereserve.ai.controller;

import com.hackops.elitereserve.ai.dto.ChatRequest;
import com.hackops.elitereserve.ai.dto.ChatResponse;
import com.hackops.elitereserve.ai.service.AiOrchestrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class AiChatController {

    private final AiOrchestrationService orchestrationService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(orchestrationService.processMessage(request, authHeader));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Assistant is healthy");
    }
}
