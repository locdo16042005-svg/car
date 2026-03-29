package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.response.CustomerDetailResponse;
import com.tanloc.carmanagement.dto.response.CustomerResponse;
import com.tanloc.carmanagement.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCustomers(
            @RequestParam(required = false) String search) {
        List<CustomerResponse> customers = customerService.getCustomers(search);
        return ResponseEntity.ok(Map.of("success", true, "data", customers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCustomerById(@PathVariable Long id) {
        CustomerDetailResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", customer));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<Map<String, Object>> toggleActive(@PathVariable Long id) {
        CustomerResponse customer = customerService.toggleActive(id);
        return ResponseEntity.ok(Map.of("success", true, "data", customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Xóa khách hàng thành công"));
    }
}
