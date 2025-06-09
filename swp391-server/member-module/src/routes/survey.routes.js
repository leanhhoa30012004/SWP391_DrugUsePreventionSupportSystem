const express = require("express");
const router = express.Router();
const survey = require("../controllers/survey.controller");
const { model } = require("mongoose");

router.get('/viewSurvey', survey.viewSurvey);
router.get('/typeSurvey', survey.findSurveyByType);
router.post('/submitSurvey', survey.submitSurvey);

module.exports = router;