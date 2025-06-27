const express = require('express')
const router = express.Router()
const courseController = require('../app/controllers/course.controller')

router.get('/get-all-course', courseController.getAllCourse)
router.get('/get-course-by-name/:course_name', courseController.getCourseByName)
router.get('/continues-learn-course-by-id/:member_id/:course_id', courseController.memberContinuesLearnCourseById)
router.get('/enroll-course/:member_id/:course_id/:enroll_version', courseController.createMemberEnrollmentCourse)
router.post('/submit-mooc-course', courseController.submitCourse)
router.get('/check-enrollment-course/:member_id/:course_id/:enroll_version', courseController.checkEnrollmentCourse)
module.exports = router