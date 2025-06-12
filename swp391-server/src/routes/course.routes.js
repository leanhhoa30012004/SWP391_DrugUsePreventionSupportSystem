const express = require('express')
const router = express.Router()
const courseController = require('../app/controllers/course.controller')

router.get('/get-all-course', courseController.getAllCourse)
router.post('/get-course-by-name', courseController.getCourseByName)
router.post('/constinues-learn-course-by-id', courseController.memberCountinuesLearnCourseById)

module.exports = router