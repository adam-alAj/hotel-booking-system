# Repository Analysis - EliteReserve AI Subsystem

## Confirmed Facts
- **Architecture**: Microservice-ready architecture. The main backend is a Spring Boot application (`EliteResrve`) running on port 8081.
- **Frontend**: React application (`elitereserve-frontend`) running on port 3000/3001.
- **Database**: MySQL database (`bookingsystem1`) used for hotels, rooms, and bookings.
- **Entities**:
  - `Hotel`: Name, address, city, description, average rating.
  - `Booking`: Status (CONFIRMED, CANCELLED, etc.), dates, hotel reference, price.
  - `User`: Roles include GUEST, HOTEL_MANAGER, and ADMIN.
- **REST APIs (Main Backend)**:
  - `GET /api/v1/hotels/search`: Supports `city` and `name` query parameters.
  - `GET /api/v1/bookings/my-history`: Returns booking history for the logged-in user.
- **Authentication**: JWT-based authentication. Frontend passes `Authorization: Bearer <token>` in headers.

## Inferred Patterns
- **User Session Handling**: Likely stored in the main backend's `User` table; roles are likely handled via Spring Security `GrantedAuthority`.
- **Naming Conventions**: DTOs follow `<Name>Request` and `<Name>Response` naming.
- **Payment Handling**: There is a `PaymentController` and `Payment` entity, implying electronic payment integration.

## Unknowns (Must Not Guess)
- **Specific Knowledge Base Content**: The exact text for platform features (cancellation policies, specific manual steps for booking) is not yet compiled into a centralized document.
- **Third-party Payment Gateway**: The specific provider (Stripe, PayPal, etc.) is not clear from the high-level API names.
- **Manager/Admin AI Scopes**: The full range of tasks a Manager or Admin would want AI help with (e.g., "Predict revenue") is not defined yet.

## Isolation Status
- No existing files in `EliteResrve` or `elitereserve-frontend` have been modified for this AI subsystem.
- All new AI components are residing in `/ai` and will reside in `/ai_frontend`.
