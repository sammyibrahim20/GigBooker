# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-21 AS build

# Work inside /app
WORKDIR /app

# Copy backend Maven project
COPY backend/pom.xml .
COPY backend/src ./src

# Build the Spring Boot jar (skip tests for faster deploys)
RUN mvn clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the jar built in the previous stage
COPY --from=build /app/target/*.jar app.jar

# Spring Boot default port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
