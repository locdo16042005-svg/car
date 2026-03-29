package com.tanloc.carmanagement.dto.request;

import com.tanloc.carmanagement.entity.InspectionResult;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class InspectionRequest {

    @NotNull(message = "carId không được để trống")
    private Long carId;

    @NotNull(message = "inspectionDate không được để trống")
    private LocalDate inspectionDate;

    @NotNull(message = "result không được để trống")
    private InspectionResult result;

    private String notes;

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }

    public LocalDate getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDate inspectionDate) { this.inspectionDate = inspectionDate; }

    public InspectionResult getResult() { return result; }
    public void setResult(InspectionResult result) { this.result = result; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
