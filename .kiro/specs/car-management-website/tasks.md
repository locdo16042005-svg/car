# Kế Hoạch Triển Khai: Car Management Website (Tân Lộc)

## Tổng Quan

Triển khai hệ thống web quản lý xe Tân Lộc theo kiến trúc full-stack: Java Spring Boot (backend REST API) + React JS (frontend SPA) + MySQL (database). Các task được sắp xếp theo thứ tự phụ thuộc, từ cơ sở hạ tầng đến tính năng nghiệp vụ.

## Tasks

- [x] 1. Khởi tạo dự án Backend (Spring Boot)
  - Tạo project Spring Boot với Spring Initializr: dependencies gồm Spring Web, Spring Security, Spring Data JPA, MySQL Driver, Lombok, Validation
  - Cấu hình `application.properties`: datasource MySQL (XAMPP), JWT secret, upload dir, CORS
  - Tạo cấu trúc package: `controller`, `service`, `repository`, `entity`, `dto/request`, `dto/response`, `security`, `config`, `exception`
  - Cấu hình `CorsConfig.java` cho phép origin `http://localhost:3000`
  - Cấu hình `WebMvcConfig.java` để serve static files từ `/uploads/**`
  - _Yêu cầu: 1.1, 2.5_

- [x] 2. Khởi tạo dự án Frontend (React JS)
  - Tạo project React với Create React App hoặc Vite
  - Cài đặt dependencies: `axios`, `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `recharts` (biểu đồ)
  - Tạo cấu trúc thư mục: `api`, `components/layout`, `components/common`, `components/forms`, `pages/auth`, `pages/admin`, `pages/user`, `store`, `hooks`, `utils`, `routes`
  - Tạo `axiosInstance.js` với interceptor tự động gắn JWT header và xử lý lỗi 401/403
  - _Yêu cầu: 1.2, 1.4_

- [x] 3. Thiết kế Database và tạo Entities
  - [x] 3.1 Chạy DDL script tạo database `tanloc_car_db` và các bảng: `users`, `brands`, `cars`, `car_images`, `orders`, `order_items`, `cart_items`, `inspections`
    - Tạo file `schema.sql` trong `src/main/resources/` chứa toàn bộ DDL
    - _Yêu cầu: 3.1, 4.1, 6.1, 7.1, 8.1_

  - [x] 3.2 Tạo JPA Entities: `User`, `Brand`, `Car`, `CarImage`, `Order`, `OrderItem`, `CartItem`, `Inspection`
    - Mỗi entity ánh xạ đúng bảng, đúng quan hệ (`@ManyToOne`, `@OneToMany`, `@Enumerated`)
    - Tạo các enum: `Role` (ADMIN/USER), `CarType` (NEW/USED), `CarStatus` (AVAILABLE/SOLD/RESERVED), `OrderStatus` (PENDING/CONFIRMED/PROCESSING/COMPLETED/CANCELLED), `InspectionResult` (PASSED/FAILED)
    - _Yêu cầu: 2.1, 4.2, 7.2_

  - [x] 3.3 Tạo JPA Repositories: `UserRepository`, `BrandRepository`, `CarRepository`, `OrderRepository`, `CartRepository`, `InspectionRepository`
    - Thêm các custom query method cần thiết: `findByUsername`, `findByEmail`, `findByChassisNumber`, `findByBrandId`, `findByCarType`, `existsByChassisNumber`, `existsByName`
    - _Yêu cầu: 3.4, 4.6, 6.2_

- [x] 4. Xác thực và Phân quyền (JWT)
  - [x] 4.1 Tạo `JwtUtil.java`: generate token (HS256, 24h, claims: userId/username/role), validate token, extract claims
    - _Yêu cầu: 1.2, 2.5_

  - [x] 4.2 Tạo `JwtAuthenticationFilter.java`: filter mỗi request, validate token, set SecurityContext
    - Trả về 401 nếu token thiếu, hết hạn, hoặc không hợp lệ
    - _Yêu cầu: 1.4, 1.6_

  - [x] 4.3 Tạo `UserDetailsServiceImpl.java` và cấu hình `SecurityConfig.java`
    - Cấu hình BCrypt password encoder
    - Phân quyền endpoint: admin-only routes yêu cầu role ADMIN, public routes không cần auth
    - Trả về 403 khi USER truy cập admin endpoint
    - _Yêu cầu: 2.2, 2.3, 2.4_

  - [x] 4.4 Viết property test cho Property 1: Đăng nhập hợp lệ trả về token chứa đúng role
    - **Property 1: Đăng nhập hợp lệ trả về token chứa đúng role**
    - **Validates: Yêu cầu 1.2, 2.5**

  - [x] 4.5 Viết property test cho Property 2: Xác thực thất bại trả về lỗi 401
    - **Property 2: Xác thực thất bại trả về lỗi 401**
    - **Validates: Yêu cầu 1.3, 1.4, 1.6**

  - [x] 4.6 Viết property test cho Property 3: User không truy cập được admin endpoint
    - **Property 3: Phân quyền — User không truy cập được admin endpoint**
    - **Validates: Yêu cầu 2.4**

  - [x] 4.7 Viết property test cho Property 4: Role của user luôn là ADMIN hoặc USER
    - **Property 4: Role của user luôn là ADMIN hoặc USER**
    - **Validates: Yêu cầu 2.1**

- [x] 5. Module Xác Thực — Auth API và Pages
  - [x] 5.1 Tạo `AuthController.java`, `AuthService.java` với các endpoint: `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`
    - Login: xác thực BCrypt, generate JWT, trả về `AuthResponse` (token, role, fullName)
    - Register: validate input, kiểm tra email trùng, tạo user với role=USER
    - _Yêu cầu: 1.1, 1.2, 1.3, 12.1, 12.4_

  - [x] 5.2 Tạo DTOs: `LoginRequest`, `RegisterRequest` với Bean Validation annotations (`@NotBlank`, `@Email`, `@Pattern` cho phone, `@Size` cho password)
    - Validate mật khẩu: tối thiểu 8 ký tự, có chữ hoa, có chữ số
    - Validate số điện thoại: 10 chữ số, bắt đầu bằng 0
    - _Yêu cầu: 12.2, 12.3, 12.5, 12.6_

  - [x] 5.3 Tạo `GlobalExceptionHandler.java` xử lý: `BusinessException`, `MethodArgumentNotValidException`, `ResourceNotFoundException`
    - Trả về cấu trúc lỗi chuẩn: `{ success, message, code, timestamp }`
    - _Yêu cầu: 1.3, 3.4, 4.6_

  - [x] 5.4 Tạo Redux slice `authSlice.js`: lưu token, role, fullName vào store; action login/logout
    - _Yêu cầu: 1.2, 1.5_

  - [x] 5.5 Tạo `LoginPage.jsx` và `RegisterPage.jsx`
    - LoginPage: form username/password, gọi `POST /auth/login`, lưu token, redirect theo role
    - RegisterPage: form họ tên/email/phone/password/confirmPassword, validate client-side, gọi `POST /auth/register`
    - _Yêu cầu: 1.1, 1.3, 12.1, 12.3_

  - [x] 5.6 Viết property test cho Property 19: Đăng ký — email phải là duy nhất
    - **Property 19: Đăng ký — email phải là duy nhất**
    - **Validates: Yêu cầu 12.2**

  - [x] 5.7 Viết property test cho Property 20: Đăng ký — validation mật khẩu
    - **Property 20: Đăng ký — validation mật khẩu**
    - **Validates: Yêu cầu 12.3, 12.5**

  - [x] 5.8 Viết property test cho Property 21: Đăng ký — validation số điện thoại Việt Nam
    - **Property 21: Đăng ký — validation số điện thoại Việt Nam**
    - **Validates: Yêu cầu 12.6**

- [x] 6. Checkpoint — Xác thực và phân quyền hoạt động đúng
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [x] 7. Module Hãng Xe — Brand API và Pages
  - [x] 7.1 Tạo `BrandController.java`, `BrandService.java` với các endpoint: `GET /brands`, `POST /brands`, `PUT /brands/{id}`, `DELETE /brands/{id}`, `GET /brands/{id}/images`
    - Kiểm tra tên hãng trùng trước khi tạo (trả về 409)
    - Kiểm tra hãng có xe liên kết trước khi xóa (trả về 422)
    - _Yêu cầu: 3.1, 3.3, 3.4, 3.6, 3.7_

  - [x] 7.2 Tạo DTOs: `BrandResponse` (id, name, logoUrl, description, carCount)
    - _Yêu cầu: 3.1_

  - [x] 7.3 Viết property test cho Property 5: Thêm hãng xe — round trip
    - **Property 5: Thêm hãng xe — round trip**
    - **Validates: Yêu cầu 3.3**

  - [x] 7.4 Viết property test cho Property 6: Tên hãng xe phải là duy nhất
    - **Property 6: Tên hãng xe phải là duy nhất**
    - **Validates: Yêu cầu 3.4**

  - [x] 7.5 Viết property test cho Property 7: Không xóa được hãng xe đang có xe liên kết
    - **Property 7: Không xóa được hãng xe đang có xe liên kết**
    - **Validates: Yêu cầu 3.7**

  - [x] 7.6 Tạo `BrandManagementPage.jsx` hiển thị danh sách hãng xe dạng card grid
    - Mỗi `BrandCard.jsx`: logo, tên hãng, số lượng xe, nút "Ảnh xe"/"Edit"/"Delete"
    - Form thêm/sửa hãng xe với `BrandForm.jsx` (tên, logo upload, mô tả)
    - `ConfirmDialog.jsx` xác nhận trước khi xóa
    - _Yêu cầu: 3.1, 3.2, 3.5, 3.6, 3.8_

- [x] 8. Module Upload Ảnh
  - [x] 8.1 Tạo `UploadController.java`, `UploadService.java` với endpoint: `POST /upload/image`, `POST /upload/images`
    - Validate: định dạng JPG/PNG/WEBP, kích thước ≤ 5MB, tối đa 10 file
    - Lưu file với tên UUID vào `/uploads/{year}/{month}/`
    - Trả về URL có thể truy cập được
    - _Yêu cầu: 4.4, 4.5, 5.1, 5.2, 5.3, 5.4_

  - [x] 8.2 Cấu hình `spring.servlet.multipart.max-file-size=5MB` và `spring.servlet.multipart.max-request-size=55MB` trong `application.properties`
    - _Yêu cầu: 4.4_

  - [x] 8.3 Viết property test cho Property 11: Upload ảnh — validation định dạng và kích thước
    - **Property 11: Upload ảnh — validation định dạng và kích thước**
    - **Validates: Yêu cầu 4.4, 4.5**

  - [x] 8.4 Viết property test cho Property 12: Upload ảnh — round trip URL
    - **Property 12: Upload ảnh — round trip URL**
    - **Validates: Yêu cầu 5.3**

  - [x] 8.5 Viết property test cho Property 13: Giới hạn số lượng ảnh mỗi xe
    - **Property 13: Giới hạn số lượng ảnh mỗi xe**
    - **Validates: Yêu cầu 5.4**

  - [x] 8.6 Tạo component `ImageUpload.jsx`: chọn file, preview ảnh trước khi upload, hỗ trợ multi-file (tối đa 10)
    - _Yêu cầu: 5.1, 5.2, 5.4_

- [x] 9. Module Xe — Car API và Pages
  - [x] 9.1 Tạo `CarController.java`, `CarService.java` với các endpoint: `GET /cars`, `GET /cars/{id}`, `POST /cars`, `PUT /cars/{id}`, `DELETE /cars/{id}`
    - GET /cars hỗ trợ query params: `type`, `brandId`, `keyword`, `minPrice`, `maxPrice`, `page`, `size`
    - Kiểm tra số khung trùng trước khi tạo (trả về 409)
    - Kiểm tra xe trong đơn hàng active trước khi xóa (trả về 422)
    - _Yêu cầu: 4.1, 4.3, 4.6, 4.7, 4.8_

  - [x] 9.2 Tạo DTOs: `CarRequest` (validate @NotBlank, @NotNull cho các trường bắt buộc), `CarResponse`
    - _Yêu cầu: 4.3_

  - [x] 9.3 Viết property test cho Property 8: Validation trường bắt buộc khi thêm xe
    - **Property 8: Validation trường bắt buộc khi thêm xe**
    - **Validates: Yêu cầu 4.3**

  - [x] 9.4 Viết property test cho Property 9: Số khung xe phải là duy nhất
    - **Property 9: Số khung xe phải là duy nhất**
    - **Validates: Yêu cầu 4.6**

  - [x] 9.5 Viết property test cho Property 10: Không xóa được xe đang trong đơn hàng active
    - **Property 10: Không xóa được xe đang trong đơn hàng active**
    - **Validates: Yêu cầu 4.8**

  - [x] 9.6 Tạo `NewCarPage.jsx` và `UsedCarPage.jsx` (Admin): danh sách xe dạng bảng, nút thêm/sửa/xóa
    - `CarForm.jsx`: form nhập thông tin xe + `ImageUpload.jsx` tích hợp
    - `ConfirmDialog.jsx` xác nhận xóa
    - _Yêu cầu: 4.1, 4.2, 4.3, 4.7_

- [x] 10. Module Khách Hàng — Customer API và Pages
  - [x] 10.1 Tạo `CustomerController.java`, `CustomerService.java` với các endpoint: `GET /customers`, `GET /customers/{id}`, `PATCH /customers/{id}/toggle-active`, `DELETE /customers/{id}`
    - GET /customers hỗ trợ tìm kiếm theo tên hoặc email
    - Kiểm tra đơn hàng chưa hoàn thành trước khi xóa (trả về 422)
    - _Yêu cầu: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 10.2 Tạo `CustomerPage.jsx` (Admin): bảng danh sách khách hàng, tìm kiếm, xem chi tiết + lịch sử đơn hàng, nút vô hiệu hóa/xóa
    - _Yêu cầu: 6.1, 6.2, 6.3, 6.4_

- [x] 11. Module Đơn Hàng — Order API và Pages
  - [x] 11.1 Tạo `OrderController.java`, `OrderService.java` với các endpoint: `GET /orders`, `GET /orders/{id}`, `POST /orders`, `PATCH /orders/{id}/status`
    - GET /orders: admin thấy tất cả, user chỉ thấy của mình; hỗ trợ filter theo status và khoảng thời gian
    - PATCH status: kiểm tra không cho hủy đơn COMPLETED (trả về 422)
    - _Yêu cầu: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 11.2 Tạo `OrderStatusRequest` DTO với validation enum status hợp lệ
    - _Yêu cầu: 7.2_

  - [x] 11.3 Viết property test cho Property 14: Trạng thái đơn hàng luôn hợp lệ
    - **Property 14: Trạng thái đơn hàng luôn hợp lệ**
    - **Validates: Yêu cầu 7.2**

  - [x] 11.4 Viết property test cho Property 15: Không hủy được đơn hàng đã hoàn thành
    - **Property 15: Không hủy được đơn hàng đã hoàn thành**
    - **Validates: Yêu cầu 7.5**

  - [x] 11.5 Tạo `OrderPage.jsx` (Admin): bảng đơn hàng, filter theo trạng thái/thời gian, dropdown cập nhật trạng thái
    - _Yêu cầu: 7.1, 7.3, 7.4_

- [x] 12. Module Kiểm Định Xe — Inspection API và Pages
  - [x] 12.1 Tạo `InspectionController.java`, `InspectionService.java` với các endpoint: `GET /inspections`, `POST /inspections`, `PUT /inspections/{id}`
    - POST: tạo phiếu kiểm định, cập nhật `inspection_passed` trên bảng `cars`
    - GET: hỗ trợ tìm kiếm theo tên xe và khoảng thời gian
    - _Yêu cầu: 8.1, 8.2, 8.3, 8.4_

  - [x] 12.2 Tạo `InspectionPage.jsx` (Admin): danh sách phiếu kiểm định, form tạo phiếu mới (`InspectionForm.jsx`), tìm kiếm
    - _Yêu cầu: 8.1, 8.2, 8.4_

- [x] 13. Module Báo Cáo — Report API và Dashboard
  - [x] 13.1 Tạo `ReportController.java`, `ReportService.java` với các endpoint: `GET /reports/dashboard`, `GET /reports/revenue`, `GET /reports/top-cars`, `GET /reports/export`
    - Dashboard: tổng số xe, tổng đơn hàng, doanh thu tháng hiện tại, số khách hàng mới
    - Revenue: doanh thu theo từng tháng trong năm
    - Top-cars: top 5 xe bán chạy nhất
    - Export: tạo file PDF hoặc Excel (dùng Apache POI hoặc iText)
    - _Yêu cầu: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 13.2 Tạo `DashboardResponse` DTO chứa các số liệu thống kê
    - _Yêu cầu: 9.1_

  - [x] 13.3 Tạo `DashboardPage.jsx` và `ReportPage.jsx` (Admin)
    - Dashboard: 4 card thống kê tổng quan + biểu đồ doanh thu theo tháng (Recharts) + bảng top 5 xe
    - ReportPage: bộ lọc khoảng thời gian, nút xuất PDF/Excel
    - _Yêu cầu: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 14. Module Giỏ Hàng — Cart API
  - [x] 14.1 Tạo `CartController.java`, `CartService.java` với các endpoint: `GET /cart`, `POST /cart/items`, `DELETE /cart/items/{carId}`
    - POST: kiểm tra xe đã có trong giỏ (trả về lỗi nếu trùng)
    - _Yêu cầu: 11.3, 11.4, 11.5_

  - [x] 14.2 Viết property test cho Property 17: Thêm xe vào giỏ hàng — round trip
    - **Property 17: Thêm xe vào giỏ hàng — round trip**
    - **Validates: Yêu cầu 11.3**

  - [x] 14.3 Viết property test cho Property 18: Không thêm trùng xe vào giỏ hàng
    - **Property 18: Không thêm trùng xe vào giỏ hàng**
    - **Validates: Yêu cầu 11.4**

  - [x] 14.4 Tạo Redux slice `cartSlice.js`: lưu danh sách xe trong giỏ, action thêm/xóa
    - _Yêu cầu: 11.3, 11.5_

- [x] 15. Giao Diện Mua Hàng (User Portal)
  - [x] 15.1 Tạo `CarListPage.jsx` (User): danh sách xe dạng card grid với `CarCard.jsx`
    - Bộ lọc: hãng xe, loại xe (mới/cũ), khoảng giá
    - Nút "Thêm vào giỏ hàng" trên mỗi card
    - _Yêu cầu: 11.1, 11.2, 11.7_

  - [x] 15.2 Tạo `CarDetailPage.jsx` (User): hiển thị đầy đủ thông tin xe, gallery ảnh, nút "Thêm vào giỏ hàng"
    - _Yêu cầu: 11.2_

  - [x] 15.3 Tạo `CartPage.jsx` (User): danh sách xe trong giỏ, tổng giá trị, nút "Xác nhận đặt mua"
    - Xác nhận đặt mua: gọi `POST /orders`, hiển thị thông báo thành công
    - _Yêu cầu: 11.5, 11.6_

- [x] 16. Layout, Routing và Tìm Kiếm
  - [x] 16.1 Tạo `AdminLayout.jsx` với sidebar màu `#1a3a5c`, `Header.jsx` (logo + search bar + user info), `Footer.jsx` (© 2014 Tân Lộc)
    - `Sidebar.jsx`: menu items Dashboard, Quản lý xe (Xe mới/Xe cũ), Kiểm định, Khách hàng, Đơn hàng, Báo cáo, Hãng xe
    - `UserLayout.jsx`: layout cho trang mua hàng
    - _Yêu cầu: 2.2, 2.3_

  - [x] 16.2 Tạo `PrivateRoute.jsx` bảo vệ route theo role: redirect về `/login` nếu chưa đăng nhập, hiển thị 403 nếu sai role
    - _Yêu cầu: 1.6, 2.3, 2.4_

  - [x] 16.3 Tạo `AppRouter.jsx` định nghĩa toàn bộ routes: public (`/login`, `/register`), admin (`/admin/*`), user (`/`, `/cars/:id`, `/cart`)
    - _Yêu cầu: 2.2, 2.3_

  - [x] 16.4 Tạo `SearchBar.jsx` với debounce 500ms, gọi `GET /cars?keyword=...`, hiển thị gợi ý kết quả
    - Hiển thị "Không tìm thấy xe phù hợp với từ khóa" khi không có kết quả
    - `useDebounce.js` hook
    - _Yêu cầu: 10.1, 10.2, 10.3, 10.4_

  - [x] 16.5 Viết property test cho Property 16: Kết quả tìm kiếm xe phải chứa từ khóa (fast-check)
    - **Property 16: Kết quả tìm kiếm xe phải chứa từ khóa**
    - **Validates: Yêu cầu 10.3**

- [x] 17. Tiện ích và Hoàn Thiện Frontend
  - [x] 17.1 Tạo `formatCurrency.js` (định dạng VND) và `validators.js` (validate phone, password, email)
    - _Yêu cầu: 12.5, 12.6_

  - [x] 17.2 Tạo các API modules: `authApi.js`, `carApi.js`, `brandApi.js`, `orderApi.js`, `uploadApi.js`
    - Mỗi module export các hàm gọi API tương ứng sử dụng `axiosInstance`
    - _Yêu cầu: 1.2, 3.1, 4.1, 7.1_

  - [x] 17.3 Tạo `useAuth.js` hook: kiểm tra trạng thái đăng nhập, lấy thông tin user từ Redux store
    - _Yêu cầu: 1.6, 2.3_

- [x] 18. Checkpoint Cuối — Đảm bảo toàn bộ hệ thống hoạt động
  - Đảm bảo tất cả tests pass, kiểm tra tích hợp frontend-backend, hỏi người dùng nếu có thắc mắc.

## Ghi Chú

- Tasks đánh dấu `*` là tùy chọn, có thể bỏ qua để triển khai MVP nhanh hơn
- Mỗi task tham chiếu đến yêu cầu cụ thể để đảm bảo traceability
- Property tests sử dụng `jqwik` (backend Java) và `fast-check` (frontend JS)
- Mỗi property test phải có comment: `Feature: car-management-website, Property {N}: {tên property}`
- Checkpoints đảm bảo kiểm tra tích hợp theo từng giai đoạn
