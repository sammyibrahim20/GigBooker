# GigBooker — Band ↔ Venue Booking Platform

A full‑stack web app where **venues post gigs** and **bands express interest**. Built with **React** on the frontend and **Spring Boot** on the backend, with clean repository/service layers and a REST API.

## ✨ Highlights
- **Role-based UX:** Separate dashboards for Bands and Venues with focused actions.
- **Fast browse + intent:** Venues publish gigs; Bands browse and “Show Interest.”
- **MVP data model:** Bands, Venues, and Gigs (with upcoming/past filters).
- **Clean architecture:** React components + Spring Boot REST API (JPA/Hibernate), CORS configured for local dev.
- **Dev-friendly:** H2 in-memory DB in development; production DB pluggable later (Postgres/MySQL).

---

## 🧱 Tech Stack
**Frontend:** React (JSX), React Router, CSS  
**Backend:** Java 17+, Spring Boot, JPA/Hibernate, REST, H2 (dev)  
**Build/Tooling:** npm, Maven (or Maven Wrapper), GitHub

---

## 📁 Project Structure
```text
GigBooker/
  frontend/                 # React app (components, pages, styles)
    src/
      components/
        AnimatedButton.jsx
        BandForm.jsx
        VenueForm.jsx
        GigForm.jsx
        GigCard.jsx
        GigList.jsx
        Navbar.jsx
      pages/
        HomePage.jsx
        BandDashboardPage.jsx
        VenueDashboardPage.jsx
        NotFoundPage.jsx
      styles/
        animations.css
        globals.css
        form.css
  backend/                  # Spring Boot app (Java, resources)
    src/main/java/.../
      config/WebConfig.java
      repository/
        BandRepository.java
        VenueRepository.java
        GigRepository.java
      service/
        BandService.java
        VenueService.java
        GigService.java
      controller/           # (add: REST controllers)
      model/                # (add: JPA entities Band, Venue, Gig)
    src/main/resources/
      application.properties (local dev config)
  README.md
```

> Note: Some backend folders (controller/model) may not be included yet in this snapshot. Add them as you wire up the REST endpoints.

---

## 🚀 Getting Started (Local)

### 0) Prereqs
- Node.js 18+ and npm
- Java 17+ (Temurin/AdoptOpenJDK recommended)
- Maven (or use `./mvnw` wrapper if included)

### 1) Clone
```bash
git clone https://github.com/sammyibrahim20/GigBooker.git
cd GigBooker
```

### 2) Backend — Spring Boot
```bash
cd backend
# If you have mvnw in the repo:
./mvnw spring-boot:run
# Otherwise:
mvn spring-boot:run
```
Server will start by default on **http://localhost:8080**.

**`application.properties` (example for dev):**
```properties
# H2 in-memory DB for dev
spring.datasource.url=jdbc:h2:mem:gigbooker;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.h2.console.enabled=true

# CORS (if using custom config ensure localhost:3000 is allowed)
```
> If you already added a `WebConfig` CORS bean, confirm it allows `http://localhost:3000` and methods `GET,POST,PUT,PATCH,DELETE,OPTIONS`.

### 3) Frontend — React
Open a new terminal:
```bash
cd frontend
npm install
# If Vite:
npm run dev
# If Create React App:
npm start
```
Frontend runs on **http://localhost:3000** by default.

---

## 🔌 API Overview (MVP)
> Endpoints may vary with your controllers; below is a suggested shape that matches the UI flows.

### Bands
- GET /api/bands — list bands
- POST /api/bands — create band
- GET /api/bands/{id} — get band by id

### Venues
- GET /api/venues — list venues
- POST /api/venues — create venue
- GET /api/venues/{id} — get venue by id

### Gigs
- GET /api/gigs — list gigs
- GET /api/gigs/upcoming — upcoming gigs
- GET /api/gigs/past — past gigs
- GET /api/venues/{venueId}/gigs — gigs by venue
- POST /api/gigs — create a gig
- PATCH /api/gigs/{id} — update a gig (title/date/price/capacity/etc.)
- DELETE /api/gigs/{id} — delete a gig

### Interests (Band → Gig)
- POST /api/gigs/{gigId}/interests — current band expresses interest
- GET /api/gigs/{gigId}/interests — list interested bands (venue view)
- DELETE /api/gigs/{gigId}/interests/{bandId} — retract/decline interest

> Tip: Use JWT/cookie auth later to secure “current band/venue” actions; MVP can pass band/venue id in the body while prototyping.

---

## 🧭 Frontend UX Notes
- **HomePage:** Choose “I am a Band” or “I am a Venue.”
- **BandDashboard:** Browse gigs, filter by date, **Show Interest**; see status.
- **VenueDashboard:** Create gigs, see your gigs, review interested bands, accept/decline.
- **GigCard/GigList:** Reusable components for consistent listing, with date/currency formatting and disabled actions for past gigs.

---

## 🔐 CORS & Dev Auth
- CORS is enabled for `http://localhost:3000` to call `http://localhost:8080`.
- Add real auth (JWT/cookies) later; current flows can be open or minimally gated during prototyping.

---

## 🗺️ Roadmap
- Auth (bands/venues), role-based access
- Approvals/booking flow (accept → confirmed gig)
- Notifications (email or in-app)
- Stripe/PayPal deposit (optional)
- Postgres in production + Flyway migrations
- File uploads (tech rider, stage plot) and richer profiles

---

## 🧪 Testing
- Backend: Spring Boot tests for services/controllers; H2 test profile.
- Frontend: Component tests (Vitest/Jest) for cards/forms and dashboard flows.

---

## 📜 License
MIT (or your preferred license).

---

## 🙌 Acknowledgments
- React & Spring Boot communities.