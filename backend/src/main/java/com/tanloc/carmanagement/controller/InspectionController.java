package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.request.InspectionRequest;
import com.tanloc.carmanagement.dto.response.InspectionResponse;
import com.tanloc.carmanagement.service.InspectionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inspections")
public class InspectionController {

    private final InspectionService inspectionService;

    public InspectionController(InspectionService inspectionService) {
        this.inspectionService = inspectionService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getInspections(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        List<InspectionResponse> inspections = inspectionService.getInspections(keyword, startDate, endDate);
        return ResponseEntity.ok(Map.of("success", true, "data", inspections));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInspection(
            @Valid @RequestBody InspectionRequest request,
            Authentication authentication) {

        Long userId = getUserId(authentication);
        InspectionResponse inspection = inspectionService.createInspection(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "data", inspection));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateInspection(
            @PathVariable Long id,
            @Valid @RequestBody InspectionRequest request) {

        InspectionResponse inspection = inspectionService.updateInspection(id, request);
        return ResponseEntity.ok(Map.of("success", true, "data", inspection));
    }

    private Long getUserId(Authentication authentication) {
        Object details = authentication.getDetails();
        if (details instanceof Long) {
            return (Long) details;
        }
        throw new IllegalStateException("Cannot extract userId from authentication");
    }
}
