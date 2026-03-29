package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.response.CustomerDetailResponse;
import com.tanloc.carmanagement.dto.response.CustomerResponse;
import com.tanloc.carmanagement.entity.Order;
import com.tanloc.carmanagement.entity.OrderStatus;
import com.tanloc.carmanagement.entity.Role;
import com.tanloc.carmanagement.entity.User;
import com.tanloc.carmanagement.exception.BusinessException;
import com.tanloc.carmanagement.exception.ResourceNotFoundException;
import com.tanloc.carmanagement.repository.OrderRepository;
import com.tanloc.carmanagement.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public CustomerService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<CustomerResponse> getCustomers(String search) {
        List<User> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search);
        } else {
            users = userRepository.findAll();
        }
        return users.stream()
                .filter(u -> u.getRole() == Role.USER)
                .map(this::toCustomerResponse)
                .collect(Collectors.toList());
    }

    public CustomerDetailResponse getCustomerById(Long id) {
        User user = findUserById(id);
        List<Order> orders = orderRepository.findByUserId(id);
        return toCustomerDetailResponse(user, orders);
    }

    public CustomerResponse toggleActive(Long id) {
        User user = findUserById(id);
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        List<Order> orders = orderRepository.findByUserId(id);
        return toCustomerResponse(user, orders.size());
    }

    public void deleteCustomer(Long id) {
        User user = findUserById(id);
        List<OrderStatus> terminalStatuses = List.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED);
        boolean hasActiveOrders = orderRepository.existsByUserIdAndStatusNotIn(id, terminalStatuses);
        if (hasActiveOrders) {
            throw new BusinessException(
                    "Không thể xóa khách hàng vì còn đơn hàng chưa hoàn thành",
                    "CUSTOMER_HAS_ACTIVE_ORDERS",
                    HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
        userRepository.delete(user);
    }

    // --- helpers ---

    private User findUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng với id: " + id));
        if (user.getRole() != Role.USER) {
            throw new ResourceNotFoundException("Không tìm thấy khách hàng với id: " + id);
        }
        return user;
    }

    private CustomerResponse toCustomerResponse(User user) {
        long orderCount = orderRepository.findByUserId(user.getId()).size();
        return toCustomerResponse(user, orderCount);
    }

    private CustomerResponse toCustomerResponse(User user, long orderCount) {
        return new CustomerResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsActive(),
                user.getCreatedAt(),
                orderCount
        );
    }

    private CustomerDetailResponse toCustomerDetailResponse(User user, List<Order> orders) {
        CustomerDetailResponse response = new CustomerDetailResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setOrderCount(orders.size());

        List<CustomerDetailResponse.OrderSummary> summaries = orders.stream()
                .map(o -> new CustomerDetailResponse.OrderSummary(
                        o.getId(),
                        o.getOrderCode(),
                        o.getTotalPrice(),
                        o.getStatus().name(),
                        o.getCreatedAt()
                ))
                .collect(Collectors.toList());
        response.setOrders(summaries);
        return response;
    }
}
