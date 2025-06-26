const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const memberModel = require("../models/member.model");
const managerModels = require("../models/manager.model");

exports.register = async (req, res) => {
  const { username, password, email, fullname, birthday } = req.body;
  try {
    const existing = await memberModel.findByUsername(username);
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const id = await memberModel.createMember({
      username,
      password,
      email,
      fullname,
      birthday,
    });
    res.status(201).json({ message: "User registered successfully", id });
  } catch (err) {
    console.error("Register error:", err); // log lỗi cụ thể
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await memberModel.findByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.member_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );
    res.status(200).json({ message: "Login successful", user, token });
  } catch (err) {
    console.error("Login error:", err); // thêm dòng này
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const member = await memberModel.findByEmail(email);
  if (!member) return res.status(404).json({ message: "Email not found" });

  const token = Math.random().toString(36).substring(2);
  const expiry = new Date(Date.now() + 3600000); // 1 hour
  await memberModel.updateResetToken(email, token, expiry);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password Drug Use Prevention System",
    html: `Click link to reset password <a href="http://localhost:3000/reset-password/${token}">Click here to reset your password</a>`,
  });

  res.json({ message: "Password reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const member = await memberModel.findByResetToken(token);
  if (!member)
    return res.status(400).json({ message: "Token invalid or expired" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await memberModel.updatePassword(member.member_id, hashed);
  res.json({ message: "Password reset successful" });
};
exports.loginManager = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await managerModels.findByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error logging in manager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
