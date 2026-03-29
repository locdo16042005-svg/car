package com.tanloc.carmanagement.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanloc.carmanagement.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;
    private final ObjectMapper objectMapper;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          UserDetailsService userDetailsService,
                          CorsConfigurationSource corsConfigurationSource,
                          ObjectMapper objectMapper) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
        this.corsConfigurationSource = corsConfigurationSource;
        this.objectMapper = objectMapper;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints — no authentication required
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/cars", "/api/cars/**", "/uploads/**").permitAll()

                // Admin-only endpoints
                .requestMatchers("/api/brands/**").hasRole("ADMIN")
                .requestMatchers("/api/customers/**").hasRole("ADMIN")
                .requestMatchers("/api/reports/**").hasRole("ADMIN")
                .requestMatchers("/api/upload/**").hasRole("ADMIN")
                .requestMatchers("/api/inspections/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/cars").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/cars/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/cars/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/orders/*/status").hasRole("ADMIN")

                // User endpoints (authenticated users)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/orders", "/api/orders/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/orders").hasAnyRole("USER", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/cart").hasRole("USER")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/cart/**").hasRole("USER")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/cart/**").hasRole("USER")

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    Map<String, Object> body = Map.of(
                            "success", false,
                            "message", "Vui lòng đăng nhập để tiếp tục",
                            "code", "UNAUTHORIZED"
                    );
                    objectMapper.writeValue(response.getWriter(), body);
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    Map<String, Object> body = Map.of(
                            "success", false,
                            "message", "Bạn không có quyền truy cập trang này",
                            "code", "FORBIDDEN"
                    );
                    objectMapper.writeValue(response.getWriter(), body);
                })
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
