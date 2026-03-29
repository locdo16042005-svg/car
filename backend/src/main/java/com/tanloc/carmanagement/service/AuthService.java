package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.request.LoginRequest;
import com.tanloc.carmanagement.dto.request.RegisterRequest;
import com.tanloc.carmanagement.dto.response.AuthResponse;
import com.tanloc.carmanagement.entity.Role;
import com.tanloc.carmanagement.entity.User;
import com.tanloc.carmanagement.exception.BusinessException;
import com.tanloc.carmanagement.exception.ResourceNotFoundException;
import com.tanloc.carmanagement.repository.UserRepository;
import com.tanloc.carmanagement.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Mật khẩu không đúng", "INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getFullName());
    }

    public void register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Mật khẩu xác nhận không khớp", "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email đã được sử dụng", "DUPLICATE_ENTRY", HttpStatus.CONFLICT);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Tên đăng nhập đã tồn tại", "DUPLICATE_ENTRY", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
    }
}
