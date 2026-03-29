package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.request.CarRequest;
import com.tanloc.carmanagement.dto.response.CarResponse;
import com.tanloc.carmanagement.entity.CarType;
import com.tanloc.carmanagement.service.CarService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCars(
            @RequestParam(required = false) CarType type,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<CarResponse> result = carService.searchCars(type, brandId, keyword, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages(),
                "page", result.getNumber(),
                "size", result.getSize()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCarById(@PathVariable Long id) {
        CarResponse car = carService.getCarById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", car));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCar(@Valid @RequestBody CarRequest request) {
        CarResponse car = carService.createCar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "data", car));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarRequest request) {
        CarResponse car = carService.updateCar(id, request);
        return ResponseEntity.ok(Map.of("success", true, "data", car));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Xóa xe thành công"));
    }
}
