const express = require("express");
const router = express.Router();
const { googleLogin, login, register } = require("../controllers/auth.controller");

// Google login
router.post("/google", googleLogin);

// Regular login
router.post("/login", login);

// Register
router.post("/register", register);

module.exports = router;
