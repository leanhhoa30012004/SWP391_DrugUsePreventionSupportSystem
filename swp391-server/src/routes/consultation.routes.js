const express = require('express');
const router = express.Router();
const consultationController = require('../app/controllers/consultation.controllers')


router.get('/check-appointment/:member_id/:appointment_date/:appointment_time', consultationController.checkAppointment);
router.post('/add-appointment', consultationController.addAppointment);
router.get('/get-all-appointment-by-id/:member_id', consultationController.getAllAppointmentByMemberId);
router.get('/get-all-appointment-by-consultant-id/:consultant_id', consultationController.getAllApointmentByConsultantId);
router.get('/get-auth-url/:consultant_id', consultationController.getAuthUrl);
router.get('/oauth2callback', consultationController.oAuth2CallBack)
router.get('/delete-appointment/:appointment_id', consultationController.deleteAppointment)
router.get('/create-meet-link/:appointment_id', consultationController.createMeetLink)
module.exports = router;