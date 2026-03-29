package com.tanloc.carmanagement.dto.response;

import java.math.BigDecimal;

public class DashboardResponse {
    private long totalCars;
    private long totalOrders;
    private BigDecimal currentMonthRevenue;
    private long newCustomersThisMonth;

    public DashboardResponse() {}

    public DashboardResponse(long totalCars, long totalOrders, BigDecimal currentMonthRevenue, long newCustomersThisMonth) {
        this.totalCars = totalCars;
        this.totalOrders = totalOrders;
        this.currentMonthRevenue = currentMonthRevenue;
        this.newCustomersThisMonth = newCustomersThisMonth;
    }

    public long getTotalCars() { return totalCars; }
    public void setTotalCars(long totalCars) { this.totalCars = totalCars; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public BigDecimal getCurrentMonthRevenue() { return currentMonthRevenue; }
    public void setCurrentMonthRevenue(BigDecimal currentMonthRevenue) { this.currentMonthRevenue = currentMonthRevenue; }
    public long getNewCustomersThisMonth() { return newCustomersThisMonth; }
    public void setNewCustomersThisMonth(long newCustomersThisMonth) { this.newCustomersThisMonth = newCustomersThisMonth; }
}
