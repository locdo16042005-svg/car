package com.tanloc.carmanagement.repository;

import com.tanloc.carmanagement.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    Optional<CartItem> findByUserIdAndCarId(Long userId, Long carId);

    boolean existsByUserIdAndCarId(Long userId, Long carId);

    @Transactional
    void deleteByUserIdAndCarId(Long userId, Long carId);
}
