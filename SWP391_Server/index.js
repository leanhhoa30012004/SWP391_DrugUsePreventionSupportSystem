require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./src/routes/auth.routes"); // đường dẫn đến routes bạn đã tạo

app.use(express.json());
app.use(cors())

// Các routes
app.use("/api/auth", authRoutes);

// Chạy server
// http://localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
