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
router.delete(
  "/delete",
  protectManager,
  restrictTo("manager", "admin"),
  courseController.deleteCourse
);
router.get(
  "/list",

  courseController.listOfCourse
);
router.get(
  "/search",
  protectManager,
  restrictTo("manager", "admin"),
  courseController.searchCourseByName
);

router.get('/get-all-course-full-info', courseController.getAllCourseFullInfo);
module.exports = router;
