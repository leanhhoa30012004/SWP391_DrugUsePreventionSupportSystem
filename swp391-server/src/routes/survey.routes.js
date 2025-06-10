const express = require("express");
const router = express.Router();
const survey = require("../app/controllers/survey.controller");
const { model } = require("mongoose");

router.get('/viewSurvey', survey.viewSurvey);
router.get('/typeSurvey', survey.findSurveyByType);
router.get('/surveyById', survey.findSurveyBySurveyId);
router.post('/submitSurvey', survey.submitSurvey);
router.post('/surveyHistory', survey.getSurveyHistoryByMember);

module.exports = router;