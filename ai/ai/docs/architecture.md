# EliteReserve AI Assistant Architecture

## Subsystem Purpose
To provide a bounded, role-aware AI assistant that helps users (Guests, Hotel Managers, Admins) navigate the EliteReserve platform, understand features, and query their own data safely.

## Scope Boundaries
- **In-Scope:** Platform explanations, search guidance, booking status lookup, payment policy info.
- **Out-of-Scope:** General-purpose chat, external web search (unless specifically for hotel context), arbitrary SQL execution, modifying operational data (except through controlled adapters).

## Folder Structure
- `/ai`: Spring Boot AI module.
- `/ai_frontend`: React-based chat UI.

## Backend Architecture (Spring Boot)
- **Orchestration Service:** Routes user messages to the appropriate logic (Retrieval, Tool Calling, or Guardrail refusal).
- **Retrieval Layer (RAG):** Uses a knowledge base of platform documentation (Markdown files in `/ai/src/main/resources/knowledge`).
- **Tool/Adapter Layer:** Safe interfaces to existing EliteReserve services.
  - `HotelSearchAdapter`: Proxies `/api/v1/hotels/search`.
  - `BookingStatusAdapter`: Proxies `/api/v1/bookings/{id}`.
- **Persistence:** Isolated AI tables for chat history and feedback.
- **Security:** Validates JWT from the main app to ensure role-based access.

## Frontend Architecture (React)
- **Isolated Module:** A standalone React app that can be embedded as an iframe or a component.
- **State Management:** Simple React Context for chat sessions.
- **UI Components:** Built with Tailwind CSS and Shadcn UI (for a professional "Technical Dashboard" feel).

## AI Strategy
- **Model:** `gemini-3-flash-preview` (via Gemini API).
- **Prompt Strategy:** System instructions define the "EliteReserve Assistant" persona, boundaries, and role-specific behavior.
- **Guardrails:** Pre-processing and post-processing to ensure no data leaks or out-of-scope answers.

## Data Isolation
- AI-specific tables will have an `ai_` prefix (e.g., `ai_chat_sessions`).
- No direct writes to `hotels`, `bookings`, or `payments` tables from the AI module.

## Security Rules
- AI must never expose PII of other users.
- Tool calls must be scoped to the authenticated user's ID.
- "I don't know" is the preferred answer over hallucination.
