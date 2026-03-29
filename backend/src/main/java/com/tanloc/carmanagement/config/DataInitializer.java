package com.tanloc.carmanagement.config;

import com.tanloc.carmanagement.entity.Brand;
import com.tanloc.carmanagement.entity.Role;
import com.tanloc.carmanagement.entity.User;
import com.tanloc.carmanagement.repository.BrandRepository;
import com.tanloc.carmanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BrandRepository brandRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, BrandRepository brandRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.brandRepository = brandRepository;
    }

    @Override
    public void run(String... args) {
        // Seed admin account
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrator");
            admin.setEmail("admin@tanloc.com");
            admin.setPhone("0900000000");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println(">>> Admin account created: admin / admin123");
        }

        // Seed brands
        List<String[]> brands = List.of(
            new String[]{"BMW", "Thương hiệu xe sang Đức, nổi tiếng với hiệu suất và công nghệ tiên tiến"},
            new String[]{"Mercedes-Benz", "Biểu tượng xe sang trọng hàng đầu thế giới đến từ Đức"},
            new String[]{"Toyota", "Hãng xe Nhật Bản uy tín, bền bỉ và tiết kiệm nhiên liệu"},
            new String[]{"Ferrari", "Siêu xe Ý huyền thoại, biểu tượng của tốc độ và đam mê"},
            new String[]{"Lamborghini", "Siêu xe Ý với thiết kế góc cạnh và hiệu suất đỉnh cao"},
            new String[]{"Porsche", "Xe thể thao Đức kết hợp hoàn hảo giữa sang trọng và hiệu suất"},
            new String[]{"Audi", "Xe Đức với công nghệ quattro và thiết kế tinh tế"},
            new String[]{"Rolls-Royce", "Đỉnh cao của xe siêu sang, biểu tượng đẳng cấp toàn cầu"},
            new String[]{"Bentley", "Xe siêu sang Anh Quốc, kết hợp thủ công mỹ nghệ và hiệu suất"},
            new String[]{"McLaren", "Siêu xe Anh Quốc với công nghệ F1 ứng dụng trên đường phố"}
        );

        for (String[] b : brands) {
            if (!brandRepository.existsByName(b[0])) {
                Brand brand = new Brand();
                brand.setName(b[0]);
                brand.setDescription(b[1]);
                brand.setCreatedAt(LocalDateTime.now());
                brandRepository.save(brand);
            }
        }
        System.out.println(">>> Brands seeded successfully");
    }
}
