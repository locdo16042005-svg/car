package com.tanloc.carmanagement.dto.response;

import com.tanloc.carmanagement.entity.InspectionResult;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InspectionResponse {

    private Long id;
    private Long carId;
    private String carName;
    private LocalDate inspectionDate;
    private InspectionResult result;
    private String notes;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;

    public InspectionResponse(Long id, Long carId, String carName,
                               LocalDate inspectionDate, InspectionResult result,
                               String notes, Long createdById, String createdByName,
                               LocalDateTime createdAt) {
        this.id = id;
        this.carId = carId;
        this.carName = carName;
        this.inspectionDate = inspectionDate;
        this.result = result;
        this.notes = notes;
        this.createdById = createdById;
        this.createdByName = createdByName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getCarId() { return carId; }
    public String getCarName() { return carName; }
    public LocalDate getInspectionDate() { return inspectionDate; }
    public InspectionResult getResult() { return result; }
    public String getNotes() { return notes; }
    public Long getCreatedById() { return createdById; }
    public String getCreatedByName() { return createdByName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
