
# GigBooker — Band ↔ Venue Booking Platform

A full-stack web app where **venues post gigs** and **bands express interest**.

- **Live app (frontend):** https://gigbooker-1.onrender.com  

The frontend is a React single-page app hosted on **Render Static Sites**.  
The backend is a **Spring Boot** REST API packaged as a Docker image and deployed as a **Render Web Service**, backed by a managed **PostgreSQL** instance on Render.

---

## ✨ Features

- **Role-based UX**
  - **Band dashboard:** browse gigs, filter upcoming/past, “Show Interest.”
  - **Venue dashboard:** create gigs, view interested bands for your gigs.
- **Simple booking flow**
  - Venues publish gigs.
  - Bands express interest in specific gigs.
- **Clean backend architecture**
  - JPA entities + repositories + services + controllers.
  - REST API consumed via Axios on the frontend.
- **Production-ready setup**
  - PostgreSQL on Render (managed DB).
  - Dockerized Spring Boot backend.
  - Static React build served via Render.
  - CORS configured for the production frontend origin.

---

## 🧱 Tech Stack

**Frontend**

- React (CRA)
- React Router
- Axios
- CSS modules / custom styles

**Backend**

- Java 21
- Spring Boot 3 (Web, Data JPA, Validation)
- PostgreSQL + Hibernate
- Maven / Maven Wrapper
- Docker (for production deployment)

**Infrastructure**

- Render Static Site (frontend)
- Render Web Service (Docker, backend)
- Render PostgreSQL (managed DB)

---

## 📁 Project Structure

```text
GigBooker/
  backend/                      # Spring Boot backend
    src/main/java/com/sammyibrahim20/backend/
      config/WebConfig.java     # CORS configuration
      controller/               # REST controllers
      model/                    # JPA entities (Band, Venue, Gig, etc.)
      repository/               # Spring Data repositories
      service/                  # Business logic
      PlaygroundApplication.java
    src/main/resources/
      application.properties    # local dev profile
      application-prod.properties  # production (Postgres) profile
    pom.xml
  gig-booking-frontend/         # React frontend
    src/
      components/
      pages/
      router/
      styles/
      services/api.js           # Axios instance with baseURL → backend
    package.json
  Dockerfile                    # Builds backend jar inside a Docker image
  README.md
```

---

## 🌐 Live Usage

Most users don’t need to set anything up locally:

1. Visit **https://gigbooker-1.onrender.com/**
2. Choose **Band** or **Venue** in the navbar.
3. As a **Venue**, create / manage gigs.
4. As a **Band**, browse gigs and express interest.

The frontend talks to the backend at **https://gigbooker-docker.onrender.com** via Axios (configured in `gig-booking-frontend/src/services/api.js`).

---

## 🧪 Running Locally (Dev)

You *can* still run everything locally if you want to develop new features.

### 0) Prerequisites

- Node.js 18+ and npm
- Java 17+ or 21+
- Maven (or just use `./mvnw` from the repo)
- Optional but recommended: a local Postgres instance  
  (or keep using H2 locally – see note below)

### 1) Clone

```bash
git clone https://github.com/sammyibrahim20/GigBooker.git
cd GigBooker
```

### 2) Backend – Spring Boot

From the repo root:

```bash
cd backend

# using Maven wrapper (preferred)
./mvnw spring-boot:run

# or, if you have Maven installed globally
mvn spring-boot:run
```

By default the app starts on **http://localhost:8080**.

#### Local DB configuration

- **Option A – H2 for quick dev**  
  Keep `application.properties` configured for an in-memory H2 database. This is fast and requires no external setup.

- **Option B – Postgres for parity with prod**  
  Add a local Postgres URL and credentials to `application.properties`, for example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gigbooker
spring.datasource.username=your_local_user
spring.datasource.password=your_local_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

In production, Render loads the **Postgres connection info from environment variables** (see “Deployment Notes” below), and Spring Boot uses `application-prod.properties` / the `prod` profile.

#### CORS

`WebConfig` whitelists the frontend origins. For local dev, make sure it includes:

```java
.allowedOrigins("http://localhost:3000")
```

For production, it also includes:

```java
.allowedOrigins("https://gigbooker-1.onrender.com")
```

(You can keep both origins in the list.)

### 3) Frontend – React

In a separate terminal:

```bash
cd gig-booking-frontend
npm install
npm start
```

The React dev server runs on **http://localhost:3000**.

In `src/services/api.js`, the Axios instance for local development usually looks like:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // local Spring Boot backend
  timeout: 15000,
});

export default api;
```

> In production, this `baseURL` is set to `https://gigbooker-docker.onrender.com` so the bundled frontend calls the deployed backend.

---

## 🔌 Production Deployment (Render Overview)

You don’t have to do these steps every time you use the app, but this documents how the live setup works.

### 1) Backend Web Service (Docker)

- Render service type: **Web Service (Docker)**  
- Repo: this GitHub repo
- Dockerfile at repo root builds the backend:
  - Uses Maven to build the Spring Boot JAR
  - Runs `java -jar app.jar`
- Environment variables (examples):

```text
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-d4dm5rvdiees7396jvug-a.ohio-postgres.render.com:5432/gigbooker?sslmode=require
SPRING_DATASOURCE_USERNAME=gigbooker_user
SPRING_DATASOURCE_PASSWORD=********
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

Render injects these at runtime, and Spring Boot configures the DataSource accordingly.

### 2) PostgreSQL Database (Render)

- Render service type: **PostgreSQL**
- The External Database URL is converted into a JDBC URL and placed in `SPRING_DATASOURCE_URL`.
- The backend connects to this DB on startup and auto-creates tables with `ddl-auto=update`.

### 3) Frontend Static Site (Render)

- Render service type: **Static Site**
- Root directory: `gig-booking-frontend`
- Build command:

```bash
cd gig-booking-frontend && npm install && npm run build
```

- Publish directory: `gig-booking-frontend/build`
- The built SPA is served at **https://gigbooker-1.onrender.com**, and all API calls go to the backend URL configured in `api.js`.

### 4) Updating the Live App

When you:

1. Change backend code → commit & push → Render backend service rebuilds and redeploys.
2. Change frontend code → commit & push → Render static site rebuilds and redeploys.
3. Database usually **does not** need to be recreated; schema changes are handled via JPA `ddl-auto` or migrations later.

---

## 🧭 Roadmap

- Proper authentication for bands & venues (JWT / sessions).
- Booking confirmation flow (accept / decline interests).
- Email notifications.
- Admin dashboard for monitoring gigs and usage.
- Migrations (Flyway/Liquibase) instead of `ddl-auto` for schema changes.

---

## 📜 License

MIT (or any license you choose to apply in this repo).
