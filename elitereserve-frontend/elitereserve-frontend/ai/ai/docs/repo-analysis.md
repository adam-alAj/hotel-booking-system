# EliteReserve Repository Analysis

## Confirmed Facts
- **Project Name:** EliteReserve
- **Backend Stack:** Spring Boot 3.2.4, Java 21, Maven.
- **Database:** MySQL (Database name: `bookingsystem`).
- **Frontend Stack:** React (Vite-based).
- **Authentication:** JWT (Bearer Token) with Access and Refresh tokens.
- **Roles:**
  - `CUSTOMER`: Can search, book, pay, cancel, extend, rate.
  - `HOTEL_MANAGER`: Can manage hotel data, rooms, room types, pricing rules.
  - `ADMIN`: Platform oversight, session management, user management.
- **Key Entities:** `hotels`, `rooms`, `room_types`, `bookings`, `booking_extensions`, `hotel_pricing_rules`, `hotel_base_prices`, `payments`, `ratings`, `notifications`, `users`, `feedbacks`.
- **API Base Path:** `/api/v1` (mostly), `/api/auth` for authentication.

## Inferred Patterns
- **Package Structure:** Standard Spring Boot layered architecture (`controller`, `service`, `repository`, `dto`, `mapper`, `entity`).
- **DTO Usage:** Data is transferred via DTOs; mappers (MapStruct) are used for conversion.
- **Security:** Spring Security is used to protect endpoints based on roles.
- **Database Access:** Spring Data JPA with Hibernate.
- **Communication:** RESTful APIs.

## Unknown Items (Must Not Guess)
- **Specific Field Names:** While entities are known, exact column names (e.g., `hotel_id` vs `hotelId`) are not fully confirmed for all tables.
- **Existing Service Interface Names:** Exact method signatures in existing services are unknown.
- **Frontend Routing:** Exact React Router paths in the main app are unknown.
- **Deployment Environment:** Specific cloud provider or container orchestration (though the current environment is Cloud Run).

## AI Subsystem Integration Strategy
- The AI subsystem will be isolated in `/ai` (backend) and `/ai_frontend` (frontend).
- It will interact with the main system via safe adapters that call existing REST APIs or read-only JPA repositories.
- No existing files will be modified.
