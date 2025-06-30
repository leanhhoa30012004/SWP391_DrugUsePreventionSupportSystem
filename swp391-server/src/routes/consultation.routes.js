const express = require('express');
const router = express.Router();
const consultationController = require('../app/controllers/consultation.controllers')


router.get('/check-appointment/:request_date/:request_time', consultationController.checkAppointment);
router.post('/add-request-appointment', consultationController.addRequestAppointment);
router.get('/get-all-appointment-by-id/:member_id', consultationController.getAllAppointmentByMemberId);
router.get('/get-all-request-appointment-for-consultant', consultationController.getAllRequestAppointmentForConsultant);
router.get('/get-auth-url/:consultant_id', consultationController.getAuthUrl);
router.get('/oauth2callback', consultationController.oAuth2CallBack)
router.get('/accept-appointment-request/:consultant_id/:assign_by', consultationController.acceptAppointmentRequest)
module.exports = router;