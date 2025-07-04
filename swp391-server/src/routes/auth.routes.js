const express = require("express");
const router = express.Router();
const auth = require("../app/controllers/auth.controllers");
const { authMiddleware } = require("../middleware/auth.middleware");

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

// Profile routes - protected by auth middleware
router.get("/profile", authMiddleware, auth.getProfile);
router.put("/profile", authMiddleware, auth.updateProfile);
router.put("/change-password", authMiddleware, auth.changePassword);

// New routes for profile data
router.get("/profile/courses", authMiddleware, auth.getUserCourses);
router.get("/profile/certificates", authMiddleware, auth.getUserCertificates);
router.get("/profile/surveys", authMiddleware, auth.getUserSurveys);

module.exports = router;
