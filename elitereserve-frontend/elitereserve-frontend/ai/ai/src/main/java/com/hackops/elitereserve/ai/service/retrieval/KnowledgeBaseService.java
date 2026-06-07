package com.hackops.elitereserve.ai.service.retrieval;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class KnowledgeBaseService {

    // Simple in-memory knowledge base for version 1
    private final Map<String, String> knowledge = new HashMap<>();

    public KnowledgeBaseService() {
        knowledge.put("booking", "To book a hotel, search for a hotel, select a room type, and click 'Book Now'. You must pay within 15 minutes.");
        knowledge.put("payment", "We support electronic payments. Once you book, you will be redirected to the payment window.");
        knowledge.put("cancellation", "You can cancel within 48 hours for a 66% refund. After 48 hours, no refund is available.");
        knowledge.put("extension", "You can extend your booking by paying the price difference for the extra nights.");
    }

    public String retrieveContext(String query) {
        StringBuilder context = new StringBuilder();
        String lowerQuery = query.toLowerCase();
        
        for (Map.Entry<String, String> entry : knowledge.entrySet()) {
            if (lowerQuery.contains(entry.getKey())) {
                context.append(entry.getValue()).append(" ");
            }
        }
        
        return context.isEmpty() ? "General EliteReserve platform information." : context.toString();
    }
}
