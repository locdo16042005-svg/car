package com.tanloc.carmanagement.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Enumerated(EnumType.STRING)
    @Column(name = "car_type", nullable = false)
    private CarType carType;

    @Column(name = "price", nullable = false, precision = 15, scale = 0)
    private BigDecimal price;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "chassis_number", nullable = false, unique = true, length = 100)
    private String chassisNumber;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CarStatus status;

    @Column(name = "inspection_passed")
    private Boolean inspectionPassed;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CarImage> images;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<CarImage> getImages() { return images; }
    public void setImages(List<CarImage> images) { this.images = images; }
}
