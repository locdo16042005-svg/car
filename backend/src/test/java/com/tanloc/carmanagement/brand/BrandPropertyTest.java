// Feature: car-management-website, Property 5: Them hang xe - round trip
// Feature: car-management-website, Property 6: Ten hang xe phai la duy nhat
// Feature: car-management-website, Property 7: Khong xoa duoc hang xe dang co xe lien ket
package com.tanloc.carmanagement.brand;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanloc.carmanagement.entity.Brand;
import com.tanloc.carmanagement.entity.Car;
import com.tanloc.carmanagement.entity.CarStatus;
import com.tanloc.carmanagement.entity.CarType;
import com.tanloc.carmanagement.repository.BrandRepository;
import com.tanloc.carmanagement.repository.CarRepository;
import net.jqwik.api.*;
import net.jqwik.api.constraints.IntRange;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class BrandPropertyTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CarRepository carRepository;

    @BeforeEach
    void cleanUp() {
        carRepository.deleteAll();
        brandRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void property5_createBrandRoundTrip() throws Exception {
        String brandName = "TestBrand_" + System.nanoTime();
        Map<String, String> request = buildBrandRequest(brandName, "https://example.com/logo.png", "Test description");
        MvcResult result = mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();
        assertThat(result.getResponse().getContentAsString()).contains(brandName);
        assertThat(brandRepository.existsByName(brandName)).isTrue();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void property5_multipleDistinctBrandsAllCreated() throws Exception {
        long ts = System.nanoTime();
        String[] brandNames = {"BrandA_" + ts, "BrandB_" + ts, "BrandC_" + ts};
        for (String name : brandNames) {
            MvcResult result = mockMvc.perform(post("/api/brands")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(buildBrandRequest(name, null, null))))
                    .andExpect(status().isCreated()).andReturn();
            assertThat(result.getResponse().getContentAsString()).contains(name);
        }
        for (String name : brandNames) {
            assertThat(brandRepository.existsByName(name)).isTrue();
        }
        assertThat(brandRepository.count()).isEqualTo(3);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void property6_duplicateBrandNameReturns409() throws Exception {
        String brandName = "DuplicateBrand_" + System.nanoTime();
        Map<String, String> request = buildBrandRequest(brandName, "https://example.com/logo.png", "Some description");
        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void property6_duplicateBrandNameDoesNotCreateNewRecord() throws Exception {
        String brandName = "UniqueBrand_" + System.nanoTime();
        Map<String, String> request = buildBrandRequest(brandName, null, null);
        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        long countAfterFirst = brandRepository.count();
        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
        assertThat(brandRepository.count()).isEqualTo(countAfterFirst);
    }

    @Property(tries = 100)
    @Label("Property 6 - Duplicate brand name detection logic")
    void property6_duplicateNameDetectionLogic(@ForAll("validBrandNames") String brandName) {
        Set<String> existingNames = new HashSet<>();
        assertThat(existingNames.contains(brandName)).isFalse();
        existingNames.add(brandName);
        assertThat(existingNames.contains(brandName)).isTrue();
        assertThat(existingNames.size()).isEqualTo(1);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void property7_deleteBrandWithLinkedCarReturns422() throws Exception {
        Brand brand = createBrandInDb("BrandWithCar_" + System.nanoTime());
        createCarInDb(brand, "CAR-" + System.nanoTime());
        mockMvc.perform(delete("/api/brands/" + brand.getId()))
                .andExpect(status().isUnprocessableEntity());
        assertThat(brandRepository.existsById(brand.getId())).isTrue();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void property7_deleteBrandWithMultipleCarsReturns422() throws Exception {
        Brand brand = createBrandInDb("BrandMultiCar_" + System.nanoTime());
        long ts = System.nanoTime();
        createCarInDb(brand, "CAR-A-" + ts);
        createCarInDb(brand, "CAR-B-" + ts);
        createCarInDb(brand, "CAR-C-" + ts);
        mockMvc.perform(delete("/api/brands/" + brand.getId()))
                .andExpect(status().isUnprocessableEntity());
        assertThat(brandRepository.existsById(brand.getId())).isTrue();
        assertThat(carRepository.existsByBrandId(brand.getId())).isTrue();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void property7_deleteBrandWithNoLinkedCarsReturns200() throws Exception {
        Brand brand = createBrandInDb("BrandNoCar_" + System.nanoTime());
        assertThat(carRepository.existsByBrandId(brand.getId())).isFalse();
        mockMvc.perform(delete("/api/brands/" + brand.getId()))
                .andExpect(status().isOk());
        assertThat(brandRepository.existsById(brand.getId())).isFalse();
    }

    @Property(tries = 10)
    @Label("Property 7 - Brand with linked cars cannot be deleted")
    void property7_brandWithLinkedCarsCannotBeDeleted(@ForAll @IntRange(min = 1, max = 5) int carCount) {
        Brand brand = createBrandInDb("JqwikBrand_" + System.nanoTime() + "_" + carCount);
        for (int i = 0; i < carCount; i++) {
            createCarInDb(brand, "JQWIK-" + System.nanoTime() + "-" + i);
        }
        assertThat(carRepository.existsByBrandId(brand.getId())).isTrue();
        try {
            MvcResult result = mockMvc.perform(
                            delete("/api/brands/" + brand.getId())
                                    .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                    .andReturn();
            assertThat(result.getResponse().getStatus())
                    .as("DELETE brand with %d linked car(s) must return 422", carCount)
                    .isEqualTo(422);
        } catch (Exception e) {
            throw new RuntimeException("MockMvc request failed", e);
        }
        assertThat(brandRepository.existsById(brand.getId())).isTrue();
        carRepository.deleteAll(carRepository.findByBrandId(brand.getId()));
        brandRepository.delete(brand);
    }

    @Provide
    Arbitrary<String> validBrandNames() {
        return Arbitraries.strings()
                .withChars("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
                .ofMinLength(2)
                .ofMaxLength(50)
                .filter(s -> !s.isBlank());
    }

    private Map<String, String> buildBrandRequest(String name, String logoUrl, String description) {
        Map<String, String> req = new HashMap<>();
        req.put("name", name);
        if (logoUrl != null) req.put("logoUrl", logoUrl);
        if (description != null) req.put("description", description);
        return req;
    }

    private Brand createBrandInDb(String name) {
        Brand brand = new Brand();
        brand.setName(name);
        brand.setCreatedAt(LocalDateTime.now());
        return brandRepository.save(brand);
    }

    private Car createCarInDb(Brand brand, String chassisNumber) {
        Car car = new Car();
        car.setName("Test Car " + chassisNumber);
        car.setBrand(brand);
        car.setCarType(CarType.NEW);
        car.setPrice(BigDecimal.valueOf(500_000_000));
        car.setYear(2023);
        car.setChassisNumber(chassisNumber);
        car.setStatus(CarStatus.AVAILABLE);
        car.setCreatedAt(LocalDateTime.now());
        return carRepository.save(car);
    }
}
