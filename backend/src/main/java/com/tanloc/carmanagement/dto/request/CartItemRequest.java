package com.tanloc.carmanagement.dto.request;

import jakarta.validation.constraints.NotNull;

public class CartItemRequest {

    @NotNull(message = "carId không được để trống")
    private Long carId;

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
}
