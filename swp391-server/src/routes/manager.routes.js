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


// Route mới để manager cập nhật profile của user khác

// Cho phép tất cả user đã đăng nhập truy cập

router.get("/users", protectManager, managerController.getAllUsers);

// Đăng nhập manager
router.post("/login-manager", authController.loginManager);

// - Thêm middleware authentication và authorization phù hợp
router.patch('/users/:id/active', protectManager, restrictTo('manager', 'admin'), managerController.toggleUserActive);

// Tạo user mới
router.post('/create-user', protectManager, restrictTo('manager', 'admin'), managerController.createUser);

router.put('/users/:id', protectManager, restrictTo('manager', 'admin'), managerController.updateUser);

module.exports = router;
