const express = require("express");
const router = express.Router();
const programController = require('../app/controllers/program.controllers')

router.post('/submit-program-survey/:program_id', programController.submitResponse);
router.get('/get-all-program', programController.getAllCommunityProgram);
router.get('/number-participant-program', programController.numberOfParticipantProgram);
router.get('/registered-program/:program_id/:member_id', programController.registeredProgram);
router.get('/mark-participant/:program_id/:member_id', programController.markParticipantAsPresent);
router.post('/update-program', programController.updateProgram);
router.get('/delete-program/:program_id', programController.deleteProgram);
router.get('/get-all-member-by-program-id/:program_id', programController.getAllMemberByProgramId);
router.get('/check-member-registered/:program_id/:member_id', programController.checkMemberRegistered);
router.post('/create-program', programController.createProgram);

module.exports = router;