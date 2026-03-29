package com.tanloc.carmanagement.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CartItemResponse {

    private Long carId;
    private String carName;
    private String brandName;
    private BigDecimal price;
    private String imageUrl;
    private LocalDateTime addedAt;

    public CartItemResponse(Long carId, String carName, String brandName,
                            BigDecimal price, String imageUrl, LocalDateTime addedAt) {
        this.carId = carId;
        this.carName = carName;
        this.brandName = brandName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.addedAt = addedAt;
    }

    public Long getCarId() { return carId; }
    public String getCarName() { return carName; }
    public String getBrandName() { return brandName; }
    public BigDecimal getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getAddedAt() { return addedAt; }
}
