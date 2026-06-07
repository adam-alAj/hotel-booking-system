package com.hackops.elitereserve.ai.adapter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class EliteReserveAdapter {

    // Sentinel constants — used by AiOrchestrationService to detect failures cleanly
    // without leaking technical error strings into the AI prompt
    public static final String RESULT_SERVICE_ERROR = "__SERVICE_UNAVAILABLE__";
    public static final String RESULT_NO_DATA       = "__NO_DATA_FOUND__";
    public static final String RESULT_AUTH_REQUIRED = "__AUTH_REQUIRED__";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "http://localhost:8081/api/v1";

    /**
     * Searches for hotels using structured parameters.
     * This avoids hardcoding specific cities and works globally.
     */
    public String searchHotels(String hotelName, String cityName, String authHeader) {
        try {
            log.info("Searching hotels - Name: {}, City: {}", hotelName, cityName);
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/hotels/search")
                    .queryParam("size", 10);
            
            if (cityName != null && !cityName.isEmpty() && !cityName.equalsIgnoreCase("null")) {
                builder.queryParam("city", cityName);
            }
            
            if (hotelName != null && !hotelName.isEmpty() && !hotelName.equalsIgnoreCase("null")) {
                builder.queryParam("name", hotelName);
            }

            HttpHeaders headers = new HttpHeaders();
            if (authHeader != null) {
                headers.set("Authorization", authHeader);
            }
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.build().toUriString(),
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
                if (content == null || content.isEmpty()) {
                    return RESULT_NO_DATA;
                }
                
                StringBuilder sb = new StringBuilder("REAL DATA from EliteReserve Database:\n");
                for (Map<String, Object> hotel : content) {
                    sb.append("Hotel [ID: ").append(hotel.get("id")).append("]: ")
                      .append(hotel.get("name"))
                      .append(" in ").append(hotel.get("city"))
                      .append(" (").append(hotel.get("address")).append(")")
                      .append(". Rating: ").append(hotel.get("averageRating"))
                      .append(". Description: ").append(hotel.get("description"))
                      .append("\n");
                }
                return sb.toString();
            }
            return RESULT_NO_DATA;
        } catch (Exception e) {
            log.error("Error searching hotels: {}", e.getMessage());
            return RESULT_SERVICE_ERROR;
        }
    }

    public String getBookingStatus(String authHeader) {
        try {
            if (authHeader == null || authHeader.isEmpty()) {
                return RESULT_AUTH_REQUIRED;
            }

            log.info("Retrieving booking history for authenticated user");
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<List> response = restTemplate.exchange(
                    BASE_URL + "/bookings/my-history",
                    HttpMethod.GET,
                    entity,
                    List.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> bookings = (List<Map<String, Object>>) response.getBody();
                if (bookings.isEmpty()) {
                    return RESULT_NO_DATA;
                }
                
                StringBuilder sb = new StringBuilder("REAL BOOKING DATA for user:\n");
                for (Map<String, Object> booking : bookings) {
                    sb.append("- Booking #").append(booking.get("id"))
                      .append(": ").append(booking.get("hotelName"))
                      .append(" (").append(booking.get("roomTypeName")).append(")")
                      .append(". Status: ").append(booking.get("status"))
                      .append(". Dates: ").append(booking.get("checkInDate")).append(" to ").append(booking.get("checkOutDate"))
                      .append(". Price: ").append(booking.get("quotedPrice"))
                      .append("\n");
                }
                return sb.toString();
            }
            return RESULT_NO_DATA;
        } catch (Exception e) {
            log.error("Error retrieving bookings: {}", e.getMessage());
            return RESULT_SERVICE_ERROR;
        }
    }

    public String getHotelDetails(String hotelId) {
        try {
            log.info("Fetching details for hotel ID: {}", hotelId);
            return restTemplate.getForObject(BASE_URL + "/hotels/" + hotelId, String.class);
        } catch (Exception e) {
            log.error("Failed to fetch hotel details", e);
            return RESULT_SERVICE_ERROR;
        }
    }
}