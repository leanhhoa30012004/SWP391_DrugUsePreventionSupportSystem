const express = require("express");
const router = express.Router();
const managerController = require("../app/controllers/manager.controllers");
const { protectManager, restrictTo } = require("../middleware/auth.middleware");
const authController = require("../app/controllers/auth.controllers");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Manager routes are working!" });
});

// Cập nhật role user
router.put(
  "/update-role/:id/:role",
  protectManager,
  restrictTo("manager", "admin"),
  managerController.updateRole
);

// Cập nhật profile manager
router.post(
  "/profile",
  protectManager,
  restrictTo("manager"),
  managerController.changeProfile
);

// Lấy danh sách users
router.get("/users", protectManager, managerController.getAllUsers);

// Đăng nhập manager
router.post("/login-manager", authController.loginManager);

// Bật/tắt trạng thái active
// NHỮNG THAY ĐỔI ĐÃ THỰC HIỆN:
// - Thêm route mới cho toggle trạng thái active của user
// - Thay thế chức năng delete bằng soft delete
// - Thêm middleware authentication và authorization phù hợp
router.patch('/users/:id/active', protectManager, restrictTo('manager', 'admin'), managerController.toggleUserActive);

// Tạo user mới
router.post('/create-user', protectManager, restrictTo('manager', 'admin'), managerController.createUser);

// Cập nhật thông tin user
// NHỮNG THAY ĐỔI ĐÃ THỰC HIỆN:
// - Thêm route mới cho cập nhật thông tin user
// - Thêm middleware authentication và authorization phù hợp
// - Hỗ trợ cập nhật toàn bộ profile user bao gồm thay đổi role
router.put('/users/:id', protectManager, restrictTo('manager', 'admin'), managerController.updateUser);

module.exports = router;
