# Optional Backend Patches

> [!IMPORTANT]
> These patches are NOT implemented. They are provided as guidance for future integration.

## 1. Unified API Proxy
In a new `@Configuration` file in the main `EliteResrve` project:

```java
@Configuration
public class AiProxyConfig {
    @Bean
    public RouteLocator aiRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("ai_service", r -> r.path("/api/ai/**")
                .uri("http://localhost:8082"))
            .build();
    }
}
```

## 2. JWT Secret Sharing
Ensure both `EliteResrve` and `ai` use the same key in `application.properties`:
```properties
jwt.secret=your-shared-secret-key-here
```
