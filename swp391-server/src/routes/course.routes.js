const express = require('express')
const router = express.Router()
const courseController = require('../app/controllers/course.controller')

router.get('/get-all-course', courseController.getAllCourse)

module.exports = router