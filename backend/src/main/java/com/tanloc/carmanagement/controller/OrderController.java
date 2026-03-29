package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.request.OrderStatusRequest;
import com.tanloc.carmanagement.dto.response.OrderResponse;
import com.tanloc.carmanagement.entity.OrderStatus;
import com.tanloc.carmanagement.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            Authentication authentication) {

        String role = authentication.getAuthorities().iterator().next().getAuthority();
        Long userId = getUserId(authentication);

        List<OrderResponse> orders = orderService.getOrders(role, userId, status, startDate, endDate);
        return ResponseEntity.ok(Map.of("success", true, "data", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", order));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(Authentication authentication) {
        Long userId = getUserId(authentication);
        OrderResponse order = orderService.createOrder(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "data", order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusRequest request) {
        OrderResponse order = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(Map.of("success", true, "data", order));
    }

    private Long getUserId(Authentication authentication) {
        Object details = authentication.getDetails();
        if (details instanceof Long) {
            return (Long) details;
        }
        throw new IllegalStateException("Cannot extract userId from authentication");
    }
}
