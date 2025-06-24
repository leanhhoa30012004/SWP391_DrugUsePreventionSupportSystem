const express = require("express");
const router = express.Router();
const survey = require("../app/controllers/survey.controller");

router.get("/view-survey", survey.viewSurvey);
router.get("/type-survey/:type", survey.findSurveyByType);
router.get("/survey-by-id/:surveyId", survey.findSurveyBySurveyId);
router.post("/submit-survey", survey.submitSurvey);
router.get("/survey-history/:memberId", survey.getSurveyHistoryByMember);
module.exports = router;
