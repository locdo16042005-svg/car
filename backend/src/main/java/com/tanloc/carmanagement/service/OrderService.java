package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.response.OrderResponse;
import com.tanloc.carmanagement.entity.*;
import com.tanloc.carmanagement.exception.BusinessException;
import com.tanloc.carmanagement.exception.ResourceNotFoundException;
import com.tanloc.carmanagement.repository.CartRepository;
import com.tanloc.carmanagement.repository.OrderItemRepository;
import com.tanloc.carmanagement.repository.OrderRepository;
import com.tanloc.carmanagement.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository,
                        OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String role, Long userId,
                                         OrderStatus status,
                                         LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime end = endDate != null ? endDate.atTime(23, 59, 59) : null;

        List<Order> orders;

        if ("ROLE_ADMIN".equals(role)) {
            // Admin sees all orders
            if (status != null && start != null) {
                orders = orderRepository.findByStatusAndCreatedAtBetween(status, start, end);
            } else if (status != null) {
                orders = orderRepository.findByStatus(status);
            } else if (start != null) {
                orders = orderRepository.findByCreatedAtBetween(start, end);
            } else {
                orders = orderRepository.findAll();
            }
        } else {
            // User sees only their own orders
            if (status != null && start != null) {
                orders = orderRepository.findByUserIdAndStatusAndCreatedAtBetween(userId, status, start, end);
            } else if (status != null) {
                orders = orderRepository.findByUserIdAndStatus(userId, status);
            } else if (start != null) {
                orders = orderRepository.findByUserIdAndCreatedAtBetween(userId, start, end);
            } else {
                orders = orderRepository.findByUserId(userId);
            }
        }

        return orders.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = findOrderOrThrow(id);
        return toResponse(order);
    }

    @Transactional
    public OrderResponse createOrder(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + userId));

        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BusinessException(
                    "Giỏ hàng trống, không thể tạo đơn hàng",
                    "CART_EMPTY",
                    HttpStatus.UNPROCESSABLE_ENTITY
            );
        }

        // Generate order code: "TL" + timestamp
        String orderCode = "TL" + System.currentTimeMillis();

        // Calculate total price
        BigDecimal totalPrice = cartItems.stream()
                .map(item -> item.getCar().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDateTime now = LocalDateTime.now();

        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setUser(user);
        order.setTotalPrice(totalPrice);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(now);
        order.setUpdatedAt(now);

        Order savedOrder = orderRepository.save(order);

        // Create and save order items individually
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setCar(cartItem.getCar());
            orderItem.setPriceAtOrder(cartItem.getCar().getPrice());
            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);
        }
        savedOrder.setItems(orderItems);
        Order finalOrder = orderRepository.save(savedOrder);

        // Clear cart
        for (CartItem cartItem : cartItems) {
            cartRepository.deleteByUserIdAndCarId(userId, cartItem.getCar().getId());
        }

        return toResponse(finalOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = findOrderOrThrow(id);

        if (order.getStatus() == OrderStatus.COMPLETED && newStatus == OrderStatus.CANCELLED) {
            throw new BusinessException(
                    "Không thể hủy đơn hàng đã hoàn thành",
                    "INVALID_STATUS_TRANSITION",
                    HttpStatus.UNPROCESSABLE_ENTITY
            );
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    private Order findOrderOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + id));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems() != null
                ? order.getItems().stream()
                    .map(item -> new OrderResponse.OrderItemResponse(
                            item.getCar().getId(),
                            item.getCar().getName(),
                            item.getPriceAtOrder()))
                    .collect(Collectors.toList())
                : List.of();

        return new OrderResponse(
                order.getId(),
                order.getOrderCode(),
                order.getUser().getId(),
                order.getUser().getFullName(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                itemResponses
        );
    }
}
