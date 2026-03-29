package com.tanloc.carmanagement.repository;

import com.tanloc.carmanagement.entity.Order;
import com.tanloc.carmanagement.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(OrderStatus status);

    boolean existsByItemsCarIdAndStatusNotIn(Long carId, List<OrderStatus> statuses);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i " +
           "WHERE i.car.id = :carId AND o.status NOT IN ('COMPLETED', 'CANCELLED')")
    boolean existsActiveOrderForCar(@Param("carId") Long carId);

    boolean existsByUserIdAndStatusNotIn(Long userId, List<OrderStatus> statuses);

    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Order> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status AND o.createdAt BETWEEN :start AND :end")
    List<Order> findByUserIdAndStatusAndCreatedAtBetween(
            @Param("userId") Long userId,
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt BETWEEN :start AND :end")
    List<Order> findByStatusAndCreatedAtBetween(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
