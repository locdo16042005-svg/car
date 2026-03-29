package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.request.InspectionRequest;
import com.tanloc.carmanagement.dto.response.InspectionResponse;
import com.tanloc.carmanagement.entity.Car;
import com.tanloc.carmanagement.entity.Inspection;
import com.tanloc.carmanagement.entity.InspectionResult;
import com.tanloc.carmanagement.entity.User;
import com.tanloc.carmanagement.exception.ResourceNotFoundException;
import com.tanloc.carmanagement.repository.CarRepository;
import com.tanloc.carmanagement.repository.InspectionRepository;
import com.tanloc.carmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InspectionService {

    private final InspectionRepository inspectionRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public InspectionService(InspectionRepository inspectionRepository,
                              CarRepository carRepository,
                              UserRepository userRepository) {
        this.inspectionRepository = inspectionRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    public List<InspectionResponse> getInspections(String keyword, LocalDate startDate, LocalDate endDate) {
        List<Inspection> inspections;

        if (keyword != null && !keyword.isBlank()) {
            inspections = inspectionRepository.findByCarNameContainingIgnoreCase(keyword);
        } else if (startDate != null && endDate != null) {
            inspections = inspectionRepository.findByInspectionDateBetween(startDate, endDate);
        } else if (startDate != null) {
            inspections = inspectionRepository.findByInspectionDateBetween(startDate, LocalDate.now());
        } else if (endDate != null) {
            inspections = inspectionRepository.findByInspectionDateBetween(LocalDate.of(2000, 1, 1), endDate);
        } else {
            inspections = inspectionRepository.findAll();
        }

        return inspections.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public InspectionResponse createInspection(InspectionRequest request, Long userId) {
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với id: " + request.getCarId()));

        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + userId));

        Inspection inspection = new Inspection();
        inspection.setCar(car);
        inspection.setInspectionDate(request.getInspectionDate());
        inspection.setResult(request.getResult());
        inspection.setNotes(request.getNotes());
        inspection.setCreatedBy(createdBy);
        inspection.setCreatedAt(LocalDateTime.now());

        Inspection saved = inspectionRepository.save(inspection);

        // Update inspection_passed on the car
        car.setInspectionPassed(request.getResult() == InspectionResult.PASSED);
        carRepository.save(car);

        return toResponse(saved);
    }

    @Transactional
    public InspectionResponse updateInspection(Long id, InspectionRequest request) {
        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu kiểm định với id: " + id));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với id: " + request.getCarId()));

        inspection.setCar(car);
        inspection.setInspectionDate(request.getInspectionDate());
        inspection.setResult(request.getResult());
        inspection.setNotes(request.getNotes());

        Inspection saved = inspectionRepository.save(inspection);

        // Update inspection_passed on the car
        car.setInspectionPassed(request.getResult() == InspectionResult.PASSED);
        carRepository.save(car);

        return toResponse(saved);
    }

    private InspectionResponse toResponse(Inspection inspection) {
        return new InspectionResponse(
                inspection.getId(),
                inspection.getCar().getId(),
                inspection.getCar().getName(),
                inspection.getInspectionDate(),
                inspection.getResult(),
                inspection.getNotes(),
                inspection.getCreatedBy().getId(),
                inspection.getCreatedBy().getFullName(),
                inspection.getCreatedAt()
        );
    }
}
