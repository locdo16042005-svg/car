package com.tanloc.carmanagement.repository;

import com.tanloc.carmanagement.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    long countByName(String name);
}
