package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.response.DashboardResponse;
import com.tanloc.carmanagement.entity.*;
import com.tanloc.carmanagement.repository.CarRepository;
import com.tanloc.carmanagement.repository.OrderRepository;
import com.tanloc.carmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final CarRepository carRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ReportService(CarRepository carRepository, OrderRepository orderRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard() {
        long totalCars = carRepository.count();
        long totalOrders = orderRepository.count();

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);

        List<Order> completedThisMonth = orderRepository.findByStatusAndCreatedAtBetween(
                OrderStatus.COMPLETED, startOfMonth, endOfMonth);

        BigDecimal currentMonthRevenue = completedThisMonth.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long newCustomersThisMonth = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.USER
                        && u.getCreatedAt() != null
                        && !u.getCreatedAt().isBefore(startOfMonth)
                        && u.getCreatedAt().isBefore(endOfMonth))
                .count();

        return new DashboardResponse(totalCars, totalOrders, currentMonthRevenue, newCustomersThisMonth);
    }

    public List<Map<String, Object>> getMonthlyRevenue(int year) {
        LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(year + 1, 1, 1, 0, 0);

        List<Order> completedOrders = orderRepository.findByStatusAndCreatedAtBetween(
                OrderStatus.COMPLETED, start, end);

        Map<Integer, BigDecimal> revenueByMonth = new LinkedHashMap<>();
        for (int m = 1; m <= 12; m++) {
            revenueByMonth.put(m, BigDecimal.ZERO);
        }

        for (Order order : completedOrders) {
            int month = order.getCreatedAt().getMonthValue();
            revenueByMonth.merge(month, order.getTotalPrice(), BigDecimal::add);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        revenueByMonth.forEach((month, revenue) -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", month);
            entry.put("revenue", revenue);
            result.add(entry);
        });
        return result;
    }

    public List<Map<String, Object>> getTopCars(int limit) {
        List<Order> completedOrders = orderRepository.findByStatus(OrderStatus.COMPLETED);

        Map<Long, long[]> carCountMap = new HashMap<>();
        Map<Long, String> carNameMap = new HashMap<>();

        for (Order order : completedOrders) {
            if (order.getItems() == null) continue;
            for (OrderItem item : order.getItems()) {
                Car car = item.getCar();
                long carId = car.getId();
                carCountMap.computeIfAbsent(carId, k -> new long[]{0})[0]++;
                carNameMap.put(carId, car.getName());
            }
        }

        return carCountMap.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue()[0], a.getValue()[0]))
                .limit(limit)
                .map(e -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("carId", e.getKey());
                    entry.put("carName", carNameMap.get(e.getKey()));
                    entry.put("orderCount", e.getValue()[0]);
                    return entry;
                })
                .collect(Collectors.toList());
    }

    public byte[] exportExcel(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<Order> orders = orderRepository.findByCreatedAtBetween(startDate, endDate);

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Orders Report");

            // Header row
            Row header = sheet.createRow(0);
            String[] columns = {"Order Code", "Customer", "Total Price", "Status", "Created At"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            // Data rows
            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(order.getOrderCode());
                row.createCell(1).setCellValue(order.getUser() != null ? order.getUser().getFullName() : "");
                row.createCell(2).setCellValue(order.getTotalPrice().doubleValue());
                row.createCell(3).setCellValue(order.getStatus().name());
                row.createCell(4).setCellValue(order.getCreatedAt().toString());
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
