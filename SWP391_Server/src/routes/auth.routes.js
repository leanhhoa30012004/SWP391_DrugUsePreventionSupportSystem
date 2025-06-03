const express = require("express");
const router = express.Router();
const auth = require("../app/controllers/auth.controllers");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password/:token", auth.resetPassword);

module.exports = router;
