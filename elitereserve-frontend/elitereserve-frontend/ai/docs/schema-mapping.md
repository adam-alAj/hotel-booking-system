# Schema Mapping - EliteReserve AI Subsystem

## AI Internal Persistence (Proposed)
The AI subsystem uses its own schema to avoid affecting production tables.

### Table: `ai_chat_session`
- `id`: UUID (Primary Key)
- `user_id`: Long (Reference to main `User.id`)
- `started_at`: Timestamp

### Table: `ai_chat_message`
- `id`: Long
- `session_id`: UUID
- `role`: String (USER, ASSISTANT)
- `content`: Text

## Main Backend Entity Consumption (Read-Only)
The AI system consumes the following schemas from the main backend responses:

### Hotel Schema:
- `name` (String)
- `city` (String)
- `averageRating` (Double)

### Booking Schema:
- `id` (Long)
- `hotelName` (String)
- `status` (String)
- `checkInDate` (Date)
- `checkOutDate` (Date)
