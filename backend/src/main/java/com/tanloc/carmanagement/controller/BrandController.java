package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.request.BrandRequest;
import com.tanloc.carmanagement.dto.response.BrandResponse;
import com.tanloc.carmanagement.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBrands() {
        List<BrandResponse> brands = brandService.getAllBrands();
        return ResponseEntity.ok(Map.of("success", true, "data", brands));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBrandById(@PathVariable Long id) {
        BrandResponse brand = brandService.getBrandById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", brand));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBrand(@Valid @RequestBody BrandRequest request) {
        BrandResponse brand = brandService.createBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "data", brand));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBrand(
            @PathVariable Long id,
            @Valid @RequestBody BrandRequest request) {
        BrandResponse brand = brandService.updateBrand(id, request);
        return ResponseEntity.ok(Map.of("success", true, "data", brand));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Xóa hãng xe thành công"));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<Map<String, Object>> getBrandImages(@PathVariable Long id) {
        List<String> images = brandService.getBrandImages(id);
        return ResponseEntity.ok(Map.of("success", true, "data", images));
    }
}
