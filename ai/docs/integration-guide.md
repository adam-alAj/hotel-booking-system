# Integration Guide - EliteReserve AI Subsystem

## Summary
The AI subsystem is designed as an isolated satellite service. Integrating it into the main platform involves connecting the frontend chat widget and optionally proxying the backend requests.

## Backend Integration (Optional)
To avoid CORS issues and keep a unified API prefix, you can add a proxy or a redirect in the main backend (`EliteResrve`).
- **Target**: Redirect `/api/ai/**` to `http://localhost:8082/api/ai/**`.

## Frontend Integration
1. **Chat Widget Integration**:
   - The isolated `ai_frontend` module should be built and exported.
   - Import the `AiChatWidget` into the main `Navbar.jsx` or a main Layout component.
   - Ensure the `AuthToken` from the main app is passed to the AI Widget.

2. **Mount Point**:
   - Typically added to the bottom-right corner of the viewport.

## Future Steps
- **Webhooks**: Set up webhooks for booking notifications to trigger AI prompts.
- **Unified Auth**: Configure both services to share a SSO or common JWT validation secret.
