require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./src/routes/auth.routes"); // đường dẫn đến routes bạn đã tạo
const surveyRoutes = require("./src/routes/survey.routes");
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/survey", surveyRoutes);

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
