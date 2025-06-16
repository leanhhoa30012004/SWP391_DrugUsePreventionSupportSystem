const express = require("express");
const router = express.Router();
const courseController = require("../app/controllers/course.manage.controllers");
const { protectManager, restrictTo } = require("../middleware/auth.middleware");
router.post(
  "/create",
  protectManager,
  restrictTo("manager", "admin"),
  courseController.createCourse
);

router.post(
  "/update",
  protectManager,
  restrictTo("manager", "admin"),
  courseController.updateCourse
);
router.post(
  "/delete",
  protectManager,
  restrictTo("manager", "admin"),
  courseController.deleteCourse
);
router.get(
  "/list",
  protectManager,
  restrictTo("manager", "admin"),
  courseController.listOfCourse
);
router.get(
  "/search",
  protectManager,
  restrictTo("manager", "admin"),
  courseController.searchCourseByName
);
module.exports = router;
