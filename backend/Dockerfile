FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app
# Copy toàn bộ thư mục backend vào container
COPY . .
# Chạy build Maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy file jar từ bước build trước đó
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
