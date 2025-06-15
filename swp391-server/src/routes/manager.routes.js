const express = require("express");
const router = express.Router();
const managerController = require("../app/controllers/manager.controllers");
const {
  protect,
  protectManager,
  restrictTo,
} = require("../middleware/auth.middleware");
const authController = require("../app/controllers/auth.controllers");
// Chỉ cho phép manager hoặc admin truy cập
router.post(
  "/create",
  protectManager,
  restrictTo("manager", "admin"),
  managerController.createUser
);

// Chỉ cho phép manager truy cập
router.post(
  "/profile",
  protectManager,
  restrictTo("manager"),
  managerController.changeProfile
);

// Cho phép tất cả user đã đăng nhập truy cập
router.post("/users", protectManager, managerController.getAllUsers);
router.post("/login-manager", authController.loginManager);
module.exports = router;
