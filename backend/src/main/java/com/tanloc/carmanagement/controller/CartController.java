package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.request.CartItemRequest;
import com.tanloc.carmanagement.dto.response.CartItemResponse;
import com.tanloc.carmanagement.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<?> getCart(Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        List<CartItemResponse> items = cartService.getCartItems(userId);
        return ResponseEntity.ok(Map.of("success", true, "data", items));
    }

    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartItemRequest request,
                                       Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        CartItemResponse item = cartService.addToCart(userId, request.getCarId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "data", item));
    }

    @DeleteMapping("/items/{carId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long carId,
                                            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        cartService.removeFromCart(userId, carId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa xe khỏi giỏ hàng"));
    }
}
