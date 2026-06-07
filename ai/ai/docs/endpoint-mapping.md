# AI to EliteReserve Endpoint Mapping

The AI Assistant uses the following mappings to interact with the main system:

| AI Adapter Method | Target EliteReserve Endpoint | Purpose |
|-------------------|-----------------------------|---------|
| `searchHotels` | `POST /api/v1/hotels/search` | Retrieve live hotel availability and details. |
| `getBookingStatus` | `GET /api/v1/bookings/my-history` | Retrieve the current user's booking status. |
| `getPaymentInfo` | `GET /api/v1/payments/{id}` | Check payment confirmation details. |
| `getHotelRules` | `GET /api/v1/hotel-pricing/hotels/{id}/rules` | Explain pricing logic to the user. |

## Authentication Flow
1. Frontend sends JWT in `Authorization: Bearer <token>` header to AI Backend.
2. AI Backend validates JWT using shared secret.
3. AI Backend extracts `userId` and `role` from JWT.
4. AI Backend passes the same JWT to EliteReserve endpoints to maintain user context.
