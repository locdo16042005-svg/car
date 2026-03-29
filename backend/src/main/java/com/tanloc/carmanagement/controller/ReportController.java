package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.response.DashboardResponse;
import com.tanloc.carmanagement.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        DashboardResponse data = reportService.getDashboard();
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenue(
            @RequestParam(defaultValue = "0") int year) {
        int targetYear = year > 0 ? year : Year.now().getValue();
        List<Map<String, Object>> data = reportService.getMonthlyRevenue(targetYear);
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @GetMapping("/top-cars")
    public ResponseEntity<Map<String, Object>> getTopCars(
            @RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> data = reportService.getTopCars(limit);
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) throws IOException {

        if (startDate == null) startDate = LocalDateTime.now().minusMonths(1);
        if (endDate == null) endDate = LocalDateTime.now();

        byte[] excelBytes = reportService.exportExcel(startDate, endDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"report.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
