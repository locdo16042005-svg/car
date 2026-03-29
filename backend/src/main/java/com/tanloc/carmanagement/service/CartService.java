package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.dto.response.CartItemResponse;
import com.tanloc.carmanagement.entity.Car;
import com.tanloc.carmanagement.entity.CartItem;
import com.tanloc.carmanagement.entity.User;
import com.tanloc.carmanagement.exception.BusinessException;
import com.tanloc.carmanagement.exception.ResourceNotFoundException;
import com.tanloc.carmanagement.repository.CarRepository;
import com.tanloc.carmanagement.repository.CartRepository;
import com.tanloc.carmanagement.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CarRepository carRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    public List<CartItemResponse> getCartItems(Long userId) {
        return cartRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse addToCart(Long userId, Long carId) {
        if (cartRepository.existsByUserIdAndCarId(userId, carId)) {
            throw new BusinessException(
                    "Xe đã có trong giỏ hàng",
                    "CART_ITEM_DUPLICATE",
                    HttpStatus.CONFLICT
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + userId));

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với id: " + carId));

        CartItem item = new CartItem();
        item.setUser(user);
        item.setCar(car);
        item.setAddedAt(LocalDateTime.now());

        CartItem saved = cartRepository.save(item);
        return toResponse(saved);
    }

    @Transactional
    public void removeFromCart(Long userId, Long carId) {
        if (!cartRepository.existsByUserIdAndCarId(userId, carId)) {
            throw new ResourceNotFoundException("Không tìm thấy xe trong giỏ hàng");
        }
        cartRepository.deleteByUserIdAndCarId(userId, carId);
    }

    private CartItemResponse toResponse(CartItem item) {
        Car car = item.getCar();
        String imageUrl = null;
        if (car.getImages() != null && !car.getImages().isEmpty()) {
            imageUrl = car.getImages().get(0).getImageUrl();
        }
        return new CartItemResponse(
                car.getId(),
                car.getName(),
                car.getBrand().getName(),
                car.getPrice(),
                imageUrl,
                item.getAddedAt()
        );
    }
}
