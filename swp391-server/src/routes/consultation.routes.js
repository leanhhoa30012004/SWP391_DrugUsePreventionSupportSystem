const express = require('express');
const router = express.Router();
const consultationController = require('../app/controllers/consultation.controllers')

router.get('/checkAppointment/:request_date/:request_time', consultationController.checkAppointment);
router.post('/addRequestAppointment', consultationController.addRequestAppointment);
router.get('/getAllAppointmentById/:member_id', consultationController.getAllAppointmentByMemberId);
router.get('/getAllRequestAppointmentForConsultant', consultationController.getAllRequestAppointmentForConsultant);
module.exports = router;