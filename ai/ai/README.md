# EliteReserve AI Backend

This is the isolated AI assistant subsystem for the EliteReserve platform.

## Features
- RAG (Retrieval Augmented Generation) for platform documentation.
- Safe adapters for live hotel and booking data.
- Role-aware chat orchestration.
- Isolated persistence for chat history.

## Setup
1. Configure environment variables in `.env`.
2. Build with Maven: `mvn clean install`.
3. Run: `mvn spring-boot:run`.

## API Endpoints
- `POST /api/ai/chat`: Main chat endpoint.
- `GET /api/ai/health`: Health check.
