# Optimized runtime-only Dockerfile for Spring Boot
# Using eclipse-temurin for better production support and security
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the pre-built JAR with correct ownership (no root-owned files)
COPY --chown=spring:spring *.jar app.jar

USER spring:spring

# Expose application port (actuator is on 8081 via management.server.port, not exposed)
EXPOSE 8080

# Health check targets the internal management port (127.0.0.1:8081 in prod profile)
# Falls back to 8080 for local dev where management.server.port is not set
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -q --spider http://localhost:8081/actuator/health \
      || wget -q --spider http://localhost:8080/actuator/health \
      || exit 1

# Hardened JVM flags:
# -Djava.security.egd         : Fast secure random (avoids /dev/random blocking)
# -XX:+UseContainerSupport    : Respect Docker CPU/memory cgroup limits
# -XX:MaxRAMPercentage=75.0   : Use 75% of container memory for heap
# -XX:+ExitOnOutOfMemoryError : Crash fast on OOM rather than stalling
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+ExitOnOutOfMemoryError", \
  "-jar", "app.jar"]
