require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./src/routes/auth.routes"); // đường dẫn đến routes bạn đã tạo
const surveyRoutes = require("./src/routes/survey.routes");
const managerRoutes = require("./src/routes/manager.routes");
const surveyManageRoutes = require("./src/routes/survey.manage.routes");
const courseRoutes = require("./src/routes/course.routes");
const courseManageRoutes = require("./src/routes/course.manage.routes");
const consultationRoutes = require("./src/routes/consultation.routes");
const cors = require("cors");
app.use(express.json());
app.use(cors());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Test login-manager route
app.post("/api/auth/login-manager-test", (req, res) => {
  res.json({ message: "Login manager test route is working!", body: req.body });
});

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/manager/survey", surveyManageRoutes);
app.use("/api/manager/course", courseManageRoutes);
// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
