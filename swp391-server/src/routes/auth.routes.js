const express = require("express");
const router = express.Router();
const auth = require("../app/controllers/auth.controllers");

// Debug route
router.get("/debug", (req, res) => {
  res.json({ 
    message: "Auth routes are working!",
    availableFunctions: Object.keys(auth)
  });
});

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/login-manager", auth.loginManager);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password/:token", auth.resetPassword);

module.exports = router;
