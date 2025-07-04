const express = require("express");
const router = express.Router();
const surveyManageController = require("../app/controllers/survey.manage.controllers");
const { protectManager, restrictTo } = require("../middleware/auth.middleware");

router.post(
  "/create",
  protectManager,
  restrictTo("manager"),
  surveyManageController.createSurvey
);
router.post(
  "/update",
  protectManager,
  restrictTo("manager"),
  surveyManageController.updateSurvey
);

router.delete(
  "/delete/:id",
  protectManager,
  restrictTo("manager"),
  surveyManageController.deleteSurvey
);

module.exports = router;
