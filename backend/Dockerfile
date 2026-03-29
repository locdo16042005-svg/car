FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app
# Copy toàn bộ nội dung thư mục backend vào /app
COPY . .
# Chạy build
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy file jar từ thư mục target vừa build xong
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
