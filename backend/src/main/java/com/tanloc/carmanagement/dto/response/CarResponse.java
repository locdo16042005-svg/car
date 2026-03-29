package com.tanloc.carmanagement.dto.response;

import com.tanloc.carmanagement.entity.CarStatus;
import com.tanloc.carmanagement.entity.CarType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CarResponse {
    private Long id;
    private String name;
    private Long brandId;
    private String brandName;
    private CarType carType;
    private BigDecimal price;
    private Integer year;
    private String color;
    private String chassisNumber;
    private String description;
    private CarStatus status;
    private Boolean inspectionPassed;
    private List<String> imageUrls;
    private LocalDateTime createdAt;

    public CarResponse() {}

    public CarResponse(Long id, String name, Long brandId, String brandName, CarType carType,
                       BigDecimal price, Integer year, String color, String chassisNumber,
                       String description, CarStatus status, Boolean inspectionPassed,
                       List<String> imageUrls, LocalDateTime createdAt) {
        this.id = id; this.name = name; this.brandId = brandId; this.brandName = brandName;
        this.carType = carType; this.price = price; this.year = year; this.color = color;
        this.chassisNumber = chassisNumber; this.description = description; this.status = status;
        this.inspectionPassed = inspectionPassed; this.imageUrls = imageUrls; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    public CarType getCarType() { return carType; }
    public void setCarType(CarType carType) { this.carType = carType; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getChassisNumber() { return chassisNumber; }
    public void setChassisNumber(String chassisNumber) { this.chassisNumber = chassisNumber; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public CarStatus getStatus() { return status; }
    public void setStatus(CarStatus status) { this.status = status; }
    public Boolean getInspectionPassed() { return inspectionPassed; }
    public void setInspectionPassed(Boolean inspectionPassed) { this.inspectionPassed = inspectionPassed; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
