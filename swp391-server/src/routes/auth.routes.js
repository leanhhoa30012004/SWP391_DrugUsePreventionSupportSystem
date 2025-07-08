const express = require("express");
const router = express.Router();
const auth = require("../app/controllers/auth.controllers");
const { authMiddleware } = require("../middleware/auth.middleware");
const passport = require('passport');

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
// Google OAuth routes for consultants
// Route: Login bằng Google
router.get('/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    accessType: 'offline',
    prompt: 'consent'
  })
);

// Route: Google callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login?error=unauthorized',
    session: true
  }),
  auth.googleCallback
);

module.exports = router;
