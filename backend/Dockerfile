FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy toàn bộ nội dung để đảm bảo không thiếu file
COPY . .

# Lệnh build thông minh: Tự tìm file pom.xml và build tại đúng vị trí của nó
RUN find . -name "pom.xml" -exec mvn -f {} clean package -DskipTests \;

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Tìm file jar đã build xong và copy vào /app/app.jar
RUN --mount=type=bind,from=build,source=/app,target=/build-context \
    cp $(find /build-context -name "*.jar" | grep -v "original" | head -n 1) app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
