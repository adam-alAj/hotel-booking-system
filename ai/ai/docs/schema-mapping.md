# AI to EliteReserve Schema Mapping

The AI Assistant maps its internal models to the existing EliteReserve schema as follows:

## 1. User Context
| AI Field | EliteReserve Entity | EliteReserve Field |
|----------|---------------------|--------------------|
| `userId` | `users` | `id` |
| `userRole` | `users` | `role` |

## 2. Hotel Information
| AI Field | EliteReserve Entity | EliteReserve Field |
|----------|---------------------|--------------------|
| `hotelName` | `hotels` | `name` |
| `hotelLocation` | `hotels` | `location` / `area` |
| `basePrice` | `hotel_base_prices` | `price` |

## 3. Booking Details
| AI Field | EliteReserve Entity | EliteReserve Field |
|----------|---------------------|--------------------|
| `bookingId` | `bookings` | `id` |
| `status` | `bookings` | `status` |
| `checkIn` | `bookings` | `check_in_date` |
| `checkOut` | `bookings` | `check_out_date` |

## 4. AI Specific Tables (Isolated)
### `ai_chat_sessions`
- `id` (UUID)
- `user_id` (FK to `users.id`)
- `created_at` (Timestamp)

### `ai_chat_messages`
- `id` (UUID)
- `session_id` (FK to `ai_chat_sessions.id`)
- `sender` (Enum: USER, AI)
- `content` (Text)
- `timestamp` (Timestamp)
