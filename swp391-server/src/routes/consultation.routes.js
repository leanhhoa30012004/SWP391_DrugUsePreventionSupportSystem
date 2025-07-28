const express = require('express');
const router = express.Router();
const consultationController = require('../app/controllers/consultation.controllers');
const { imageUpload } = require('../service/upload.service');
const { protectManager, restrictTo } = require('../middleware/auth.middleware');


router.get('/check-appointment/:member_id/:appointment_date/:appointment_time', consultationController.checkAppointment);
router.post('/add-appointment', consultationController.addAppointment);
router.get('/get-all-appointment-by-id/:member_id', consultationController.getAllAppointmentByMemberId);
router.get('/get-all-appointment-by-consultant-id/:consultant_id', consultationController.getAllAppointmentByConsultantId);
router.get('/reject-appointment/:appointment_id/:is_active', consultationController.rejectAppointment)
router.get('/get-all-appointment/:appointment_date/:appointment_time', consultationController.getAllAppointment);
router.get('/change-appointment-status/:appointment_id', consultationController.changeAppointmentStatus);
router.post('/update-consultant-certificate', imageUpload.single("certificate_img"), consultationController.updateCertificate);
router.post('/add-consultant-certificate', imageUpload.single('certificate_img'), consultationController.addCertificate);
router.get('/get-certificate-by-consultant-id/:consultant_id', consultationController.getCertificateByConsultantId);
router.post('/approve-certificate-request/:certificate_id', protectManager, restrictTo('manager', 'admin'), consultationController.approveCertificateRequest);
router.post('/reject-certificate-request/:certificate_id', protectManager, restrictTo('manager', 'admin'), consultationController.rejectCertificateRequest);
module.exports = router;