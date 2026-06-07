package com.hackops.elitereserve.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChatResponse {
    private String response;
    private List<String> sources;
    private boolean isActionRequired;
    private String actionType;
}
