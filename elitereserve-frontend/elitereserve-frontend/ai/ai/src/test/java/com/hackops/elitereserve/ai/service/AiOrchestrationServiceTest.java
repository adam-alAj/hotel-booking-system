package com.hackops.elitereserve.ai.service;

import com.hackops.elitereserve.ai.dto.ChatRequest;
import com.hackops.elitereserve.ai.dto.ChatResponse;
import com.hackops.elitereserve.ai.service.retrieval.KnowledgeBaseService;
import com.hackops.elitereserve.ai.service.ai.GeminiService;
import com.hackops.elitereserve.ai.adapter.EliteReserveAdapter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AiOrchestrationServiceTest {

    @Mock
    private KnowledgeBaseService knowledgeBaseService;

    @Mock
    private GeminiService geminiService;

    @Mock
    private EliteReserveAdapter eliteReserveAdapter;

    @InjectMocks
    private AiOrchestrationService orchestrationService;

    @Test
    public void testProcessMessage_BasicFlow() {
        // Arrange
        ChatRequest request = new ChatRequest();
        request.setSessionId("session-123");
        request.setMessage("How do I book?");

        when(knowledgeBaseService.retrieveContext(anyString())).thenReturn("Booking context");
        when(geminiService.generateResponse(anyString(), anyString())).thenReturn("To book, follow these steps...");

        // Act
        ChatResponse response = orchestrationService.processMessage(request, null);

        // Assert
        assertNotNull(response);
        assertTrue(response.getResponse().contains("book"));
    }
}
