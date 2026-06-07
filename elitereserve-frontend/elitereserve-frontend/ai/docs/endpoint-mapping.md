# Endpoint Mapping - EliteReserve AI Integration

| AI Subsystem Intent | Internal Backend API Target | Purpose |
|---------------------|-----------------------------|---------|
| "List hotels"       | `GET /api/v1/hotels/search` | Dynamic city/name based discovery. |
| "Booking status"    | `GET /api/v1/bookings/my-history` | User-specific live status check. |
| "Platform Help"     | AI Internal Knowledge Base  | Explain search, payment, etc. |

## Parameter Extraction
The AI identifies parameters like `city` and `hotelName` from natural language and maps them to the query parameters of the main backend.
