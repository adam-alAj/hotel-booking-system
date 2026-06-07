# EliteReserve Frontend — Project Discussion Guide

## 📁 Project Structure Overview

```
src/
├── App.js                          # Root component — routing, layouts, guards
├── App.css                         # Global app styles
├── index.js                        # React entry point
├── index.css                       # Global CSS reset
├── setupTests.js                   # Test configuration
├── reportWebVitals.js              # Performance metrics
├── App.test.js                     # Basic app test
│
├── context/
│   └── AuthContext.js              # Authentication state management
│
├── services/
│   ├── api.js                      # Base Axios instance + auth API
│   ├── customerApi.js              # Customer-facing API endpoints
│   └── apiManager.js               # Manager-facing API endpoints
│
├── utils/
│   └── imageUrl.js                 # Image URL resolver utility
│
├── pages/
│   ├── Home.jsx                    # Landing page with hotel listings
│   ├── HotelDetail.jsx             # Single hotel view + room types
│   ├── MyBookings.jsx              # Customer booking history
│   ├── SearchResults.jsx           # Hotel search results
│   ├── Login.js                    # Login page
│   ├── Signup.js                   # Registration page
│   ├── AIAssistant.jsx             # AI chat page wrapper
│   └── css/                        # Page-specific stylesheets
│
├── components/
│   ├── customer/
│   │   ├── Navbar.jsx              # Customer navigation + search modal
│   │   ├── HotelCard.jsx           # Hotel listing card
│   │   ├── BookingModal.jsx        # Booking creation modal
│   │   ├── PaymentModal.jsx        # Payment processing modal
│   │   ├── ExtensionModal.jsx      # Booking extension modal
│   │   ├── FeedbackSection.jsx     # Customer reviews section
│   │   ├── AdvertiseSection.jsx    # Marketing/hero section
│   │   ├── Footer.jsx              # Customer footer
│   │   └── css/                    # Component stylesheets
│   │
│   ├── ai/
│   │   ├── AiChatWidget.jsx        # AI chat floating widget
│   │   └── aiService.js            # AI backend communication
│   │
│   └── manager_2/
│       ├── ManagerHotels.js         # Hotel CRUD for managers
│       ├── ManagerDashboard.jsx     # Hotel management dashboard
│       ├── ManagerRoomsTab.js       # Room management tab
│       ├── ManagerRoomTypesTab.js   # Room type management tab
│       ├── ManagerBookingsTab.js    # Booking overview tab
│       ├── ManagerBasePricesTab.js  # Base pricing tab
│       ├── ManagerPricingRulesTab.js# Dynamic pricing rules tab
│       ├── ManagerNavbar.js         # Manager navigation bar
│       └── ManagerFooter.js         # Manager footer
```

---

## 📁 Root Files (src/)

### 📄 App.js
**Purpose:**
The root component that defines the entire application routing structure, layout composition, and role-based access control. It is the single entry point that orchestrates which pages and layouts render based on authentication state and user roles.

**Internal Details:**
- Uses `react-router-dom` v6 with `BrowserRouter`, `Routes`, `Route`, `Navigate`, and `Outlet`
- Defines three layout wrappers:
  - `CustomerLayout` — wraps customer pages with `CustomerNavbar` + `CustomerFooter`
  - `ManagerLayout` — wraps manager pages with `ManagerNavbar` + `ManagerFooter`
- Implements three route guards:
  - `CustomerGuard` — requires authentication + non-manager role; redirects managers to `/manager-hotels`
  - `ManagerGuard` — requires authentication + HOTEL_MANAGER or ADMIN role
  - `PublicRoute` — redirects already-authenticated users to their appropriate dashboard
- Helper function `checkIsManager(user)` inspects `user.roles` array for `'HOTEL_MANAGER'` or `'ADMIN'`
- All guards show a loading spinner while `AuthContext` resolves the user session
- Route structure:
  - Public: `/login`, `/signup`
  - Customer: `/`, `/hotel/:id`, `/bookings`, `/search`, `/ai`
  - Manager: `/manager-hotels`, `/manager-dashboard/:hotelId`
  - Catch-all: redirects to `/login`

**System Role:**
This is the architectural backbone. Every page in the app is rendered through this file's routing tree. The guard pattern ensures security at the frontend level (complementing backend JWT validation).

**Discussion Q&A:**
- ❓ Q: Why use route guards instead of checking roles inside each page component?
  ✅ A: Centralizing access control in guards follows the Single Responsibility Principle. Pages focus on their UI logic, while guards handle authorization. This prevents code duplication and ensures no page accidentally renders without proper auth checks.

- ❓ Q: What happens if a manager tries to access a customer route like `/bookings`?
  ✅ A: The `CustomerGuard` checks `checkIsManager(user)` — if true, it returns `<Navigate to="/manager-hotels" replace />`, redirecting the manager to their portal. The reverse applies for customers trying to access manager routes.

- ❓ Q: Why wrap the entire app in `<AuthProvider>`?
  ✅ A: The `AuthProvider` uses React Context to make authentication state (`user`, `isAuthenticated`, `loading`) available to every component in the tree without prop drilling. Guards, navbars, and pages all consume this context.

---

### 📄 index.js
**Purpose:**
The JavaScript entry point that mounts the React application into the DOM.

**Internal Details:**
- Uses `ReactDOM.createRoot()` (React 18 concurrent mode API)
- Wraps `<App />` in `<React.StrictMode>` for development warnings
- Targets `document.getElementById('root')` in `public/index.html`

**System Role:**
Standard React bootstrapping file. No custom logic — its role is purely to initialize the React tree.

**Discussion Q&A:**
- ❓ Q: What does `React.StrictMode` do?
  ✅ A: It activates additional development-only checks: detecting unsafe lifecycle methods, warning about legacy APIs, and double-invoking certain functions to detect side effects. It has zero impact in production builds.

---

### 📄 utils/imageUrl.js
**Purpose:**
A utility function that resolves image URLs by prepending the backend base URL to relative paths stored in the database.

**Internal Details:**
- Exports `getImageUrl(url)` function
- Logic: if `url` is falsy → returns empty string; if starts with `'http'` → returns as-is (already absolute); otherwise → prepends `http://localhost:8080`
- Solves the mismatch where the database stores relative paths like `/images/hotels/h1.avif` but the frontend dev server runs on a different port

**System Role:**
Used by `HotelCard`, `HotelDetail`, `ManagerHotels`, and `ManagerRoomTypesTab` to correctly resolve image sources. Without this utility, all hotel images would 404 because the browser would request them from the React dev server instead of the Spring Boot backend.

**Discussion Q&A:**
- ❓ Q: Why not use a proxy configuration in the React dev server instead?
  ✅ A: A proxy (e.g., in `package.json`) would work for API calls but can be unreliable for static assets. The explicit URL resolution is more transparent, works in all environments, and makes the dependency on the backend URL visible in code.

- ❓ Q: What would you change for production deployment?
  ✅ A: Replace the hardcoded `http://localhost:8080` with an environment variable (`process.env.REACT_APP_API_URL`) so the same build works across dev, staging, and production environments.



---

## 📁 context/

> Provides global application state using React Context API — specifically authentication state that needs to be accessible from any component in the tree.

### 📄 AuthContext.js
**Purpose:**
Manages the entire authentication lifecycle: login, registration, logout, session persistence, and token refresh event handling. Exposes auth state and actions to the entire component tree via React Context.

**Internal Details:**
- Creates `AuthContext` with `createContext(null)`
- `AuthProvider` component manages state:
  - `user` — current user object (email, firstName, roles, etc.)
  - `loading` — true while checking stored token on mount
  - `isAuthenticated` — boolean derived from successful token validation
- On mount (`useEffect`), calls `checkAuth()`:
  - Reads `accessToken` from `localStorage`
  - If token exists, calls `authAPI.getCurrentUser()` to validate and fetch user data
  - If token is invalid/expired, clears storage and sets unauthenticated state
- Listens for custom `'auth:logout'` DOM event (dispatched by API interceptors on refresh failure)
- Exposes functions:
  - `login(email, password)` — calls API, stores tokens, fetches user
  - `register(userData)` — calls API, stores tokens, fetches user
  - `logout()` — calls API logout endpoint, clears localStorage, resets state
- Custom hook `useAuth()` provides type-safe context consumption with error if used outside provider

**System Role:**
Every protected route guard (`CustomerGuard`, `ManagerGuard`, `PublicRoute`) consumes this context. The Navbar uses it for user display and logout. Login/Signup pages call `login()`/`register()`. This is the single source of truth for "who is the current user?"

**Discussion Q&A:**
- ❓ Q: Why store tokens in localStorage instead of httpOnly cookies?
  ✅ A: localStorage allows the SPA to attach the JWT in the `Authorization` header for API calls. httpOnly cookies would require the backend to handle CSRF tokens and cookie-based auth. For a university project with a separate frontend/backend, localStorage + Bearer tokens is the standard SPA pattern. In production, httpOnly cookies with CSRF protection would be more secure against XSS.

- ❓ Q: What happens when the access token expires mid-session?
  ✅ A: The API interceptor (in `api.js`) catches 401 responses, uses the stored refresh token to obtain a new access token, retries the failed request, and updates localStorage. If the refresh also fails, it dispatches the `'auth:logout'` event which `AuthContext` listens for, clearing the session.

- ❓ Q: Why use a custom event (`auth:logout`) instead of calling logout directly?
  ✅ A: The API interceptor lives outside the React component tree (it's a plain JavaScript module). It cannot call React hooks or context methods directly. The custom DOM event bridges this gap — the interceptor dispatches it, and the AuthProvider's useEffect listener handles the state cleanup.

---

## 📁 services/

> Contains all HTTP communication logic. Each file creates an Axios instance with interceptors for JWT attachment and automatic token refresh. Endpoints are organized by user role.

### 📄 api.js
**Purpose:**
The base API service used for authentication-related endpoints. Creates the foundational Axios instance with request/response interceptors that handle JWT token management.

**Internal Details:**
- Base URL: `http://localhost:8080`
- Request interceptor: attaches `Bearer {token}` from localStorage to every request
- Response interceptor implements token refresh logic:
  - On 401 response, checks if already refreshing (prevents race conditions)
  - If not refreshing: calls `/api/auth/refresh` with the refresh token
  - On success: updates both tokens in localStorage, retries original request
  - On failure: clears tokens, dispatches `'auth:logout'` event
  - If already refreshing: queues the failed request via subscriber pattern
- Exports `authAPI` object with methods:
  - `login(email, password)` → POST `/api/auth/login`
  - `register(userData)` → POST `/api/auth/register`
  - `logout()` → POST `/api/auth/logout` with refresh token
  - `getCurrentUser()` → GET `/api/users/me`
  - `refreshToken(refreshToken)` → POST `/api/auth/refresh`

**System Role:**
Used exclusively by `AuthContext.js` for authentication operations. The interceptor pattern is duplicated in `customerApi.js` and `apiManager.js` to keep each service independent.

**Discussion Q&A:**
- ❓ Q: Why have three separate Axios instances instead of one shared instance?
  ✅ A: Separation of concerns — each instance can have different base configurations if needed (e.g., different timeouts, headers for multipart uploads). It also makes the codebase more modular: customer APIs, manager APIs, and auth APIs are independently maintainable.

- ❓ Q: Explain the subscriber pattern in the refresh interceptor.
  ✅ A: When multiple API calls fail simultaneously with 401, only the first triggers a refresh. Subsequent calls are queued in `refreshSubscribers[]`. Once the refresh completes, `onTokenRefreshed()` iterates the queue, providing the new token so each queued request can retry. This prevents multiple simultaneous refresh calls.

---

### 📄 customerApi.js
**Purpose:**
Provides all API endpoints accessible to customer-role users: hotels, room types, bookings, payments, and feedback.

**Internal Details:**
- Creates its own Axios instance with identical interceptor pattern as `api.js`
- Exports endpoint groups:
  - `hotelAPI`: `getAllHotels(page, size)`, `getHotelById(id)`, `searchHotels(searchRequest)`
  - `roomTypeAPI`: `getRoomTypesByHotel(hotelId)`, `getRoomTypeById(id)`
  - `bookingAPI`: `createBooking(data)`, `cancelBooking(id)`, `getMyHistory()`, `calculatePrice(...)`, `requestExtension(bookingId, data)`, `confirmExtensionPayment(extId)`
  - `paymentAPI`: `createPayment(paymentData)`
  - `feedbackAPI`: `createFeedback(data)`, `getAllFeedbacks(page, size)`

**System Role:**
Consumed by all customer-facing pages and components: `Home`, `HotelDetail`, `MyBookings`, `SearchResults`, `BookingModal`, `PaymentModal`, `ExtensionModal`, `FeedbackSection`.

**Discussion Q&A:**
- ❓ Q: Why does `searchHotels` use POST instead of GET?
  ✅ A: The search request contains a complex object with multiple optional filters (name, city, minRating, maxRating, pagination, sorting). Using POST with a JSON body is cleaner than encoding all these as query parameters, especially when values can be null. The backend expects a `@RequestBody` DTO.

- ❓ Q: How does the booking flow work end-to-end?
  ✅ A: 1) User selects dates in `BookingModal` → 2) `createBooking()` sends hotel/room/dates to backend → 3) Backend calculates price with dynamic pricing rules and returns booking with `quotedPrice` → 4) User proceeds to `PaymentModal` → 5) `createPayment()` confirms the booking. The price is calculated server-side to prevent manipulation.

---

### 📄 apiManager.js
**Purpose:**
Provides all API endpoints for hotel manager operations: hotel CRUD, room management, room types, bookings overview, base prices, and pricing rules.

**Internal Details:**
- Own Axios instance with same JWT interceptor pattern
- `managerAPI` exports:
  - Hotels: `getMyHotels()`, `createHotel(formData)`, `updateHotel(id, formData)`, `deleteHotel(id)`
  - Bookings: `getMyHotelBookings(hotelId)`
  - Rooms: `getHotelRooms(hotelId)`, `createRoom(data)`, `patchRoom(id, data)`, `deleteRoom(id)`
  - Room Types: `getHotelRoomTypes(hotelId)`, `createRoomType(formData)`, `patchRoomType(id, data)`, `deleteRoomType(id)`
  - Pricing Rules: `getHotelPricingRules(hotelId)`, `createPricingRule(hotelId, data)`, `patchPricingRule(id, data)`, `deletePricingRule(id)`, `assignRuleToRoomTypes(ruleId, roomTypeIds)`
  - Base Prices: `getHotelBasePrices(hotelId)`, `setBasePrice(hotelId, roomTypeId, data)`, `patchBasePrice(id, data)`, `deleteBasePrice(id)`
- `amenitiesAPI`: `getAllAmenities()` — fetches available amenity enum values
- `roomAPI`: additional room operations (delete, get by hotel, get by type, get status)
- Hotel create/update use `multipart/form-data` for image upload

**System Role:**
Consumed exclusively by manager components: `ManagerHotels`, `ManagerDashboard`, and all tab components (Rooms, RoomTypes, Bookings, BasePrices, PricingRules).

**Discussion Q&A:**
- ❓ Q: Why use `multipart/form-data` for hotel creation?
  ✅ A: Hotels include an image file upload alongside text fields (name, city, etc.). `multipart/form-data` is the standard encoding for forms that include binary file data. The Axios instance overrides the default `application/json` content-type header for these specific calls.

- ❓ Q: What's the difference between `patchRoom` and `updateHotel`?
  ✅ A: `patchRoom` uses HTTP PATCH (partial update — only send changed fields), while `updateHotel` uses HTTP PUT (full replacement). This follows REST conventions: PATCH for partial modifications, PUT for complete resource replacement.



---

## 📁 pages/

> Top-level page components that correspond to routes defined in App.js. Each page represents a full screen view and composes smaller components.

### 📄 Home.jsx
**Purpose:**
The main landing page that displays featured hotels in a paginated grid, a hero section with platform statistics, feature highlights, an advertising section, and customer feedback.

**Internal Details:**
- State: `hotels[]`, `loading`, `error`, `page`, `totalPages`, `searchParams`
- On mount and page change, calls `hotelAPI.getAllHotels(page, 8)` — fetches paginated hotel list
- Renders sections in order: Hero → AdvertiseSection → Hotels Grid → Pagination → FeedbackSection
- Hero section includes: badge ("Premium Collection"), title, subtitle, feature cards (Trust & Safety, Secure Payments, 24/7 Support, Verified Reviews, Best Price Guarantee), and statistics counters
- Pagination: Previous/Next buttons + numbered page buttons (shows up to 5 page numbers with smart windowing around current page)
- Loading state shows spinner; error state shows retry button
- Stores `searchParams` in localStorage for use by `HotelDetail` when creating bookings

**System Role:**
The first page customers see after login. It drives discovery — users browse hotels here before clicking into `HotelDetail`. The `HotelCard` component is reused here and in `SearchResults`.

**Discussion Q&A:**
- ❓ Q: Why store searchParams in localStorage?
  ✅ A: When a user navigates from Home to HotelDetail and opens the BookingModal, the modal pre-fills check-in/check-out dates from these stored params. localStorage persists across page navigations without needing to pass props through the route.

- ❓ Q: How does pagination work with the backend?
  ✅ A: The backend returns a Spring Data `Page` object with `content[]`, `totalPages`, `pageNumber`. The frontend tracks `page` state, passes it to the API call, and renders navigation controls. Each page change triggers a new API call — this is server-side pagination, not client-side.

---

### 📄 HotelDetail.jsx
**Purpose:**
Displays comprehensive information about a single hotel: hero image, rating, room types with amenities and pricing, and a booking flow.

**Internal Details:**
- Extracts `id` from URL params via `useParams()`
- State: `hotel`, `roomTypes[]`, `loading`, `error`, `selectedRoomType`, `showBookingModal`, `priceBreakdown`, `openFaq`, `expandedRoom`
- On mount, fetches hotel data and room types in parallel: `hotelAPI.getHotelById(id)` + `roomTypeAPI.getRoomTypesByHotel(id)`
- Uses `getImageUrl()` utility for both hotel hero image and room type images
- Each room type card shows: name, capacity, base price, amenities list, and a "Reserve" button
- Clicking "Reserve" opens `BookingModal` with the selected room type
- Reads `searchParams` from localStorage to pass check-in/check-out defaults to BookingModal

**System Role:**
The conversion page — this is where browsing turns into booking. It bridges the hotel listing (Home/Search) with the booking flow (BookingModal → PaymentModal).

**Discussion Q&A:**
- ❓ Q: Why fetch hotel and room types separately instead of one endpoint?
  ✅ A: The backend follows RESTful resource separation — hotels and room types are different entities with different endpoints. Fetching them in parallel (`Promise.all` pattern via sequential awaits) is still fast. This also allows room types to be reused independently (e.g., in manager views).

- ❓ Q: How is the price displayed before booking?
  ✅ A: The room type card shows the `basePrice` from the room type entity. The actual booking price (which includes dynamic pricing rules like early-bird discounts, seasonal adjustments) is calculated server-side only when the booking is created. The `BookingModal` shows the final `quotedPrice` returned by the backend.

---

### 📄 MyBookings.jsx
**Purpose:**
Displays the authenticated customer's booking history with status indicators, and provides actions: cancel, extend, and pay.

**Internal Details:**
- State: `bookings[]`, `loading`, `error`, `cancellingId`, `extendingBooking`, `showExtensionModal`, `payingBooking`, `showPaymentModal`
- Fetches bookings via `bookingAPI.getMyHistory()` on mount
- Each booking card shows: hotel name, room type, dates, nights count, status badge, and quoted price
- Status-based styling via `getStatusStyle(status)` — returns color scheme for CONFIRMED, PENDING, CANCELLED, COMPLETED, EXPIRED
- Actions per booking:
  - PENDING: "Pay Now" button → opens `PaymentModal`
  - CONFIRMED: "Cancel" button → calls `bookingAPI.cancelBooking(id)` with confirmation dialog
  - CONFIRMED: "Extend" button → opens `ExtensionModal`
- After any action (cancel/pay/extend), calls `fetchBookings()` to refresh the list

**System Role:**
The customer's booking management hub. It integrates with `PaymentModal` and `ExtensionModal` as child modals, and reflects real-time booking state changes.

**Discussion Q&A:**
- ❓ Q: Why refresh the entire booking list after each action instead of updating locally?
  ✅ A: The backend may change multiple fields on a booking (status, dates, price) during operations like payment or extension. Refetching ensures the UI is always consistent with the server state, avoiding stale data bugs. For a small list of personal bookings, the performance cost is negligible.

- ❓ Q: What's the booking lifecycle?
  ✅ A: PENDING (created, awaiting payment) → CONFIRMED (paid) → COMPLETED (after checkout date) or CANCELLED (user cancelled). Extensions create a sub-entity linked to the booking. EXPIRED occurs if payment isn't made within a time window.

---

### 📄 SearchResults.jsx
**Purpose:**
Displays hotel search results based on query parameters from the Navbar search modal, with active filter display and pagination.

**Internal Details:**
- Reads query params from URL: `name`, `city`, `minRating`, `maxRating`
- Calls `hotelAPI.searchHotels(searchRequest)` with a POST body containing filters + pagination + sorting
- Displays active filter tags with a "Clear All" button
- Shows `searchMetadata.totalResults` count from backend response
- Reuses `HotelCard` component for each result
- Empty state shows friendly message with "View All Hotels" reset button
- Re-searches when `location.search` changes (via `useEffect` dependency)

**System Role:**
The search results page that the Navbar's search modal navigates to. It reads URL query params, making search results shareable/bookmarkable.

**Discussion Q&A:**
- ❓ Q: Why use URL query params instead of component state for search filters?
  ✅ A: URL params make search results bookmarkable and shareable. Users can copy the URL, use browser back/forward, or refresh without losing their search. The Navbar constructs the URL with `URLSearchParams`, and this page reads them — clean separation of concerns.

---

### 📄 Login.js
**Purpose:**
Authentication page with email/password form, validation, and role-based redirect after successful login.

**Internal Details:**
- State: `formData` (email, password), `error`, `loading`, `rememberMe`
- Validates email format with regex and checks for empty fields
- Calls `login(email, password)` from `useAuth()` context
- After login, redirects based on role: managers → `/manager-hotels`, customers → `/`
- Uses `window.location.href` for redirect (full page reload to ensure clean state)
- Styled with `Login.css` — shared between Login and Signup pages

**System Role:**
The entry gate for all users. Works with `PublicRoute` guard which redirects already-authenticated users away from this page.

**Discussion Q&A:**
- ❓ Q: Why use `window.location.href` instead of `navigate()` for post-login redirect?
  ✅ A: A full page reload ensures the `AuthProvider` re-initializes with the new token, all components re-mount with fresh auth state, and any stale cached data is cleared. Using `navigate()` might leave some components in a pre-auth state.

---

### 📄 Signup.js
**Purpose:**
User registration page with form validation, password strength indicator, and role selection (Customer or Hotel Manager).

**Internal Details:**
- State: `formData` (email, password, confirmPassword, firstName, lastName, role), `error`, `loading`, `passwordStrength`
- Password strength calculator: checks length ≥8, lowercase, uppercase, digits — each adds 25%
- Visual strength bar with color coding: red (Weak) → amber (Fair) → green (Good) → blue (Strong)
- Validates: required fields, email format, password match, minimum length
- Role dropdown: `CUSTOMER` (default) or `HOTEL_MANAGER`
- Calls `register(userData)` from `useAuth()` context
- Shares `Login.css` stylesheet for consistent auth page styling

**System Role:**
Creates new user accounts. The role selection determines which route guard grants access after registration.

**Discussion Q&A:**
- ❓ Q: Is client-side password strength validation sufficient?
  ✅ A: No — it's a UX enhancement only. The backend should enforce its own password policy (and does, via Spring Security's `BCryptPasswordEncoder` with strength 12). Client-side validation provides immediate feedback but is never a security boundary.

---

### 📄 AIAssistant.jsx
**Purpose:**
A minimal wrapper page that renders the AI chat widget as a full-page experience.

**Internal Details:**
- Retrieves `accessToken` from localStorage
- Renders `<AiChatWidget token={token} />` component
- Only 7 lines of code — purely a routing target

**System Role:**
Provides a dedicated route (`/ai`) for the AI assistant, separate from the floating widget that appears on all pages. Allows users to have a focused chat experience.

**Discussion Q&A:**
- ❓ Q: Why have both a floating widget and a dedicated page?
  ✅ A: The floating widget (rendered in Navbar) provides quick access from any page. The dedicated page offers a distraction-free, full-screen chat experience for longer conversations. Both use the same `AiChatWidget` component.



---

## 📁 components/customer/

> Reusable UI components for the customer-facing side of the application. Includes navigation, hotel cards, modals for booking/payment/extension, and content sections.

### 📄 Navbar.jsx
**Purpose:**
The main customer navigation bar with logo, links, user avatar, and a premium search modal overlay for finding hotels by name, city, and rating.

**Internal Details:**
- State: `showSearch`, `searchFilters` (name, city, minRating, maxRating)
- Uses `useAuth()` for user info, authentication status, and logout
- Search trigger: pill-shaped button with glow effect and ⌘K keyboard hint
- Search modal: full-screen overlay with fade+slide animation
  - 4 fields: Hotel Name (text), City (text), Min Rating (select 1-9), Max Rating (select 5-10)
  - Clear button resets all filters; Search button navigates to `/search?params`
  - Closes on: Esc key, backdrop click, or ✕ button
  - Auto-focuses first input on open; locks body scroll
- User section: avatar with dynamic color (based on name hash), welcome text
- Conditional rendering: shows Login/Register for unauthenticated, shows user info + My Bookings + Logout for authenticated
- Renders `<AiChatWidget>` as a floating element

**System Role:**
Present on every customer page (via `CustomerLayout`). Provides primary navigation and the search entry point — the most-used interaction on the platform.

**Discussion Q&A:**
- ❓ Q: Why implement search as a modal instead of a separate page?
  ✅ A: A modal keeps the user in context — they don't lose their place on the current page. It's faster (no page load), feels more responsive, and follows the pattern of modern search UIs (Spotlight, Command+K). The actual results still navigate to a dedicated page.

- ❓ Q: How does the keyboard shortcut (Esc) work?
  ✅ A: A `useEffect` hook adds a `keydown` event listener to `document`. When `showSearch` is true and `Escape` is pressed, it calls `closeSearch()`. The listener is cleaned up on unmount to prevent memory leaks.

---

### 📄 HotelCard.jsx
**Purpose:**
A reusable card component that displays a hotel's image, name, location, type, rating (as stars), description, and a "Discover Experience" CTA.

**Internal Details:**
- Props: `hotel` object (id, name, city, imageUrl, averageRating, totalReviews, description, type, ratingBadge)
- Uses `getImageUrl()` to resolve hotel image path
- `renderStars(rating)`: converts 0-10 rating to 5-star display with half-star support using SVG gradients
- `getBadgeStyle(badge)`: maps rating badge text (Luxury, Boutique, Resort, etc.) to gradient colors
- Wishlist toggle button (local state only — visual feedback, logs to console)
- `getHotelType()`: derives hotel type label from rating if not provided
- `onError` handler on image: falls back to Unsplash placeholder
- Entire card is clickable → navigates to `/hotel/${hotel.id}`

**System Role:**
The primary hotel display unit, reused in `Home.jsx` (featured hotels grid) and `SearchResults.jsx` (search results grid). Consistent presentation across the app.

**Discussion Q&A:**
- ❓ Q: How does the half-star rating work?
  ✅ A: The rating (0-10) is divided by 2 to get a 0-5 scale. `Math.floor()` gives full stars, and checking `% 1 >= 0.5` determines if a half star is needed. Half stars use an SVG `linearGradient` with 50% gold / 50% transparent to visually split the star.

- ❓ Q: Why is the wishlist only local state?
  ✅ A: The wishlist feature is a UI placeholder — the backend doesn't have a wishlist endpoint yet. The local state provides visual feedback for the interaction, and `console.log` documents the intent for future implementation.

---

### 📄 BookingModal.jsx
**Purpose:**
A modal dialog for creating a new booking by selecting check-in and check-out dates, then proceeding to payment.

**Internal Details:**
- Props: `hotel`, `roomType`, `searchParams`, `onClose`, `onBookingSuccess`
- State: `bookingData` (checkInDate, checkOutDate), `loading`, `showPayment`, `createdBooking`, `error`, `bookingCreated`
- Date inputs: type="date" with `onKeyDown={e => e.preventDefault()}` to prevent manual typing (picker only), `onClick={e => e.target.showPicker()}` to open picker on any click
- Placeholder text shown via CSS `::before` pseudo-element when date is empty
- Calculates `nights` from date difference
- Two-phase flow:
  1. Date selection → "Create Booking" → calls `bookingAPI.createBooking()` → backend returns booking with `quotedPrice`
  2. Success view shows final price → "Continue to Payment" → renders `PaymentModal`
- Min date constraints: check-in ≥ today, check-out ≥ check-in + 1 day
- Right panel shows booking summary: room type, capacity, base rate, dates, nights

**System Role:**
The critical conversion component. Bridges hotel browsing (HotelDetail) with payment (PaymentModal). The two-phase design lets the backend calculate the real price with all pricing rules before the user commits to payment.

**Discussion Q&A:**
- ❓ Q: Why not let the user see the final price before creating the booking?
  ✅ A: The backend applies complex dynamic pricing rules (early-bird, seasonal, occupancy-based, length-of-stay discounts). Calculating this requires creating a booking entity server-side. The two-phase approach (create → show price → pay) ensures price accuracy while giving the user a chance to review before paying.

- ❓ Q: Why prevent keyboard input on date fields?
  ✅ A: Manual date typing leads to invalid formats, typos, and confusion with MM/DD/YYYY vs DD/MM/YYYY. Forcing picker-only input ensures valid dates, prevents format errors, and provides a better mobile experience.

---

### 📄 PaymentModal.jsx
**Purpose:**
Handles payment processing with support for three methods (Credit Card, PayPal, Bank Transfer), form validation, and success/error states.

**Internal Details:**
- Props: `booking`, `amount`, `onClose`, `onSuccess`
- State: `method` (CREDIT_CARD/PAYPAL/BANK_TRANSFER), `formData` (name, number, date, cvv, email), `loading`, `showSuccess`, `error`, `touched`
- Input validation with real-time filtering:
  - Card number: strips non-digits, auto-formats with spaces every 4 digits, max 16 digits
  - CVV: strips non-digits, max 3 characters
  - Expiry date: strips non-digits, auto-inserts `/`, caps month to 01-12, validates not expired
  - Cardholder name: strips non-letters/spaces
  - Email: regex validation for PayPal/Bank Transfer
- `validateCreditCard()`: checks name length ≥2, card 16 digits, date format + not expired, CVV 3 digits
- `isFormValid` computed via `useMemo` — enables/disables submit button
- Field-level error display on blur (`touched` state tracking)
- Payment flow: calls `paymentAPI.createPayment({bookingId, method})` → on success shows animated checkmark → redirects to `/bookings` after 2s
- Retry logic: on 500 error, refreshes booking data and retries once
- Left panel: payment method selector + order total
- Right panel: card preview (shows number/name/expiry in real-time) + form

**System Role:**
The final step in the booking conversion funnel. Validates payment details client-side for UX (the actual payment processing happens server-side). Integrates with `MyBookings` via the `onSuccess` callback to refresh booking status.

**Discussion Q&A:**
- ❓ Q: Is the credit card data sent to your backend?
  ✅ A: No — only the `bookingId` and `method` are sent to the backend. The card form is a UI simulation for the university project. In production, you'd integrate with a payment gateway (Stripe, PayPal SDK) that tokenizes card data client-side, never exposing raw card numbers to your server.

- ❓ Q: Why validate expiry date against the current date?
  ✅ A: An expired card will always be declined. Catching this client-side saves a round-trip to the server and provides immediate feedback. The comparison uses `new Date(2000 + yy, mm) > new Date()` — month is 1-indexed in the input but Date constructor treats it as 0-indexed, so month 12 becomes January of next year, which correctly represents "valid through end of December."

- ❓ Q: What's the retry logic for?
  ✅ A: If the backend returns a 500 error (possibly due to a race condition where the booking status changed between page load and payment attempt), the modal refreshes the booking data via `onSuccess()` and retries the payment once. This handles edge cases like stale booking state.

---

### 📄 ExtensionModal.jsx
**Purpose:**
Allows customers to extend their confirmed booking by selecting a new check-out date and paying the additional cost.

**Internal Details:**
- Props: `booking`, `onClose`, `onSuccess`
- State: `newCheckOutDate`, `loading`, `error`, `extension`, `showPayment`, `paymentMethod`
- Two-phase flow:
  1. Date selection: min date = current check-out date; validates new date > current check-out
  2. Calls `bookingAPI.requestExtension(bookingId, {newCheckOutDate})` → backend returns extension entity with additional cost
  3. Shows payment form for the extension amount
  4. Calls `paymentAPI.createPayment({bookingId, extensionId, method})` to confirm
- Payment method selector: Credit Card, PayPal, Bank Transfer

**System Role:**
Provides booking flexibility — a key feature for hotel platforms. Integrates with the booking and payment APIs to handle the extension lifecycle.

**Discussion Q&A:**
- ❓ Q: How is the extension price calculated?
  ✅ A: The backend calculates it based on the same dynamic pricing rules used for the original booking, applied to the additional nights. The frontend only displays the result — it never calculates prices locally.

---

### 📄 FeedbackSection.jsx
**Purpose:**
Displays customer reviews/feedback in a carousel-style layout with star ratings, avatars, and a "Write a Review" form.

**Internal Details:**
- Fetches feedback via `feedbackAPI.getAllFeedbacks(page, size)` on mount
- `FeedbackCard` sub-component renders each review:
  - Avatar with gradient background (deterministic based on name hash)
  - Star rating (0-10 scale converted to 5 stars with half-star support)
  - Review text, customer name, date
- Pagination for reviews
- Review submission form: rating selector + text area + submit button
- Calls `feedbackAPI.createFeedback(data)` to submit new reviews

**System Role:**
Social proof section on the Home page. Builds trust by showing real customer experiences. The write-review feature encourages engagement.

**Discussion Q&A:**
- ❓ Q: How are avatar colors generated deterministically?
  ✅ A: A hash is computed from the user's name by summing character codes with bit shifting (`charCodeAt(i) + ((hash << 5) - hash)`). The hash modulo the gradient array length selects a consistent gradient. Same name always gets the same color.

---

### 📄 AdvertiseSection.jsx
**Purpose:**
A marketing/branding section with imagery, feature highlights, and a call-to-action. Purely presentational — no data fetching.

**Internal Details:**
- Static content: headline, description, feature items (Seamless Booking, 24/7 Concierge)
- Gallery layout: main image + two floating accent images (from Unsplash)
- Decorative elements: gradient rings, overlay effects
- "Start Your Journey" button (scroll indicator, no navigation)

**System Role:**
Visual storytelling section on the Home page between the hero and hotel listings. Reinforces the luxury brand positioning.

**Discussion Q&A:**
- ❓ Q: Why use external Unsplash images instead of local assets?
  ✅ A: For a university project, Unsplash provides high-quality, royalty-free images without bloating the repository. In production, you'd host optimized images on your own CDN or S3 bucket for reliability and performance.

---

### 📄 Footer.jsx
**Purpose:**
The customer-facing footer with brand info, navigation links, contact details, social media icons, and legal text.

**Internal Details:**
- Static component — no state or API calls
- Multi-column grid layout: Brand + description, Quick Links, Destinations, Support, Legal
- Social media SVG icons: Instagram, Twitter, LinkedIn, YouTube
- Dynamic copyright year via `new Date().getFullYear()`
- Newsletter signup input (UI only — no backend integration)

**System Role:**
Present on every customer page via `CustomerLayout`. Provides site-wide navigation, contact info, and legal compliance (privacy policy, terms links).

**Discussion Q&A:**
- ❓ Q: Why is the footer a separate component instead of inline in the layout?
  ✅ A: Separation of concerns — the footer has its own complex markup and styling. Keeping it as a standalone component makes it independently maintainable, testable, and reusable if the layout structure changes.



---

## 📁 components/ai/

> AI-powered chat assistant components that connect to a separate AI microservice for intelligent hotel recommendations and booking assistance.

### 📄 AiChatWidget.jsx
**Purpose:**
A floating chat widget that provides AI-powered assistance to users. Supports real-time conversation with message history, typing indicators, and minimize/maximize states.

**Internal Details:**
- Props: `token` (JWT for authenticated AI requests)
- State: `isOpen`, `isMinimized`, `input`, `messages[]`, `isLoading`, `sessionId`
- Uses `lucide-react` icons and `framer-motion` for animations
- Session ID: generated once per component mount (`session-${random}`) to maintain conversation context
- Message flow:
  1. User types message → adds to `messages[]` with role 'user'
  2. Sets `isLoading` true → calls `sendChatMessage(input, sessionId, token)`
  3. On response → adds assistant message to `messages[]`
- Auto-scrolls to bottom on new messages via `useRef` + `scrollIntoView`
- Welcome message pre-loaded on mount
- Toggle states: closed (just FAB button), open (full chat), minimized (header only)

**System Role:**
Available on every customer page (rendered in Navbar). Provides intelligent assistance: hotel recommendations, booking help, FAQ answers. Connects to a separate AI microservice (port 8082) that has access to the live database.

**Discussion Q&A:**
- ❓ Q: Why use a separate session ID instead of the user's auth token for conversation tracking?
  ✅ A: The session ID tracks a single conversation thread. A user might have multiple conversations (different browser tabs) or the AI service might not need to know the user's identity for basic Q&A. The token is sent separately for authenticated features (accessing personal booking data).

- ❓ Q: Why is the AI service on a different port (8082)?
  ✅ A: It's a separate microservice — the AI subsystem has its own dependencies (ML models, vector databases, etc.) and deployment lifecycle. Separating it from the main booking API (8080) follows microservice architecture principles: independent scaling, deployment, and failure isolation.

---

### 📄 aiService.js
**Purpose:**
HTTP communication layer for the AI chat microservice. Handles message sending with authentication.

**Internal Details:**
- Base URL: `http://localhost:8082/api/ai`
- Single exported function: `sendChatMessage(message, sessionId, token)`
- Uses native `fetch()` (not Axios) — keeps the AI service independent from the main API layer
- Sends POST to `/chat` with JSON body: `{ message, sessionId }`
- Attaches `Authorization: Bearer {token}` header if token is provided
- Error handling: parses error response JSON for message, throws descriptive errors

**System Role:**
Thin communication layer between `AiChatWidget` and the AI backend. Intentionally simple — no interceptors or retry logic needed for chat messages.

**Discussion Q&A:**
- ❓ Q: Why use `fetch()` here instead of Axios like the other services?
  ✅ A: The AI service is architecturally separate from the main booking API. Using `fetch()` avoids coupling it to the Axios interceptor chain (which handles booking API token refresh). The AI service has simpler auth needs — if the token is invalid, the chat just shows an error rather than attempting refresh.

---

## 📁 components/manager_2/

> Hotel manager portal components. Provides full CRUD operations for hotels, rooms, room types, bookings, base prices, and dynamic pricing rules.

### 📄 ManagerHotels.js
**Purpose:**
The manager's hotel listing page with full CRUD: view all owned hotels, create new hotels, edit existing ones, and delete hotels.

**Internal Details:**
- State: `hotels[]`, `loading`, `error`, `showCreateModal`, `showEditModal`, `editingHotel`, `creating`, `updating`, `createError`, `editError`, `deletingId`, `imagePreview`, `editImagePreview`, `newHotel`, `editHotel`
- Fetches hotels via `managerAPI.getMyHotels()` on mount
- Create flow: modal form with fields (name, city, address, description, rating, isActive, image file) → `managerAPI.createHotel(formData)` with multipart/form-data
- Edit flow: pre-fills form from selected hotel → `managerAPI.updateHotel(hotelId, formData)`
- Delete: confirmation dialog → `managerAPI.deleteHotel(hotelId)`
- Image preview: reads selected file with `FileReader` for instant preview before upload
- Uses `getImageUrl()` for displaying existing hotel images
- Each hotel card has "Manage" button → navigates to `ManagerDashboard`

**System Role:**
The manager's entry point. From here, managers navigate to individual hotel dashboards for detailed management (rooms, pricing, bookings).

**Discussion Q&A:**
- ❓ Q: Why use FormData for hotel creation instead of JSON?
  ✅ A: Hotel creation includes an image file upload. `FormData` is the standard way to send mixed content (text fields + binary file) in a single HTTP request. The backend's `@RequestParam` annotations parse each part separately.

- ❓ Q: How does image preview work before upload?
  ✅ A: When the user selects a file, a `FileReader` reads it as a data URL (`readAsDataURL`). This base64-encoded string is set as the `src` of an `<img>` tag, showing the preview instantly without any server round-trip.

---

### 📄 ManagerDashboard.jsx
**Purpose:**
A tabbed dashboard for managing a single hotel's resources: rooms, room types, bookings, base prices, and pricing rules.

**Internal Details:**
- Extracts `hotelId` from URL params
- State: `hotel`, `loading`, `error`, `activeTab`, plus data arrays: `rooms[]`, `roomTypes[]`, `bookings[]`, `pricingRules[]`, `basePrices[]`
- On mount, fetches all data in parallel using `Promise.all()`:
  - `managerAPI.getMyHotels()` → finds the specific hotel
  - `managerAPI.getHotelRooms(hotelId)`
  - `managerAPI.getHotelRoomTypes(hotelId)`
  - `managerAPI.getMyHotelBookings(hotelId)`
  - `managerAPI.getHotelPricingRules(hotelId)`
  - `managerAPI.getHotelBasePrices(hotelId)`
- Each `.catch(() => ({ data: [] }))` ensures one failed fetch doesn't break the entire page
- Tab navigation: Rooms, Room Types, Bookings, Pricing Rules, Base Prices
- Each tab renders its respective component, passing data + `onRefresh` callback

**System Role:**
The central management hub for a single hotel. Orchestrates data fetching and distributes it to specialized tab components. The `onRefresh` pattern allows child tabs to trigger data re-fetch after mutations.

**Discussion Q&A:**
- ❓ Q: Why fetch all data upfront instead of lazily per tab?
  ✅ A: Hotel management data is relatively small (tens of rooms, not thousands). Fetching everything upfront eliminates loading delays when switching tabs, providing a snappier UX. The parallel fetch with `Promise.all` keeps the initial load fast.

- ❓ Q: What's the `onRefresh` pattern?
  ✅ A: Each tab component receives an `onRefresh` callback that re-fetches all dashboard data. When a tab creates/updates/deletes an entity, it calls `onRefresh()` to ensure all tabs have consistent data (e.g., creating a room type affects both the Room Types tab and the Rooms tab's dropdown).

---

### 📄 ManagerRoomsTab.js
**Purpose:**
CRUD interface for managing individual rooms within a hotel: create rooms, assign to room types, change status, and delete.

**Internal Details:**
- Props: `hotelId`, `rooms[]`, `roomTypes[]`, `onRefresh`
- State: `showModal`, `editRoom`, `saving`, `error`, `deletingId`, `form` (roomNumber, roomTypeId, roomStatus)
- Room statuses: AVAILABLE, MAINTENANCE, DEACTIVATED — each with color-coded badges
- Create/Edit modal: room number input, room type dropdown, status dropdown
- Create: `managerAPI.createRoom(data)` → `onRefresh()`
- Edit: `managerAPI.patchRoom(roomId, data)` → `onRefresh()`
- Delete: confirmation → `roomAPI.deleteRoom(roomId)` → `onRefresh()`
- Change room type: separate modal for reassigning a room to a different type

**System Role:**
Manages the physical room inventory. Rooms are instances of room types — e.g., Room "DL101" is of type "Deluxe". Status management enables maintenance scheduling.

**Discussion Q&A:**
- ❓ Q: What's the relationship between rooms and room types?
  ✅ A: A room type defines the category (Deluxe, Suite, etc.) with its amenities and base price. A room is a physical instance — "Room 301" of type "Deluxe". Multiple rooms can share one room type. When a customer books a "Deluxe" room, the system assigns an available room of that type.

---

### 📄 ManagerRoomTypesTab.js
**Purpose:**
CRUD interface for room type categories: create types with amenities, set capacity, upload images, and manage pricing.

**Internal Details:**
- Props: `hotelId`, `roomTypes[]`, `rooms[]`, `onRefresh`
- Uses `getImageUrl()` from shared utility for room type images
- Fetches available amenities from `amenitiesAPI.getAllAmenities()` with fallback to `FALLBACK_AMENITIES` constant
- `formatAmenityDisplay()`: converts `WIFI` → `Wifi`, `AIR_CONDITIONING` → `Air Conditioning`
- Create: multipart form with name, capacity (SINGLE/DOUBLE/TWIN/TRIPLE/FAMILY), base price, amenities checkboxes, image upload
- Edit: PATCH with changed fields only
- Delete: confirmation with cascade warning
- Each card shows: image, name, capacity icon, base price, amenity tags, room count

**System Role:**
Defines the product catalog — what types of rooms the hotel offers. Room types are referenced by rooms, base prices, and pricing rules. Deleting a room type cascades to its rooms.

**Discussion Q&A:**
- ❓ Q: Why fetch amenities from the backend instead of hardcoding them?
  ✅ A: The amenities are defined as a Java enum on the backend. Fetching them ensures the frontend stays in sync if new amenities are added. The `FALLBACK_AMENITIES` constant is a safety net in case the API call fails — the UI remains functional with a known set.

---

### 📄 ManagerBookingsTab.js
**Purpose:**
Read-only overview of all bookings for a specific hotel, with filtering by status and search functionality.

**Internal Details:**
- Props: `hotelId`, `bookings[]`, `roomTypes[]`, `onRefresh`
- State: `filter` (status filter), `searchQuery`
- Status filters: ALL, CONFIRMED, PENDING, CANCELLED, COMPLETED, REFUNDED — with count badges
- Search: filters by customer name, email, guest name, room number, room type, or booking ID
- Revenue calculation: sums `totalPrice` or `quotedPrice` of CONFIRMED + COMPLETED bookings
- Each booking row shows: ID, customer info, room details, dates, price, status badge
- `fmt()` helper: formats date strings to readable format

**System Role:**
Gives managers visibility into their hotel's booking activity. Read-only because booking lifecycle is managed by customers and the system (not manually by managers).

**Discussion Q&A:**
- ❓ Q: Why is this tab read-only for managers?
  ✅ A: Booking state transitions (confirm, cancel, complete) are driven by business rules: payment confirms, customer cancels, system completes after checkout. Allowing manual manager overrides could create inconsistencies with payment records. The manager's role is to observe and manage capacity, not manipulate individual bookings.

---

### 📄 ManagerBasePricesTab.js
**Purpose:**
Manages seasonal base prices for each room type — allows setting different prices for different date ranges.

**Internal Details:**
- Props: `hotelId`, `basePrices[]`, `roomTypes[]`, `onRefresh`
- State: `showModal`, `editPrice`, `saving`, `error`
- Form fields: room type (dropdown), price per night, start date, end date, season name, active toggle
- Create: `managerAPI.setBasePrice(hotelId, roomTypeId, priceData)`
- Edit: `managerAPI.patchBasePrice(basePriceId, priceData)`
- Delete: `managerAPI.deleteBasePrice(basePriceId)`
- Each price entry shows: room type, price, date range, season name, active status

**System Role:**
Defines the foundational pricing layer. Base prices are the starting point before dynamic pricing rules apply adjustments. Multiple base prices can exist for the same room type (different seasons).

**Discussion Q&A:**
- ❓ Q: How do base prices interact with pricing rules?
  ✅ A: The pricing engine first looks up the applicable base price for the room type and date range. Then it applies all active pricing rules (early-bird discount, weekend surcharge, etc.) as percentage adjustments on top of the base price. The final quoted price is: `basePrice × (1 + sum of adjustments)`.

---

### 📄 ManagerPricingRulesTab.js
**Purpose:**
Manages dynamic pricing rules that adjust prices based on conditions: early-bird, last-minute, long-stay, weekend, seasonal, holiday, occupancy-based, and length-of-stay.

**Internal Details:**
- Props: `hotelId`, `rules[]`, `roomTypes[]`, `onRefresh`
- State: `showModal`, `showAssignModal`, `editRule`, `assignRule`, `saving`, `error`, `selectedRoomTypes[]`, `deletingId`
- Rule types: EARLY_BIRD, LAST_MINUTE, LONG_STAY, WEEKEND, SEASONAL, HOLIDAY, OCCUPANCY_BASED, LENGTH_OF_STAY
- Form fields: name, description, adjustment percent (+/-), rule type, min/max days before check-in, min stay days, valid date range, applicable days (Mon-Sun checkboxes), priority, active toggle
- Assign modal: links a rule to specific room types via `managerAPI.assignRuleToRoomTypes(ruleId, roomTypeIds[])`
- Create: `managerAPI.createPricingRule(hotelId, ruleData)`
- Edit: `managerAPI.patchPricingRule(ruleId, ruleData)`
- Delete: `managerAPI.deletePricingRule(ruleId)`

**System Role:**
The most complex business logic component. Pricing rules enable revenue management — the same room can cost differently based on when it's booked, how far in advance, how long the stay is, and what day of the week. This is a key differentiator for the platform.

**Discussion Q&A:**
- ❓ Q: How does rule priority work?
  ✅ A: When multiple rules apply to the same booking, priority determines the order of application. Lower priority numbers are applied first. This matters because percentage adjustments compound — a -10% early-bird followed by a +5% weekend gives a different result than the reverse order.

- ❓ Q: What's the difference between EARLY_BIRD and LAST_MINUTE?
  ✅ A: EARLY_BIRD applies when the booking is made many days before check-in (`minDaysBeforeCheckin` is high) — typically a discount to encourage advance booking. LAST_MINUTE applies when booking is made close to check-in date (`maxDaysBeforeCheckin` is low) — can be a discount to fill empty rooms or a surcharge for urgency.

---

### 📄 ManagerNavbar.js
**Purpose:**
Navigation bar for the manager portal with theme toggle (dark/light mode), user info, and logout.

**Internal Details:**
- State: `isDark` (persisted to localStorage)
- Theme toggle: sets `data-theme` attribute on `document.documentElement`, enabling CSS variable switching
- Uses `useAuth()` for user info and logout
- Links: back to hotel list, user avatar with initial, logout button
- Theme persistence: reads from localStorage on mount, saves on change

**System Role:**
Present on all manager pages via `ManagerLayout`. Provides consistent navigation and the dark/light theme toggle that affects the entire manager portal.

**Discussion Q&A:**
- ❓ Q: How does the theme toggle work without a state management library?
  ✅ A: It uses the CSS custom properties pattern: setting `data-theme="dark"` on the root element activates a different set of CSS variables (colors, backgrounds). All manager components reference these variables, so changing the attribute instantly re-themes everything. localStorage persists the preference across sessions.

---

### 📄 ManagerFooter.js
**Purpose:**
Footer for the manager portal with brand info, navigation links, social media icons, and copyright.

**Internal Details:**
- Static component — no state or API calls
- Multi-column layout: Brand, Quick Links, Resources, Legal
- Dynamic copyright year
- Social media SVG icons
- Similar structure to customer Footer but with manager-specific links

**System Role:**
Present on all manager pages via `ManagerLayout`. Provides consistent branding and navigation at the bottom of every manager view.

**Discussion Q&A:**
- ❓ Q: Why have separate footers for customer and manager portals?
  ✅ A: The portals serve different audiences with different needs. The customer footer has destination links, support info, and newsletter signup. The manager footer has documentation links, API references, and admin resources. Separate components allow independent evolution.



---

## 🧠 Key Technical Concepts

### React Component Lifecycle
The application uses **functional components exclusively** with React Hooks for lifecycle management:
- `useState` — local component state (forms, loading flags, modal visibility)
- `useEffect` — side effects (API calls on mount, event listeners, cleanup)
- `useRef` — DOM references (auto-scroll in chat, input focus)
- `useMemo` — memoized computations (form validation in PaymentModal)
- `useCallback` — stable function references (modal close handlers)
- `useContext` — consuming AuthContext without prop drilling

No class components are used. The `useEffect` cleanup pattern is consistently applied for event listeners and scroll locks.

---

### State Management Strategy
The project uses a **lightweight, context-based approach** rather than Redux or Zustand:

| Layer | Tool | Scope |
|-------|------|-------|
| Global auth state | React Context (`AuthContext`) | Entire app |
| Page-level data | `useState` in page components | Single page |
| Cross-page persistence | `localStorage` | Search params, tokens, theme |
| Component-local UI state | `useState` in components | Single component |

**Why no Redux?** The app has a single global concern (authentication). All other state is page-scoped — hotels on the Home page don't need to be shared with the Bookings page. This keeps the architecture simple and avoids boilerplate.

---

### Routing & Navigation
Built with **React Router v6** using the following patterns:

- **Nested Routes with Outlet**: `CustomerLayout` and `ManagerLayout` use `<Outlet />` to render child routes within their layout wrapper
- **Route Guards**: Custom components (`CustomerGuard`, `ManagerGuard`, `PublicRoute`) that check auth state before rendering
- **Programmatic Navigation**: `useNavigate()` for post-action redirects (after login, after search)
- **URL Parameters**: `useParams()` for dynamic routes (`/hotel/:id`, `/manager-dashboard/:hotelId`)
- **Query Parameters**: `useLocation()` + `URLSearchParams` for search filters
- **Catch-all Route**: `<Route path="*">` redirects unknown paths to login

The routing tree enforces role-based access at the frontend level, complementing backend JWT role validation.

---

### API Communication
All HTTP communication uses **Axios** with a consistent interceptor pattern:

```
Request Flow:
  Component → API Service → Axios Instance → Request Interceptor (attach JWT) → Backend

Response Flow:
  Backend → Response Interceptor (check 401 → refresh token → retry) → API Service → Component
```

Key patterns:
- **Three separate Axios instances**: `api` (auth), `customerApi` (customer endpoints), `apiManager` (manager endpoints)
- **Automatic token refresh**: 401 responses trigger refresh flow transparently
- **Subscriber queue**: Prevents multiple simultaneous refresh calls when parallel requests fail
- **Multipart uploads**: Hotel/room-type image uploads use `FormData` with overridden content-type
- **Error propagation**: API errors bubble up to components for user-facing error messages

---

### Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User submits credentials (Login/Signup)                  │
│  2. Backend validates → returns {accessToken, refreshToken}  │
│  3. Tokens stored in localStorage                            │
│  4. AuthContext fetches user profile (GET /api/users/me)     │
│  5. User object (with roles[]) stored in context state       │
│  6. Route guards read context → allow/redirect               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    TOKEN REFRESH FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. API call returns 401 (token expired)                     │
│  2. Interceptor sends refresh token to /api/auth/refresh     │
│  3. Backend validates refresh token → returns new pair       │
│  4. New tokens saved to localStorage                         │
│  5. Original failed request retried with new access token    │
│  6. If refresh fails → clear tokens → dispatch logout event  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    AUTHORIZATION (ROLES)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Roles: CUSTOMER, HOTEL_MANAGER, ADMIN                       │
│                                                              │
│  Frontend enforcement:                                       │
│  - CustomerGuard: requires auth + NOT manager/admin          │
│  - ManagerGuard: requires auth + HOTEL_MANAGER or ADMIN      │
│  - PublicRoute: redirects authenticated users to dashboard   │
│                                                              │
│  Backend enforcement:                                        │
│  - JWT contains roles claim                                  │
│  - @PreAuthorize annotations on controller methods           │
│  - SecurityConfig defines endpoint access rules              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Important**: Frontend guards are a UX convenience (preventing users from seeing pages they can't use). The real security boundary is the backend — even if a user bypasses frontend guards, API calls will fail with 403 Forbidden if their JWT doesn't have the required role.

---

### Design Patterns Used

| Pattern | Where | Purpose |
|---------|-------|---------|
| Context Provider | AuthContext | Global state without prop drilling |
| Interceptor | API services | Cross-cutting concerns (auth headers, token refresh) |
| Subscriber/Observer | Token refresh queue | Handle concurrent 401s |
| Guard/Middleware | Route guards | Access control |
| Layout Composition | CustomerLayout, ManagerLayout | Shared UI structure |
| Container/Presenter | Pages (fetch) → Components (render) | Separation of concerns |
| Controlled Components | All form inputs | React-managed form state |
| Optimistic UI | Wishlist toggle | Immediate feedback |
| Two-Phase Commit | Booking → Payment | Ensure price accuracy before payment |

---

*Document generated for EliteReserve Frontend — University Project Defense*
*Last updated: May 2026*
