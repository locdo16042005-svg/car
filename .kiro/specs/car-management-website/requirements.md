# Tài Liệu Yêu Cầu

## Giới Thiệu

Dự án xây dựng trang web quản lý xe **Tân Lộc** — một hệ thống quản lý và bán xe ô tô trực tuyến. Hệ thống bao gồm hai phần chính: giao diện quản trị dành cho Admin (quản lý xe, hãng xe, khách hàng, đơn hàng, báo cáo, kiểm định xe) và giao diện mua hàng dành cho User (xem xe, giỏ hàng, đặt mua). Hệ thống được xây dựng với backend Java Spring Boot, frontend React JS và cơ sở dữ liệu MySQL trên XAMPP.

---

## Bảng Thuật Ngữ

- **System**: Hệ thống web quản lý xe Tân Lộc
- **Auth_Service**: Module xác thực và phân quyền người dùng
- **Car_Service**: Module quản lý thông tin xe
- **Brand_Service**: Module quản lý hãng xe
- **Order_Service**: Module quản lý đơn hàng
- **Customer_Service**: Module quản lý khách hàng
- **Inspection_Service**: Module quản lý kiểm định xe
- **Report_Service**: Module tạo và xuất báo cáo
- **Cart_Service**: Module quản lý giỏ hàng
- **Upload_Service**: Module xử lý tải ảnh lên
- **Admin**: Người dùng có vai trò quản trị, có toàn quyền trên hệ thống
- **User**: Người dùng thông thường, chỉ có quyền xem và mua hàng
- **JWT**: JSON Web Token dùng để xác thực phiên đăng nhập
- **Xe mới**: Xe chưa qua sử dụng
- **Xe cũ**: Xe đã qua sử dụng
- **Kiểm định xe**: Quy trình đánh giá tình trạng kỹ thuật của xe

---

## Yêu Cầu

### Yêu Cầu 1: Đăng Nhập và Xác Thực

**User Story:** Là một người dùng, tôi muốn đăng nhập vào hệ thống bằng tài khoản của mình, để có thể truy cập các chức năng phù hợp với vai trò của tôi.

#### Tiêu Chí Chấp Nhận

1. THE Auth_Service SHALL cung cấp giao diện đăng nhập với trường tên đăng nhập và mật khẩu.
2. WHEN người dùng gửi thông tin đăng nhập hợp lệ, THE Auth_Service SHALL trả về JWT token và chuyển hướng người dùng đến trang phù hợp với vai trò.
3. WHEN người dùng gửi thông tin đăng nhập không hợp lệ, THE Auth_Service SHALL hiển thị thông báo lỗi "Tên đăng nhập hoặc mật khẩu không đúng".
4. WHEN JWT token hết hạn, THE Auth_Service SHALL yêu cầu người dùng đăng nhập lại.
5. WHEN người dùng nhấn đăng xuất, THE Auth_Service SHALL xóa token và chuyển hướng về trang đăng nhập.
6. IF người dùng chưa đăng nhập cố truy cập trang yêu cầu xác thực, THEN THE Auth_Service SHALL chuyển hướng về trang đăng nhập.

---

### Yêu Cầu 2: Phân Quyền Người Dùng

**User Story:** Là một Admin, tôi muốn hệ thống phân quyền rõ ràng giữa Admin và User, để đảm bảo chỉ Admin mới có thể truy cập các chức năng quản trị.

#### Tiêu Chí Chấp Nhận

1. THE Auth_Service SHALL phân biệt hai vai trò: Admin và User.
2. WHEN người dùng có vai trò Admin đăng nhập, THE System SHALL hiển thị giao diện quản trị với sidebar gồm: Dashboard, Quản lý xe (Xe mới, Xe cũ), Kiểm định xe, Khách hàng, Đơn hàng, Báo cáo, Hãng xe.
3. WHEN người dùng có vai trò User đăng nhập, THE System SHALL hiển thị giao diện mua hàng và ẩn toàn bộ các trang quản trị.
4. IF người dùng có vai trò User cố truy cập URL của trang quản trị, THEN THE Auth_Service SHALL trả về lỗi 403 và hiển thị thông báo "Bạn không có quyền truy cập trang này".
5. THE Auth_Service SHALL lưu thông tin vai trò trong JWT token và kiểm tra tại mỗi API endpoint.

---

### Yêu Cầu 3: Quản Lý Hãng Xe (Admin)

**User Story:** Là một Admin, tôi muốn quản lý danh sách hãng xe, để có thể thêm, chỉnh sửa và xóa thông tin hãng xe trong hệ thống.

#### Tiêu Chí Chấp Nhận

1. THE Brand_Service SHALL hiển thị danh sách hãng xe dưới dạng card grid, mỗi card gồm: ảnh logo, tên hãng, số lượng xe, các nút "Ảnh xe", "Edit", "Delete".
2. WHEN Admin nhấn nút thêm hãng xe mới, THE Brand_Service SHALL hiển thị form nhập thông tin gồm: tên hãng, logo hãng (upload ảnh), mô tả.
3. WHEN Admin gửi form thêm hãng xe với thông tin hợp lệ, THE Brand_Service SHALL lưu hãng xe vào cơ sở dữ liệu và cập nhật danh sách hiển thị.
4. IF Admin gửi form thêm hãng xe với tên hãng đã tồn tại, THEN THE Brand_Service SHALL hiển thị thông báo lỗi "Tên hãng xe đã tồn tại".
5. WHEN Admin nhấn nút "Edit" trên card hãng xe, THE Brand_Service SHALL hiển thị form chỉnh sửa với thông tin hiện tại được điền sẵn.
6. WHEN Admin nhấn nút "Delete" trên card hãng xe, THE Brand_Service SHALL hiển thị hộp thoại xác nhận trước khi xóa.
7. IF Admin xác nhận xóa hãng xe đang có xe liên kết, THEN THE Brand_Service SHALL hiển thị thông báo lỗi "Không thể xóa hãng xe đang có xe trong hệ thống".
8. WHEN Admin nhấn nút "Ảnh xe" trên card hãng xe, THE Brand_Service SHALL hiển thị danh sách ảnh xe thuộc hãng đó.

---

### Yêu Cầu 4: Quản Lý Xe (Admin)

**User Story:** Là một Admin, tôi muốn quản lý thông tin xe mới và xe cũ, để có thể thêm, chỉnh sửa và xóa xe trong hệ thống.

#### Tiêu Chí Chấp Nhận

1. THE Car_Service SHALL hiển thị danh sách xe với các thông tin: ảnh đại diện, tên xe, hãng xe, loại xe (mới/cũ), giá, trạng thái.
2. THE Car_Service SHALL phân tách danh sách xe thành hai mục riêng: "Xe mới" và "Xe cũ" trên sidebar.
3. WHEN Admin thêm xe mới, THE Car_Service SHALL yêu cầu nhập các trường bắt buộc: tên xe, hãng xe, loại xe, giá, năm sản xuất, màu sắc, số khung, mô tả.
4. WHEN Admin tải ảnh xe lên, THE Upload_Service SHALL chấp nhận file ảnh định dạng JPG, PNG, WEBP với kích thước tối đa 5MB mỗi file.
5. IF Admin tải lên file không đúng định dạng hoặc vượt quá 5MB, THEN THE Upload_Service SHALL hiển thị thông báo lỗi mô tả rõ nguyên nhân.
6. WHEN Admin gửi form thêm xe với số khung đã tồn tại, THE Car_Service SHALL hiển thị thông báo lỗi "Số khung xe đã tồn tại trong hệ thống".
7. WHEN Admin xóa xe, THE Car_Service SHALL hiển thị hộp thoại xác nhận trước khi thực hiện xóa.
8. IF Admin xóa xe đang có trong đơn hàng chưa hoàn thành, THEN THE Car_Service SHALL hiển thị thông báo lỗi "Không thể xóa xe đang có trong đơn hàng đang xử lý".

---

### Yêu Cầu 5: Tải Ảnh Lên (Upload)

**User Story:** Là một Admin, tôi muốn tải ảnh lên từ máy tính của mình, để có thể gắn ảnh cho xe và hãng xe.

#### Tiêu Chí Chấp Nhận

1. THE Upload_Service SHALL cung cấp chức năng chọn file ảnh từ thư mục trên máy tính người dùng.
2. WHEN Admin chọn file ảnh hợp lệ, THE Upload_Service SHALL hiển thị ảnh xem trước (preview) trước khi lưu.
3. WHEN Admin xác nhận tải lên, THE Upload_Service SHALL lưu file ảnh vào thư mục lưu trữ trên server và trả về đường dẫn URL của ảnh.
4. THE Upload_Service SHALL hỗ trợ tải lên nhiều ảnh cùng lúc cho một xe (tối đa 10 ảnh mỗi xe).
5. IF kết nối mạng bị gián đoạn trong quá trình tải lên, THEN THE Upload_Service SHALL hiển thị thông báo lỗi và cho phép thử lại.

---

### Yêu Cầu 6: Quản Lý Khách Hàng (Admin)

**User Story:** Là một Admin, tôi muốn xem và quản lý thông tin khách hàng, để có thể theo dõi và hỗ trợ khách hàng hiệu quả.

#### Tiêu Chí Chấp Nhận

1. THE Customer_Service SHALL hiển thị danh sách khách hàng với các thông tin: họ tên, email, số điện thoại, ngày đăng ký, số đơn hàng.
2. WHEN Admin tìm kiếm khách hàng theo tên hoặc email, THE Customer_Service SHALL hiển thị kết quả phù hợp trong vòng 1 giây.
3. WHEN Admin xem chi tiết khách hàng, THE Customer_Service SHALL hiển thị lịch sử đơn hàng của khách hàng đó.
4. WHEN Admin vô hiệu hóa tài khoản khách hàng, THE Customer_Service SHALL ngăn khách hàng đó đăng nhập và hiển thị thông báo tài khoản bị khóa.
5. IF Admin xóa tài khoản khách hàng đang có đơn hàng chưa hoàn thành, THEN THE Customer_Service SHALL hiển thị thông báo lỗi "Không thể xóa khách hàng đang có đơn hàng chưa hoàn thành".

---

### Yêu Cầu 7: Quản Lý Đơn Hàng (Admin)

**User Story:** Là một Admin, tôi muốn quản lý các đơn hàng, để có thể theo dõi và cập nhật trạng thái đơn hàng.

#### Tiêu Chí Chấp Nhận

1. THE Order_Service SHALL hiển thị danh sách đơn hàng với các thông tin: mã đơn hàng, tên khách hàng, tên xe, giá, ngày đặt, trạng thái.
2. THE Order_Service SHALL hỗ trợ các trạng thái đơn hàng: Chờ xác nhận, Đã xác nhận, Đang xử lý, Hoàn thành, Đã hủy.
3. WHEN Admin cập nhật trạng thái đơn hàng, THE Order_Service SHALL lưu thay đổi và ghi lại thời gian cập nhật.
4. WHEN Admin lọc đơn hàng theo trạng thái hoặc khoảng thời gian, THE Order_Service SHALL hiển thị danh sách đơn hàng phù hợp.
5. IF Admin hủy đơn hàng đã ở trạng thái "Hoàn thành", THEN THE Order_Service SHALL hiển thị thông báo lỗi "Không thể hủy đơn hàng đã hoàn thành".

---

### Yêu Cầu 8: Kiểm Định Xe (Admin)

**User Story:** Là một Admin, tôi muốn quản lý quy trình kiểm định xe, để có thể theo dõi tình trạng kỹ thuật của từng xe.

#### Tiêu Chí Chấp Nhận

1. THE Inspection_Service SHALL hiển thị danh sách phiếu kiểm định với các thông tin: mã phiếu, tên xe, ngày kiểm định, kết quả, ghi chú.
2. WHEN Admin tạo phiếu kiểm định mới, THE Inspection_Service SHALL yêu cầu chọn xe, nhập ngày kiểm định, kết quả (Đạt/Không đạt), và ghi chú.
3. WHEN Admin lưu phiếu kiểm định, THE Inspection_Service SHALL cập nhật trạng thái kiểm định của xe tương ứng.
4. WHEN Admin tìm kiếm phiếu kiểm định theo tên xe hoặc khoảng thời gian, THE Inspection_Service SHALL hiển thị kết quả phù hợp.

---

### Yêu Cầu 9: Báo Cáo (Admin)

**User Story:** Là một Admin, tôi muốn xem báo cáo thống kê, để có thể nắm bắt tình hình kinh doanh của cửa hàng.

#### Tiêu Chí Chấp Nhận

1. THE Report_Service SHALL hiển thị Dashboard với các thống kê tổng quan: tổng số xe, tổng đơn hàng, doanh thu tháng hiện tại, số khách hàng mới.
2. THE Report_Service SHALL hiển thị biểu đồ doanh thu theo tháng trong năm hiện tại.
3. THE Report_Service SHALL hiển thị danh sách top 5 xe bán chạy nhất.
4. WHEN Admin chọn khoảng thời gian lọc báo cáo, THE Report_Service SHALL cập nhật tất cả biểu đồ và số liệu theo khoảng thời gian đã chọn.
5. WHEN Admin xuất báo cáo, THE Report_Service SHALL tạo file PDF hoặc Excel chứa dữ liệu báo cáo hiện tại.

---

### Yêu Cầu 10: Tìm Kiếm (Admin và User)

**User Story:** Là một người dùng, tôi muốn tìm kiếm xe nhanh chóng, để có thể tìm thấy xe phù hợp với nhu cầu của mình.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL hiển thị thanh tìm kiếm ở header của trang.
2. WHEN người dùng nhập từ khóa vào thanh tìm kiếm, THE System SHALL hiển thị kết quả gợi ý trong vòng 500ms.
3. WHEN người dùng gửi tìm kiếm, THE System SHALL hiển thị danh sách xe có tên hoặc hãng xe chứa từ khóa.
4. IF không tìm thấy kết quả nào, THEN THE System SHALL hiển thị thông báo "Không tìm thấy xe phù hợp với từ khóa".

---

### Yêu Cầu 11: Giao Diện Mua Hàng (User)

**User Story:** Là một User, tôi muốn xem danh sách xe và thêm xe vào giỏ hàng, để có thể đặt mua xe tôi quan tâm.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL hiển thị danh sách xe có sẵn dưới dạng card grid với thông tin: ảnh, tên xe, hãng, giá, trạng thái.
2. WHEN User nhấn vào card xe, THE System SHALL hiển thị trang chi tiết xe với đầy đủ thông tin và ảnh.
3. WHEN User nhấn "Thêm vào giỏ hàng", THE Cart_Service SHALL thêm xe vào giỏ hàng của User.
4. IF User thêm xe đã có trong giỏ hàng, THEN THE Cart_Service SHALL hiển thị thông báo "Xe này đã có trong giỏ hàng của bạn".
5. WHEN User xem giỏ hàng, THE Cart_Service SHALL hiển thị danh sách xe đã thêm với tổng giá trị.
6. WHEN User xác nhận đặt mua, THE Order_Service SHALL tạo đơn hàng mới với trạng thái "Chờ xác nhận" và gửi thông báo xác nhận.
7. WHEN User lọc xe theo hãng, loại xe hoặc khoảng giá, THE System SHALL cập nhật danh sách xe hiển thị theo bộ lọc đã chọn.

---

### Yêu Cầu 12: Đăng Ký Tài Khoản (User)

**User Story:** Là một khách hàng mới, tôi muốn đăng ký tài khoản, để có thể mua xe trên hệ thống.

#### Tiêu Chí Chấp Nhận

1. THE Auth_Service SHALL cung cấp form đăng ký với các trường: họ tên, email, số điện thoại, mật khẩu, xác nhận mật khẩu.
2. WHEN khách hàng gửi form đăng ký với email đã tồn tại, THE Auth_Service SHALL hiển thị thông báo lỗi "Email này đã được sử dụng".
3. WHEN khách hàng gửi form đăng ký với mật khẩu không khớp xác nhận, THE Auth_Service SHALL hiển thị thông báo lỗi "Mật khẩu xác nhận không khớp".
4. WHEN khách hàng đăng ký thành công, THE Auth_Service SHALL tạo tài khoản với vai trò User và chuyển hướng đến trang đăng nhập.
5. THE Auth_Service SHALL yêu cầu mật khẩu có độ dài tối thiểu 8 ký tự, bao gồm ít nhất một chữ hoa và một chữ số.
6. IF khách hàng nhập số điện thoại không đúng định dạng Việt Nam (10 chữ số, bắt đầu bằng 0), THEN THE Auth_Service SHALL hiển thị thông báo lỗi "Số điện thoại không hợp lệ".
