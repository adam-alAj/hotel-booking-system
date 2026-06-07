# EliteReserve AI Integration Guide

## Backend Integration
The AI Assistant is a standalone Spring Boot service. To integrate it with the main EliteReserve backend:

1. **API Gateway / Proxy:**
   Configure your API Gateway (e.g., Spring Cloud Gateway or Nginx) to route `/api/ai/**` requests to the AI service running on port 8082.

2. **Authentication Sharing:**
   Ensure the AI service uses the same `JWT_SECRET` as the main backend. This allows the AI service to validate tokens issued by the main `auth-service`.

3. **Service Discovery:**
   If using Eureka or Consul, register the `ai-assistant` service so other services can find it.

## Frontend Integration
The AI Frontend is an isolated React module. To integrate it with the main EliteReserve frontend:

1. **Mounting the Widget:**
   Import the `AiChatWidget` component into your main `App.tsx` or a layout component:
   ```tsx
   import { AiChatWidget } from './ai_frontend/src/components/AiChatWidget';
   
   function App() {
     return (
       <div>
         <MainContent />
         <AiChatWidget />
       </div>
     );
   }
   ```

2. **Environment Variables:**
   Set `VITE_AI_BACKEND_URL` in your main `.env` file to point to the AI backend API.

3. **Styling:**
   The widget uses Tailwind CSS. Ensure your main project also has Tailwind configured, or wrap the widget in a shadow DOM to prevent style leakage.
