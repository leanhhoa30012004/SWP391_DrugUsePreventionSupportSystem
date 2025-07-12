require("dotenv").config();
require('./src/app/cron/updateProgramStatus');
require('../swp391-server/src/config/passport.config');

const session = require('express-session');
const express = require("express");
const http = require("http");
const cors = require("cors");
const passport = require("passport");
const { initSocket } = require("./src/app/models/socket.model");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./src/routes/auth.routes");
const surveyRoutes = require("./src/routes/survey.routes");
const managerRoutes = require("./src/routes/manager.routes");
const surveyManageRoutes = require("./src/routes/survey.manage.routes");
const courseRoutes = require("./src/routes/course.routes");
const courseManageRoutes = require("./src/routes/course.manage.routes");
const consultationRoutes = require("./src/routes/consultation.routes");
const reportRoutes = require("./src/routes/report.routes");
const programRoutes = require("./src/routes/program.routes");
const noticeRoutes = require("./src/routes/notice.routes");

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

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
app.use("/api/manager/report", reportRoutes);
app.use("/api/program", programRoutes);
app.use("/api/notice", noticeRoutes);

initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
