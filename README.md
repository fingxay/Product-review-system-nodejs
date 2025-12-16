# Hệ thống Đánh giá Sản phẩm - Node.js

Một ứng dụng web full-stack để quản lý sản phẩm và đánh giá của người dùng, được xây dựng bằng Node.js, Express và MongoDB.

## Tính năng

- **Xác thực người dùng**: Đăng ký và đăng nhập với xác thực dựa trên JWT
- **Quản lý sản phẩm**: Tạo, đọc, cập nhật và xóa sản phẩm (chức năng quản trị viên)
- **Hệ thống đánh giá**: Người dùng có thể gửi và quản lý đánh giá cho sản phẩm
- **Sản phẩm được đánh giá cao nhất**: Xem các sản phẩm được đánh giá cao nhất
- **Giao diện đáp ứng**: Frontend HTML/CSS/JavaScript với phục vụ tệp tĩnh
- **Bảo mật**: Helmet cho tiêu đề bảo mật, cấu hình CORS, mã hóa mật khẩu với bcrypt
- **Ghi nhật ký**: Ghi nhật ký dựa trên Winston cho các yêu cầu và lỗi
- **Cơ sở dữ liệu**: MongoDB với Mongoose ODM

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Cơ sở dữ liệu**: MongoDB với Mongoose
- **Xác thực**: JSON Web Tokens (JWT), bcrypt để mã hóa mật khẩu
- **Bảo mật**: Helmet, CORS
- **Ghi nhật ký**: Winston, Morgan
- **Frontend**: HTML, CSS, JavaScript (thuần)
- **Phát triển**: Nodemon để tải lại nóng

## Yêu cầu tiên quyết

- Node.js (phiên bản 14 trở lên)
- MongoDB (cài đặt cục bộ hoặc dịch vụ đám mây như MongoDB Atlas)
- npm hoặc yarn

## Chạy dự án bằng Docker (Khuyến nghị)

### Yêu cầu
- Docker Desktop

### Các lệnh Docker

#### 1. Build và chạy hệ thống
docker-compose up --build


- Backend chạy tại: http://localhost:3000  
- MongoDB chạy trong container riêng  
- Database ban đầu sẽ trống

---

#### 2. Seed dữ liệu (chạy 1 lần duy nhất)
> Chỉ cần chạy ở lần đầu tiên trên mỗi máy

Mở terminal mới và chạy:
docker exec -it techreview-backend node project/seed/database.js


Khi thấy:
✔ SEED COMPLETE
là seed thành công.

> Dữ liệu được lưu trong Docker volume nên không cần seed lại ở các lần chạy sau, trừ khi xoá volume MongoDB.

---


## Cài đặt

1. **Sao chép kho lưu trữ**:
   ```bash
   git clone https://github.com/fingxay/Product-review-system-nodejs.git
   cd Product-review-system-nodejs
   ```

2. **Cài đặt các phụ thuộc**:
   ```bash
   npm install
   ```

3. **Thiết lập biến môi trường**:
   Tạo tệp `.env` trong thư mục gốc với các biến sau:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/product-review-system
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-token-secret
   ```

4. **Khởi động MongoDB**:
   Đảm bảo MongoDB đang chạy trên hệ thống của bạn.

5. **Khởi tạo cơ sở dữ liệu** (tùy chọn):
   Chạy script khởi tạo để điền dữ liệu ban đầu:
   ```bash
   node project/seed/database.js
   ```

## Sử dụng

### Phát triển
```bash
npm run dev
```

### Sản xuất
```bash
npm start
```

Máy chủ sẽ khởi động trên `http://localhost:3000`. Mở trình duyệt đến:
- Trang chính: `http://localhost:3000/index.html`
- Đăng nhập: `http://localhost:3000/login.html`
- Quản lý sản phẩm: `http://localhost:3000/admin-products.html`

## API Endpoints

### Xác thực
- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập người dùng
- `POST /api/auth/refresh` - Làm mới token truy cập
- `POST /api/auth/logout` - Đăng xuất người dùng

### Sản phẩm
- `GET /api/products` - Lấy tất cả sản phẩm (với phân trang/lọc)
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới (quản trị viên)
- `PUT /api/products/:id` - Cập nhật sản phẩm (quản trị viên)
- `DELETE /api/products/:id` - Xóa sản phẩm (quản trị viên)
- `GET /api/products/top-rated` - Lấy sản phẩm được đánh giá cao nhất

### Đánh giá
- `GET /api/reviews` - Lấy tất cả đánh giá
- `GET /api/reviews/:id` - Lấy đánh giá theo ID
- `POST /api/reviews` - Tạo đánh giá mới
- `PUT /api/reviews/:id` - Cập nhật đánh giá
- `DELETE /api/reviews/:id` - Xóa đánh giá

## Cấu trúc dự án

```
Product-review-system-nodejs/
├── project/
│   ├── controllers/          # Bộ xử lý route
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   └── review.controller.js
│   ├── models/              # Mô hình Mongoose
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   └── review.model.js
│   ├── routers/             # Routes Express
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── review.routes.js
│   ├── services/            # Logic nghiệp vụ
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   └── review.service.js
│   ├── utils/               # Tiện ích
│   │   ├── db.js
│   │   ├── jwt.js
│   │   ├── hashing.js
│   │   ├── logger.js
│   │   ├── errorHandler.js
│   │   ├── catchAsync.js
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── config.js
│   ├── seed/
│   │   └── database.js      # Khởi tạo cơ sở dữ liệu
│   └── server.js            # Tệp máy chủ chính
├── static/                  # Tài nguyên tĩnh
│   ├── css/
│   └── js/
├── templates/               # Mẫu HTML
├── package.json
├── README.md
└── LICENSE
```

## Đóng góp

1. Fork kho lưu trữ
2. Tạo nhánh tính năng (`git checkout -b feature/tinh-nang-tuyet-voi`)
3. Cam kết thay đổi của bạn (`git commit -m 'Thêm tính năng tuyệt vời'`)
4. Đẩy lên nhánh (`git push origin feature/tinh-nang-tuyet-voi`)
5. Mở Pull Request

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.

## Lời cảm ơn

- Được xây dựng với framework Express.js
- MongoDB để lưu trữ dữ liệu
- JWT để xác thực an toàn
- Winston để ghi nhật ký toàn diện