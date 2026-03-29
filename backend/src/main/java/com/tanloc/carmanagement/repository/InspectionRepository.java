package com.tanloc.carmanagement.repository;

import com.tanloc.carmanagement.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {

    List<Inspection> findByCarId(Long carId);

    List<Inspection> findByInspectionDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT i FROM Inspection i WHERE LOWER(i.car.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Inspection> findByCarNameContainingIgnoreCase(@Param("keyword") String keyword);
}
