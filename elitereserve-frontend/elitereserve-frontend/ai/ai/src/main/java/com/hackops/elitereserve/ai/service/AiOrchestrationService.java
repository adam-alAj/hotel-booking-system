package com.hackops.elitereserve.ai.service;

import com.hackops.elitereserve.ai.dto.ChatRequest;
import com.hackops.elitereserve.ai.dto.ChatResponse;
import com.hackops.elitereserve.ai.service.retrieval.KnowledgeBaseService;
import com.hackops.elitereserve.ai.service.ai.GeminiService;
import com.hackops.elitereserve.ai.adapter.EliteReserveAdapter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiOrchestrationService {

    private final KnowledgeBaseService knowledgeBaseService;
    private final GeminiService geminiService;
    private final EliteReserveAdapter eliteReserveAdapter;

    public ChatResponse processMessage(ChatRequest request, String authHeader) {
        log.info("Processing message for session {}: {}", request.getSessionId(), request.getMessage());

        String lowerMessage = request.getMessage().toLowerCase();
        String context = knowledgeBaseService.retrieveContext(request.getMessage());
        String liveData = "";

        // Step 1: Execute API call and capture raw sentinel result
        String rawResult = "";
        try {
            if (isSearchQuery(lowerMessage)) {
                Map<String, String> params = geminiService.extractSearchParams(request.getMessage());
                rawResult = eliteReserveAdapter.searchHotels(params.get("name"), params.get("city"), authHeader);
            } else if (isBookingQuery(lowerMessage) || isBookingVerification(lowerMessage)) {
                rawResult = eliteReserveAdapter.getBookingStatus(authHeader);
            } else if (lowerMessage.contains("details for hotel") || lowerMessage.contains("tell me about")) {
                String hotelId = extractId(lowerMessage);
                if (hotelId != null) {
                    rawResult = eliteReserveAdapter.getHotelDetails(hotelId);
                }
            }
        } catch (Exception e) {
            log.error("Unexpected error in API call chain", e);
            rawResult = EliteReserveAdapter.RESULT_SERVICE_ERROR;
        }

        // Passing rawResult directly so Gemini can handle failures according to its new instructions
        String liveOutput = rawResult.isEmpty() ? "No database query was needed for this message." : rawResult;

        String systemPrompt = "You are the EliteReserve Intelligent Assistant. You have DIRECT access to our real-time database via specialized tool outputs provided in the \"Live Data\" section below.\n\n" +
                "CRITICAL INSTRUCTIONS:\n" +
                "1. Always check the \"Live Data\" section before answering.\n" +
                "2. If \"Live Data\" contains hotel or booking information, treat it as the absolute truth and present it professionally to the user.\n" +
                "3. If \"Live Data\" says \"__SERVICE_UNAVAILABLE__\", apologize and explain that our booking system is undergoing maintenance, but offer to answer general questions.\n" +
                "4. If \"Live Data\" says \"__NO_DATA_FOUND__\", inform the user politely that no results match their specific criteria and suggest broading their search.\n" +
                "5. If the user is logged in (Auth Header present), you can see their personal bookings. If not, ask them to log in to see private details.\n\n" +
                "Current Live Data from Database:\n" +
                liveOutput + "\n\n" +
                "User Context:\n" +
                context + "\n\n" +
                "Response Format:\n" +
                "- Use professional tone.\n" +
                "- If showing hotels, use bullet points for (Name, City, Price).\n" +
                "- If an action is needed (like payment), include \"ACTION:PAYMENT\".\n";
        
        String aiResponse = geminiService.generateResponse(systemPrompt, request.getMessage());

        return ChatResponse.builder()
                .response(aiResponse)
                .sources(List.of("Live Platform API", "Documentation"))
                .isActionRequired(aiResponse.contains("ACTION:") || aiResponse.toLowerCase().contains("go to"))
                .actionType(extractActionType(aiResponse))
                .build();
    }

    private boolean isSearchQuery(String msg) {
        return msg.contains("hotels in") || msg.contains("find hotel") || 
               msg.contains("search hotel") || msg.contains("show hotel") ||
               (msg.contains("hotel") && (msg.contains("search") || msg.contains("find") || 
                msg.contains("looking") || msg.contains("available")));
    }

    private boolean isBookingQuery(String msg) {
        return msg.contains("booking") || msg.contains("reservation") || msg.contains("my stay") || msg.contains("history");
    }

    private boolean isBookingVerification(String msg) {
        return msg.contains("i have") || msg.contains("i've") || msg.contains("my booking at") || msg.contains("correct");
    }

    private String extractId(String msg) {
        // Simple regex/matcher for IDs in the form #123 or just 123
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\d+");
        java.util.regex.Matcher matcher = pattern.matcher(msg);
        return matcher.find() ? matcher.group() : null;
    }

    private String extractActionType(String response) {
        if (response.contains("ACTION:PAYMENT")) return "PAYMENT_GUIDE";
        if (response.contains("ACTION:BOOKING")) return "BOOKING_GUIDE";
        return null;
    }
}