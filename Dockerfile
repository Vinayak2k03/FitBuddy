# Multi-stage build: Build stage
FROM maven:3.8.6-openjdk-11-slim AS build

WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:11-jre-slim

WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/fitbuddy-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set memory limits for free tier
ENV JAVA_OPTS="-Xmx450m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]