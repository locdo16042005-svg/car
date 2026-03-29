package com.tanloc.carmanagement.dto.response;

import java.time.LocalDateTime;

public class CustomerResponse {

    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private long orderCount;

    public CustomerResponse() {}

    public CustomerResponse(Long id, String username, String fullName, String email,
                            String phone, Boolean isActive, LocalDateTime createdAt, long orderCount) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.orderCount = orderCount;
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
}
