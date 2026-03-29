package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.dto.request.LoginRequest;
import com.tanloc.carmanagement.dto.request.RegisterRequest;
import com.tanloc.carmanagement.dto.response.AuthResponse;
import com.tanloc.carmanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", authResponse
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Đăng ký thành công"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đăng xuất thành công"
        ));
    }
}
