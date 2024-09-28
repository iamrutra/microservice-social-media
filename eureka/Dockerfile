FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-slim as builder
COPY --from=build /app/target/*.jar application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:17-jre-alpine

ENV JDK_JAVA_OPTIONS="-Xms256m -Xmx512m"

RUN apk --no-cache add bash curl

RUN mkdir /app
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app

COPY --from=builder dependencies/ /app
COPY --from=builder spring-boot-loader/ /app
COPY --from=builder snapshot-dependencies/ /app
COPY --from=builder application/ /app

RUN chown -R spring:spring .
USER spring:spring

EXPOSE 8761
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-cp", "BOOT-INF/classes:BOOT-INF/lib/*", "com.example.discoveryservice.DiscoveryServiceApplication"]
