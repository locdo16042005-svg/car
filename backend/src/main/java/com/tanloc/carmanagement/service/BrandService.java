package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.request.BrandRequest;
import com.tanloc.carmanagement.dto.response.BrandResponse;
import com.tanloc.carmanagement.entity.Brand;
import com.tanloc.carmanagement.exception.BusinessException;
import com.tanloc.carmanagement.exception.ResourceNotFoundException;
import com.tanloc.carmanagement.repository.BrandRepository;
import com.tanloc.carmanagement.repository.CarRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    private final BrandRepository brandRepository;
    private final CarRepository carRepository;

    public BrandService(BrandRepository brandRepository, CarRepository carRepository) {
        this.brandRepository = brandRepository;
        this.carRepository = carRepository;
    }

    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = findBrandOrThrow(id);
        return toResponse(brand);
    }

    public BrandResponse createBrand(BrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new BusinessException(
                    "Tên hãng xe '" + request.getName() + "' đã tồn tại",
                    "BRAND_NAME_CONFLICT",
                    HttpStatus.CONFLICT
            );
        }
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());
        brand.setCreatedAt(LocalDateTime.now());
        return toResponse(brandRepository.save(brand));
    }

    public BrandResponse updateBrand(Long id, BrandRequest request) {
        Brand brand = findBrandOrThrow(id);
        if (brandRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new BusinessException(
                    "Tên hãng xe '" + request.getName() + "' đã tồn tại",
                    "BRAND_NAME_CONFLICT",
                    HttpStatus.CONFLICT
            );
        }
        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());
        return toResponse(brandRepository.save(brand));
    }

    public void deleteBrand(Long id) {
        Brand brand = findBrandOrThrow(id);
        if (carRepository.existsByBrandId(id)) {
            throw new BusinessException(
                    "Không thể xóa hãng xe đang có xe liên kết",
                    "BRAND_HAS_CARS",
                    HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
        brandRepository.delete(brand);
    }

    public List<String> getBrandImages(Long id) {
        findBrandOrThrow(id);
        return carRepository.findByBrandId(id).stream()
                .flatMap(car -> car.getImages() != null ? car.getImages().stream() : java.util.stream.Stream.empty())
                .map(image -> image.getImageUrl())
                .collect(Collectors.toList());
    }

    private Brand findBrandOrThrow(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng xe với id: " + id));
    }

    private BrandResponse toResponse(Brand brand) {
        int carCount = brand.getCars() != null ? brand.getCars().size() : 0;
        return new BrandResponse(
                brand.getId(),
                brand.getName(),
                brand.getLogoUrl(),
                brand.getDescription(),
                carCount
        );
    }
}
