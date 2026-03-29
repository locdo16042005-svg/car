package com.tanloc.carmanagement.dto.request;

import com.tanloc.carmanagement.entity.CarType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public class CarRequest {

    @NotBlank(message = "Tên xe không được để trống")
    private String name;

    @NotNull(message = "Hãng xe không được để trống")
    private Long brandId;

    @NotNull(message = "Loại xe không được để trống")
    private CarType carType;

    @NotNull(message = "Giá xe không được để trống")
    @Positive(message = "Giá xe phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Năm sản xuất không được để trống")
    private Integer year;

    @NotBlank(message = "Số khung xe không được để trống")
    private String chassisNumber;

    private String color;
    private String description;
    private List<String> imageUrls;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }
    public CarType getCarType() { return carType; }
    public void setCarType(CarType carType) { this.carType = carType; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getChassisNumber() { return chassisNumber; }
    public void setChassisNumber(String chassisNumber) { this.chassisNumber = chassisNumber; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
