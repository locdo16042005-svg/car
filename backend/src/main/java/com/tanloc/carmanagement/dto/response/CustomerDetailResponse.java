package com.tanloc.carmanagement.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CustomerDetailResponse {

    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private long orderCount;
    private List<OrderSummary> orders;

    public CustomerDetailResponse() {}

    public static class OrderSummary {
        private Long id;
        private String orderCode;
        private BigDecimal totalPrice;
        private String status;
        private LocalDateTime createdAt;

        public OrderSummary() {}

        public OrderSummary(Long id, String orderCode, BigDecimal totalPrice, String status, LocalDateTime createdAt) {
            this.id = id;
            this.orderCode = orderCode;
            this.totalPrice = totalPrice;
            this.status = status;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getOrderCode() { return orderCode; }
        public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public long getOrderCount() { return orderCount; }
    public void setOrderCount(long orderCount) { this.orderCount = orderCount; }

    public List<OrderSummary> getOrders() { return orders; }
    public void setOrders(List<OrderSummary> orders) { this.orders = orders; }
}
