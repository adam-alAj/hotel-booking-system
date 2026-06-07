# EliteReserve AI Backend Subsystem

This is a self-contained AI microservice designed to handle intelligent assistant queries for the EliteReserve platform.

## Architecture
- **Isolated Service**: Connects to the main backend via REST adapters.
- **Strict Guardrails**: Prevents hallucinations and arbitrary SQL access.
- **RAG Powered**: Uses a local knowledge base in `src/main/resources/knowledge`.

## Setup
1. Configure your `.env` file with the Gemini API Key.
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the service:
   ```bash
   mvn spring-boot:run
   ```

## Documentation
- [Architecture](docs/architecture.md)
- [API Contract](docs/api-contract.md)
- [Repository Analysis](docs/repo-analysis.md)
- [Integration Guide](docs/integration-guide.md)
