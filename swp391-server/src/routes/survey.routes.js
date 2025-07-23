const express = require("express");
const router = express.Router();
const survey = require("../app/controllers/survey.controller");

router.get("/view-survey", survey.viewSurvey);
router.get("/type-survey/:type", survey.findSurveyByType);
router.get("/survey-by-id/:survey_id", survey.findSurveyBySurveyId);
router.post("/submit-survey", survey.submitSurvey);
router.get("/survey-history/:member_id", survey.getSurveyHistoryByMember);
router.get("/get-all-survey-follow-survey-enrollment-by-member-id/:member_id", survey.getAllSurveyFollowSurveyEnrollmentByMemberId)
router.get("/survey-history-by-survey-enrollment-id/:survey_enrollment_id", survey.getDetailSurveyHistoryBySurveyEnrollmenId);
module.exports = router;
