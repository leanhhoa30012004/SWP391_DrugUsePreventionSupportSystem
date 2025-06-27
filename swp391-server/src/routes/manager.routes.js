const express = require("express");
const router = express.Router();
const managerController = require("../app/controllers/manager.controllers");
const { protectManager, restrictTo } = require("../middleware/auth.middleware");
const authController = require("../app/controllers/auth.controllers");

// Test route without authentication
router.get("/test", (req, res) => {
  res.json({ message: "Manager routes are working!" });
});

// Chỉ cho phép manager hoặc admin truy cập
router.post(
  "/create-user",
  protectManager,
  restrictTo("manager", "admin"),
  managerController.createUser
);
router.put(
  "/update-role",
  protectManager,
  restrictTo("manager", "admin"),
  managerController.updateRole
);
router.delete(
  "/users/:id",
  protectManager,
  restrictTo("manager", "admin"),
  managerController.deleteUser
);
// Chỉ cho phép manager truy cập
router.post(
  "/profile",
  protectManager,
  restrictTo("manager"),
  managerController.changeProfile
);

// Cho phép tất cả user đã đăng nhập truy cập
router.get("/users", protectManager, managerController.getAllUsers);
router.post("/login-manager", authController.loginManager);

// Thêm route cập nhật trạng thái active/inactive
router.patch('/users/:id/active', managerController.toggleUserActive);

// Thêm route tạo user mới chuẩn RESTful
// Route này cho phép manager hoặc admin tạo user mới qua endpoint POST /api/manager/users
// Được sử dụng bởi frontend khi manager tạo user trong trang quản lý user
router.post('/users', protectManager, restrictTo('manager', 'admin'), managerController.createUser);

module.exports = router;
