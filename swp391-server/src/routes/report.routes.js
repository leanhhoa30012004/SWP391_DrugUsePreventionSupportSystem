const express = require("express");
const router = express.Router();
const reportController = require("../app/controllers/report.controllers");
const { protectManager, restrictTo } = require("../middleware/auth.middleware");
// get report number of survey done
router.get(
  "/survey-done/:period/:date/:year/:week/:month",
  protectManager,
  restrictTo("manager", "admin"),
  reportController.getReportNumberOfSurveyDone
);
// get report number of courses done
router.get(
  "/course-done/:period/:date/:year/:week/:month",
  protectManager,
  restrictTo("manager", "admin"),
  reportController.getReportNumberOfCoursesDone
);
// get report number of appointments done
router.get(
  "/appointment-done/:period/:date/:year/:week/:month",
  protectManager,
  restrictTo("manager", "admin"),
  reportController.getReportNumberOfAppointmentsDone
);
// get report number of active members
router.get(
  "/active-members",
  protectManager,
  restrictTo("manager", "admin"),
  reportController.getReportNumberOfMembersByRole
);
// get report Appointments done by each consultant
router.get(
  "/appointment-done-by-consultant/:period/:date/:year/:week/:month/:consultantId",
  protectManager,
  restrictTo("manager", "admin"),
  reportController.getReportNumberOfAppointmentsDoneEachConsultant
);
module.exports = router;