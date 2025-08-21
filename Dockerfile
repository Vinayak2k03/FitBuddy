FROM openjdk:11-jre-slim

WORKDIR /app

# Copy Maven wrapper and pom.xml first for better caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Make mvnw executable
RUN chmod +x mvnw

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Copy the built JAR
RUN cp target/fitbuddy-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set memory limits for free tier
ENV JAVA_OPTS="-Xmx450m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]