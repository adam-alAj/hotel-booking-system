# Architecture Design - EliteReserve AI Subsystem

## Subsystem Purpose
To provide a self-contained, secure, and intelligent assistant that helps users interact with the EliteReserve hotel booking platform without adding complexity to the core business logic.

## Scope Boundaries
- **In-Scope**: Platform explanation, hotel search guidance, booking assistance, user-specific booking status (read-only).
- **Out-of-Scope**: Arbitrary SQL execution, modifying core booking data, general-purpose chat (e.g., weather, news), administrative data deletion.

## Folder Structure
```text
/ai (Backend)
  /src/main/java/com/hackops/elitereserve/ai
    /config       - App and Security configurations
    /controller   - AI Chat and Feedback REST endpoints
    /dto          - Request/Response data objects
    /service      - Orchestration and AI Logic
    /adapter      - Safe communication with main backend APIs
    /retrieval    - Knowledge base and document chunking
    /security     - JWT extraction and role validation
  /src/main/resources
    /knowledge    - Platform documentation shards
    application.properties - Isolated configuration
/ai_frontend (Frontend)
  /src
    /components   - Chat UI, Message list, Input field
    /services     - API client for /ai backend
    /hooks        - State management for chat history
```

## Backend Architecture
- **Framework**: Spring Boot 3.x
- **AI Core**: Google Gemini 1.5/2.0 (via REST)
- **Persistence**: MySQL (Isolated schema/tables for AI sessions if needed)
- **Adapters**: The `EliteReserveAdapter` acts as a facade, calling the main backend's REST APIs. It NEVER interacts with the main DB directly.

## Frontend Architecture
- **Framework**: Isolated React module (Vite/CRA)
- **Styling**: Vanilla CSS/Tailwind (Self-contained)
- **State**: React Context for chat session management

## Prompts & Retrieval
- **System Prompt**: Enforces boundaries, role-awareness, and persona.
- **RAG Implementation**: Knowledge base stored in `/resources/knowledge`. Simple context injection for Phase 1.

## Security Rules
1. **JWT Propagation**: The frontend passes the user's token, which the AI backend passes to the main backend to ensure data isolation.
2. **Access Control**: Assistant only returns "Live Data" for the user associated with the token.
3. **Guardrails**: Responses are filtered for out-of-scope content.

## Future Integration
- **Backend Proxy**: Main backend could proxy `/api/ai` requests.
- **Frontend Widget**: The isolated UI can be exported as a web component or a simple React import.
