package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.request.CarRequest;
import com.tanloc.carmanagement.dto.response.CarResponse;
import com.tanloc.carmanagement.entity.*;
import com.tanloc.carmanagement.exception.BusinessException;
import com.tanloc.carmanagement.exception.ResourceNotFoundException;
import com.tanloc.carmanagement.repository.BrandRepository;
import com.tanloc.carmanagement.repository.CarRepository;
import com.tanloc.carmanagement.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final BrandRepository brandRepository;
    private final OrderRepository orderRepository;

    public CarService(CarRepository carRepository,
                      BrandRepository brandRepository,
                      OrderRepository orderRepository) {
        this.carRepository = carRepository;
        this.brandRepository = brandRepository;
        this.orderRepository = orderRepository;
    }

    public Page<CarResponse> searchCars(CarType carType, Long brandId, String keyword,
                                        BigDecimal minPrice, BigDecimal maxPrice,
                                        int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.searchCars(carType, brandId, minPrice, maxPrice, keyword, pageable)
                .map(this::toResponse);
    }

    public CarResponse getCarById(Long id) {
        Car car = findCarOrThrow(id);
        return toResponse(car);
    }

    @Transactional
    public CarResponse createCar(CarRequest request) {
        if (carRepository.existsByChassisNumber(request.getChassisNumber())) {
            throw new BusinessException(
                    "Số khung xe '" + request.getChassisNumber() + "' đã tồn tại",
                    "CHASSIS_NUMBER_CONFLICT",
                    HttpStatus.CONFLICT
            );
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng xe với id: " + request.getBrandId()));

        Car car = new Car();
        car.setName(request.getName());
        car.setBrand(brand);
        car.setCarType(request.getCarType());
        car.setPrice(request.getPrice());
        car.setYear(request.getYear());
        car.setChassisNumber(request.getChassisNumber());
        car.setColor(request.getColor());
        car.setDescription(request.getDescription());
        car.setStatus(CarStatus.AVAILABLE);
        car.setInspectionPassed(false);
        car.setCreatedAt(LocalDateTime.now());

        Car saved = carRepository.save(car);
        saveImages(saved, request.getImageUrls());

        return toResponse(carRepository.findById(saved.getId()).orElse(saved));
    }

    @Transactional
    public CarResponse updateCar(Long id, CarRequest request) {
        Car car = findCarOrThrow(id);

        if (carRepository.existsByChassisNumberAndIdNot(request.getChassisNumber(), id)) {
            throw new BusinessException(
                    "Số khung xe '" + request.getChassisNumber() + "' đã tồn tại",
                    "CHASSIS_NUMBER_CONFLICT",
                    HttpStatus.CONFLICT
            );
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng xe với id: " + request.getBrandId()));

        car.setName(request.getName());
        car.setBrand(brand);
        car.setCarType(request.getCarType());
        car.setPrice(request.getPrice());
        car.setYear(request.getYear());
        car.setChassisNumber(request.getChassisNumber());
        car.setColor(request.getColor());
        car.setDescription(request.getDescription());

        // Replace images
        if (car.getImages() != null) {
            car.getImages().clear();
        }
        Car saved = carRepository.save(car);
        saveImages(saved, request.getImageUrls());

        return toResponse(carRepository.findById(saved.getId()).orElse(saved));
    }

    @Transactional
    public void deleteCar(Long id) {
        Car car = findCarOrThrow(id);

        if (orderRepository.existsActiveOrderForCar(id)) {
            throw new BusinessException(
                    "Không thể xóa xe đang có đơn hàng đang xử lý",
                    "CAR_HAS_ACTIVE_ORDERS",
                    HttpStatus.UNPROCESSABLE_ENTITY
            );
        }

        carRepository.delete(car);
    }

    private void saveImages(Car car, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) return;
        List<CarImage> images = new java.util.ArrayList<>();
        for (int i = 0; i < imageUrls.size(); i++) {
            CarImage img = new CarImage();
            img.setCar(car);
            img.setImageUrl(imageUrls.get(i));
            img.setIsPrimary(i == 0);
            img.setSortOrder(i);
            images.add(img);
        }
        if (car.getImages() == null) {
            car.setImages(images);
        } else {
            car.getImages().addAll(images);
        }
        carRepository.save(car);
    }

    private Car findCarOrThrow(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với id: " + id));
    }

    private CarResponse toResponse(Car car) {
        List<String> imageUrls = car.getImages() != null
                ? car.getImages().stream().map(CarImage::getImageUrl).collect(Collectors.toList())
                : List.of();

        return new CarResponse(
                car.getId(),
                car.getName(),
                car.getBrand().getId(),
                car.getBrand().getName(),
                car.getCarType(),
                car.getPrice(),
                car.getYear(),
                car.getColor(),
                car.getChassisNumber(),
                car.getDescription(),
                car.getStatus(),
                car.getInspectionPassed(),
                imageUrls,
                car.getCreatedAt()
        );
    }
}
