# 🚀 Drug Use Prevention Support System (WeHope)

## 📋 Giới thiệu dự án

**Drug Use Prevention Support System (WeHope)** là một hệ thống web toàn diện được phát triển nhằm hỗ trợ phòng chống tệ nạn xã hội, đặc biệt là vấn đề sử dụng chất gây nghiện. Hệ thống cung cấp các công cụ giáo dục, tư vấn trực tuyến, đánh giá rủi ro và quản lý cộng đồng để tạo ra một môi trường hỗ trợ tích cực cho người dùng.

## ✨ Chức năng chính

### 👥 Dành cho người dùng (Members)
- **🏠 Trang chủ**: Giao diện thân thiện với thông tin tổng quan và banner giới thiệu
- **📊 Khảo sát đánh giá rủi ro**: Hệ thống survey thông minh với AI phân tích kết quả
- **📚 Khóa học giáo dục**: Thư viện khóa học phòng chống tệ nạn xã hội với video và tài liệu
- **💬 Tư vấn trực tuyến**: Đặt lịch hẹn và tư vấn trực tiếp với chuyên gia
- **📝 Blog cộng đồng**: Chia sẻ kinh nghiệm, viết blog và tương tác cộng đồng
- **🎯 Chương trình cộng đồng**: Tham gia các hoạt động và sự kiện phòng chống
- **🤖 Chatbot AI**: Trợ lý thông minh 24/7 với Google Gemini AI
- **🔔 Thông báo realtime**: Cập nhật thông tin kịp thời qua Socket.io
- **👤 Quản lý profile**: Cập nhật thông tin cá nhân và lịch sử hoạt động

### 👨‍⚕️ Dành cho tư vấn viên (Consultants)
- **📅 Quản lý lịch tư vấn**: Xem và quản lý các buổi tư vấn đã đăng ký
- **👤 Hồ sơ người dùng**: Theo dõi tiến trình và lịch sử khảo sát của từng người
- **📊 Báo cáo tư vấn**: Ghi nhận kết quả và tiến trình tư vấn
- **💬 Chat trực tiếp**: Giao tiếp realtime với người dùng
- **📈 Dashboard cá nhân**: Thống kê số lượng và chất lượng tư vấn

### 👨‍💼 Dành cho quản trị viên (Admin)
- **📊 Dashboard tổng quan**: Thống kê tổng thể hệ thống với biểu đồ
- **📝 Quản lý blog**: Duyệt, chỉnh sửa và quản lý nội dung blog từ cộng đồng
- **📚 Quản lý khóa học**: Tạo, cập nhật và quản lý khóa học giáo dục
- **📋 Quản lý khảo sát**: Tạo và chỉnh sửa các bài khảo sát đánh giá rủi ro
- **👥 Quản lý nhân viên**: Quản lý tài khoản và phân quyền nhân viên
- **🏆 Quản lý chứng chỉ**: Tạo và cấp chứng chỉ hoàn thành khóa học

### 🎯 Dành cho quản lý (Manager)
- **👥 Quản lý người dùng**: Quản lý toàn bộ tài khoản và hoạt động người dùng
- **📊 Phân tích khảo sát**: Theo dõi và phân tích kết quả khảo sát hệ thống
- **📚 Giám sát khóa học**: Theo dõi hiệu quả và tỷ lệ hoàn thành khóa học
- **👨‍⚕️ Quản lý tư vấn viên**: Phân công và đánh giá hiệu suất tư vấn viên
- **🎯 Quản lý chương trình**: Quản lý các chương trình và sự kiện cộng đồng
- **📝 Kiểm duyệt blog**: Duyệt và kiểm soát nội dung blog trước khi xuất bản
- **📈 Báo cáo tổng hợp**: Tạo báo cáo định kỳ về hoạt động hệ thống

## 🛠️ Công nghệ sử dụng

### Frontend (React Client)
```
⚛️ React.js 18 - Library JavaScript cho giao diện người dùng
🎨 Tailwind CSS - Framework CSS utility-first
🚀 Vite - Build tool và dev server nhanh
🧭 React Router Dom - Routing cho ứng dụng SPA
📡 Axios - HTTP client cho API calls
🎭 React Icons (Fa, Io, etc.) - Thư viện icon phong phú
📱 React Hooks - State management và lifecycle
🔔 Socket.io Client - Realtime communication
🍯 SweetAlert2 - Modal và thông báo đẹp mắt
🎯 ESLint - Code quality và formatting
```

### Backend (Node.js Server)
```
🟢 Node.js - Runtime JavaScript
⚡ Express.js - Web framework cho Node.js
🗄️ MySQL2 - Driver cơ sở dữ liệu MySQL với Promise support
🔐 JWT (jsonwebtoken) - Xác thực và phân quyền
🔒 bcryptjs - Mã hóa mật khẩu
📧 Nodemailer - Gửi email tự động
📁 Multer - Upload file middleware
🔔 Socket.io - Realtime communication
🌐 CORS - Cross-Origin Resource Sharing
🤖 Google Generative AI - Tích hợp Gemini AI cho chatbot
☁️ Cloudinary - Cloud storage cho hình ảnh
🔗 Passport.js - Authentication middleware
```

### Database Design
```
🗄️ MySQL 8.0 - Hệ quản trị cơ sở dữ liệu quan hệ
📊 Normalized Database với các bảng chính:
  ├── Users - Quản lý người dùng và phân quyền
  ├── Survey & Survey_version - Khảo sát và phiên bản
  ├── Survey_enrollment - Lịch sử làm khảo sát
  ├── Course & Course_content - Khóa học và nội dung
  ├── Blog & Blog_comment - Blog và bình luận
  ├── Consultation - Quản lý tư vấn
  ├── Community_program - Chương trình cộng đồng
  ├── Certificate - Chứng chỉ hoàn thành
  └── Notification - Hệ thống thông báo
```

### DevOps & Tools
```
📦 npm - Package manager
🔧 dotenv - Environment variables management
🚀 Production Ready - Cấu hình cho production
📝 ESLint & Prettier - Code formatting
🔍 Debug logging - Chi tiết log cho debugging
```

## 🌟 Tính năng nổi bật

### 🤖 AI-Powered Chatbot
- Tích hợp Google Gemini AI
- Trả lời câu hỏi về phòng chống tệ nạn xã hội
- Gợi ý khóa học và lịch tư vấn phù hợp
- Hỗ trợ 24/7 với ngôn ngữ tự nhiên

### 📊 Smart Survey System
- Thuật toán đánh giá rủi ro thông minh
- Gợi ý khóa học dựa trên mức độ rủi ro
- Theo dõi tiến trình cải thiện theo thời gian
- Báo cáo chi tiết và phân tích xu hướng

### 💬 Real-time Communication
- Thông báo realtime cho tất cả hoạt động
- Socket.io cho trải nghiệm mượt mà

### 🎨 Modern UI/UX
- Responsive design cho mọi thiết bị
- Animations và transitions mượt mà
- Accessibility features

### 🔒 Security & Performance
- JWT-based authentication
- Password encryption với bcrypt
- File upload security với Cloudinary
- Database connection pooling
- Error handling và logging chi tiết

## 📁 Cấu trúc dự án

```
SWP391_DrugUsePreventionSupportSystem/
├── 📁 swp391-client/                    # Frontend React Application
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable components
│   │   │   ├── 📁 Chatbot/            # AI Chatbot component
│   │   │   ├── 📁 Navbar/             # Navigation components
│   │   │   ├── 📁 Footer/             # Footer component
│   │   │   └── 📁 ProtectedRoute/     # Route protection
│   │   ├── 📁 pages/                  # Page components
│   │   │   ├── 📁 Admin/              # Admin dashboard pages
│   │   │   ├── 📁 Manager/            # Manager dashboard pages
│   │   │   ├── 📁 Consultant/         # Consultant pages
│   │   │   ├── 📁 Homepage/           # Landing page
│   │   │   ├── 📁 Login/              # Authentication pages
│   │   │   ├── 📁 Survey/             # Survey pages
│   │   │   ├── 📁 Courses/            # Course pages
│   │   │   └── 📁 Blogs/              # Blog pages
│   │   ├── 📁 hooks/                  # Custom React hooks
│   │   ├── 📁 services/               # API service layers
│   │   ├── 📁 context/                # React Context providers
│   │   └── 📁 config/                 # Configuration files
│   └── 📁 public/                     # Static assets
├── 📁 swp391-server/                   # Backend Node.js Application
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 controllers/        # Route controllers
│   │   │   ├── 📁 models/             # Database models
│   │   │   └── 📁 cron/               # Scheduled jobs
│   │   ├── 📁 routes/                 # API route definitions
│   │   ├── 📁 middleware/             # Express middlewares
│   │   ├── 📁 config/                 # Server configurations
│   │   └── 📁 service/                # Business logic services
│   └── 📁 uploads/                    # File upload directory
└── 📄 package.json                    # Root package configuration
```

## 🚀 Cài đặt và chạy dự án

### Prerequisites
```bash
Node.js >= 16.0.0
MySQL >= 8.0
npm >= 7.0.0
```

### 1. Clone repository
```bash
git clone https://github.com/hoale-torii-4/SWP391_DrugUsePreventionSupportSystem.git
cd SWP391_DrugUsePreventionSupportSystem
```

### 2. Backend Setup
```bash
cd swp391-server
npm install

# Tạo file .env từ template
cp .env.example .env

# Cấu hình các biến môi trường trong .env:
# DB_HOST=localhost
# DB_USER=your_mysql_user
# DB_PASSWORD=your_mysql_password
# DB_NAME=swp391_database
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_key
# CLOUDINARY_API_SECRET=your_cloudinary_secret
# GEMINI_API_KEY=your_gemini_api_key

# Chạy server development
npm run dev
```

### 3. Frontend Setup
```bash
cd swp391-client
npm install

# Tạo file .env từ template
cp .env.example .env

# Cấu hình API endpoint:
# VITE_API_URL=http://localhost:8081

# Chạy client development
npm run dev
```

### 4. Database Setup
```sql
-- Tạo database
CREATE DATABASE swp391_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Import database structure và sample data
mysql -u username -p swp391_database < database/swp391_database.sql
```

### 5. Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📊 API Endpoints chính

```
🔐 Authentication
POST   /api/auth/register          # Đăng ký tài khoản
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/logout            # Đăng xuất
GET    /api/auth/profile           # Lấy thông tin profile

📊 Survey Management
GET    /api/survey/list            # Danh sách khảo sát
GET    /api/survey/:id             # Chi tiết khảo sát
POST   /api/survey/submit          # Nộp bài khảo sát
GET    /api/survey/history/:userId # Lịch sử khảo sát

📚 Course Management
GET    /api/course/list            # Danh sách khóa học
GET    /api/course/:id             # Chi tiết khóa học
POST   /api/course/enroll          # Đăng ký khóa học
POST   /api/course/complete        # Hoàn thành khóa học

📝 Blog Management
GET    /api/blog/list              # Danh sách blog
GET    /api/blog/:id               # Chi tiết blog
POST   /api/blog/create            # Tạo blog mới
PUT    /api/blog/:id               # Cập nhật blog
DELETE /api/blog/:id               # Xóa blog

💬 Consultation
GET    /api/consultation/available # Lịch trống tư vấn
POST   /api/consultation/book      # Đặt lịch tư vấn
GET    /api/consultation/my-bookings # Lịch hẹn của tôi

🤖 Chatbot
POST   /api/chatbot/message        # Gửi tin nhắn cho AI
GET    /api/chatbot/history        # Lịch sử chat
```

## 👥 Vai trò và quyền hạn

| Vai trò | Quyền hạn | Mô tả |
|---------|-----------|-------|
| **Member** | Người dùng cơ bản | Làm khảo sát, học khóa học, viết blog, tư vấn |
| **Consultant** | Tư vấn viên | Tất cả quyền Member + quản lý lịch tư vấn |
| **Manager** | Quản lý cấp cao | Tất cả quyền + phân tích dữ liệu, báo cáo tổng hợp |

## 🔒 Bảo mật

- **Authentication**: JWT tokens với expiration
- **Password Security**: bcrypt với salt rounds
- **File Upload**: Cloudinary với validation
- **SQL Injection**: Prepared statements với mysql2
- **XSS Protection**: Input sanitization
- **CORS**: Configured cho production
- **Rate Limiting**: API rate limiting middleware

## 📈 Performance & Monitoring

- **Database Pooling**: MySQL connection pooling
- **Error Logging**: Comprehensive error tracking
- **API Response Time**: Optimized queries và caching
- **File Optimization**: Cloudinary auto-optimization
- **Code Splitting**: React lazy loading

## 🧪 Testing & Quality

```bash
# Chạy tests
npm run test

# Linting
npm run lint

# Format code
npm run format

# Build production
npm run build
```

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Complete authentication system
- ✅ AI Chatbot integration với Gemini
- ✅ Survey system với risk assessment
- ✅ Course management với video support
- ✅ Blog system với community features
- ✅ Real-time consultation booking
- ✅ Admin dashboard với analytics
- ✅ Responsive design cho mobile

### Planned Features (v1.1.0)
- 📱 Mobile app với React Native
- 📊 Advanced analytics dashboard
- 🔔 Push notifications
- 🌍 Multi-language support
- 📄 PDF report generation
- 🔗 Social media integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 👥 Đội ngũ phát triển

- **[Hòa Lê](https://github.com/hoale-torii-4)** - Project Lead & Full-stack Developer
- **[Khoa Phan](https://github.com/vankhoa-gubit)** - Full-stack Developer
- **Frontend Team** - UI/UX Implementation
- **Backend Team** - API & Database Development

## 📞 Liên hệ & Hỗ trợ

- **Email**: leanhhoa30012004@gmail.com
- **GitHub**: [SWP391_DrugUsePreventionSupportSystem](https://github.com/hoale-torii-4/SWP391_DrugUsePreventionSupportSystem)
- **Issues**: [GitHub Issues](https://github.com/hoale-torii-4/SWP391_DrugUsePreventionSupportSystem/issues)


## 📄 License

Dự án này được phát triển cho mục đích giáo dục trong khuôn khổ môn SWP391 - FPT University.

---

<div align="center">

**🌟 WeHope - Building a Drug-Free Future Together 🌟**

*Được phát triển bởi đội ngũ SWP391 - TUNG TUNG TUNG*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>
