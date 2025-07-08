const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authController = require('../app/controllers/auth.controllers');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
  console.log("Received refresh token:", refreshToken);
  const user = await authController.googleLoginConsultant(profile, accessToken, refreshToken);
  if (!user) return done(null, false);
  return done(null, user);
}));


passport.serializeUser((user, done) => done(null, user.user_id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authController.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
