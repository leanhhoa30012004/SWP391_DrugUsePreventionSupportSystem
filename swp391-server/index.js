require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./src/routes/auth.routes"); // đường dẫn đến routes bạn đã tạo
const surveyRoutes = require("./src/routes/survey.routes");
const managerRoutes = require("./src/routes/manager.routes");

const courseRoutes = require("./src/routes/course.routes");
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/api/course", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/manager", managerRoutes);
// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
