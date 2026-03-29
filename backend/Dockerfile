FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy toàn bộ dự án vào container
COPY . .

# Chạy build Maven: Tự tìm đến thư mục chứa pom.xml để build
RUN mvn -f backend/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy file jar từ bước build trước đó (đường dẫn cố định)
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
