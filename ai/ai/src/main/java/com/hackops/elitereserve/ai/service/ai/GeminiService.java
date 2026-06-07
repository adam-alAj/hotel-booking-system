package com.hackops.elitereserve.ai.service.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    @Value("${ai.gemini.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    public String generateResponse(String systemPrompt, String userMessage) {
        String url = String.format(GEMINI_API_URL, model, apiKey);
        String combinedPrompt = systemPrompt + "\n\nUser Question: " + userMessage;

        Map<String, Object> part = Map.of("text", combinedPrompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info("Calling Gemini API for model: {}", model);
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
                    if (contentMap != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }
            return "أعتذر منك، يبدو أن هناك ضغطاً كبيراً على نظام الذكاء الاصطناعي حالياً. يرجى المحاولة مرة أخرى بعد قليل.";
        } catch (HttpStatusCodeException e) {
            log.error("API Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "أعتذر منك، يبدو أن هناك ضغطاً كبيراً على نظام الذكاء الاصطناعي حالياً. يرجى المحاولة مرة أخرى بعد قليل.";
        } catch (Exception e) {
            log.error("General Error: {}", e.getMessage(), e);
            return "أعتذر منك، يبدو أن هناك ضغطاً كبيراً على نظام الذكاء الاصطناعي حالياً. يرجى المحاولة مرة أخرى بعد قليل.";
        }
    }

    /**
     * Extracts search parameters from a user message.
     * Returns a Map with "city" and "name".
     */
    public Map<String, String> extractSearchParams(String userMessage) {
        String extractionPrompt = "Extract the intended hotel name and city from this user message. " +
                "Output ONLY a comma-separated list like 'name:HotelName,city:CityName'. " +
                "If not present, use 'null'. Example: 'hotels in Paris' -> 'name:null,city:Paris'. " +
                "Message: " + userMessage;

        String response;
        try {
            response = generateResponse("You are a data extraction assistant.", extractionPrompt);
        } catch (Exception e) {
            log.warn("Gemini failed during param extraction, using fallback regex");
            return fallbackExtract(userMessage);
        }
        
        if (response == null || response.contains("ضغطاً كبيراً")) {
            log.warn("Gemini overloaded during extraction, using fallback");
            return fallbackExtract(userMessage);
        }
        
        try {
            log.info("Extracted params raw response: {}", response);
            String name = "null";
            String city = "null";
            
            String[] parts = response.split(",");
            for (String p : parts) {
                p = p.trim();
                if (p.startsWith("name:")) name = p.substring(5).trim();
                if (p.startsWith("city:")) city = p.substring(5).trim();
            }
            
            return Map.of("name", name, "city", city);
        } catch (Exception e) {
            log.warn("Failed to parse extracted params, falling back. Response was: {}", response);
            return fallbackExtract(userMessage);
        }
    }

    private Map<String, String> fallbackExtract(String userMessage) {
        String city = "null";
        String name = "null";
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(?:in|at|near)\\s+([A-Za-z\\s]+?)(?:\\s*$|[,.])", 
                         java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(userMessage);
        if (m.find()) {
            city = m.group(1).trim();
        }
        return Map.of("name", name, "city", city);
    }
}
