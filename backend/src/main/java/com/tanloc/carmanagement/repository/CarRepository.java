package com.tanloc.carmanagement.repository;

import com.tanloc.carmanagement.entity.Car;
import com.tanloc.carmanagement.entity.CarType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    boolean existsByBrandId(Long brandId);

    boolean existsByChassisNumber(String chassisNumber);

    boolean existsByChassisNumberAndIdNot(String chassisNumber, Long id);

    List<Car> findByBrandId(Long brandId);

    List<Car> findByCarType(CarType carType);

    Page<Car> findByCarTypeAndBrandIdAndPriceBetweenAndNameContainingIgnoreCase(
            CarType carType, Long brandId,
            BigDecimal minPrice, BigDecimal maxPrice,
            String keyword, Pageable pageable);

    @Query("SELECT c FROM Car c WHERE " +
           "(:carType IS NULL OR c.carType = :carType) AND " +
           "(:brandId IS NULL OR c.brand.id = :brandId) AND " +
           "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Car> searchCars(
            @Param("carType") CarType carType,
            @Param("brandId") Long brandId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable);
}
