# Optional Backend Patches

These are suggested changes to the existing EliteReserve backend to improve AI integration. **Do not apply these now.**

## 1. Add AI-Specific Scopes to JWT
In `com.hackops.hotel_booking_system.security.JwtService`:
```java
// Add a claim to indicate if the user is allowed to use the AI assistant
claims.put("ai_enabled", true);
```

## 2. Expose Internal Search for AI
In `com.hackops.hotel_booking_system.catalog.HotelService`:
```java
// Create a method that returns structured data specifically for the AI
public List<HotelAiDto> searchForAi(String query) {
    // ... logic to return more metadata than the standard search
}
```

## 3. Webhook for Booking Updates
In `com.hackops.hotel_booking_system.booking.BookingService`:
```java
// Notify the AI service when a booking status changes
public void updateStatus(Long id, BookingStatus status) {
    // ... existing logic
    aiWebhookService.notifyStatusChange(id, status);
}
```
