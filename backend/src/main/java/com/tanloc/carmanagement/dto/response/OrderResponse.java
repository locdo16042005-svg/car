package com.tanloc.carmanagement.dto.response;

import com.tanloc.carmanagement.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private String orderCode;
    private Long userId;
    private String userFullName;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;

    public OrderResponse() {}

    public OrderResponse(Long id, String orderCode, Long userId, String userFullName,
                         BigDecimal totalPrice, OrderStatus status,
                         LocalDateTime createdAt, LocalDateTime updatedAt,
                         List<OrderItemResponse> items) {
        this.id = id;
        this.orderCode = orderCode;
        this.userId = userId;
        this.userFullName = userFullName;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    public static class OrderItemResponse {
        private Long carId;
        private String carName;
        private java.math.BigDecimal priceAtOrder;

        public OrderItemResponse() {}

        public OrderItemResponse(Long carId, String carName, java.math.BigDecimal priceAtOrder) {
            this.carId = carId;
            this.carName = carName;
            this.priceAtOrder = priceAtOrder;
        }

        public Long getCarId() { return carId; }
        public void setCarId(Long carId) { this.carId = carId; }

        public String getCarName() { return carName; }
        public void setCarName(String carName) { this.carName = carName; }

        public java.math.BigDecimal getPriceAtOrder() { return priceAtOrder; }
        public void setPriceAtOrder(java.math.BigDecimal priceAtOrder) { this.priceAtOrder = priceAtOrder; }
    }
}
