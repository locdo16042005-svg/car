package com.tanloc.carmanagement.dto.request;

import com.tanloc.carmanagement.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusRequest {

    @NotNull(message = "Trạng thái không được để trống")
    private OrderStatus status;

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
