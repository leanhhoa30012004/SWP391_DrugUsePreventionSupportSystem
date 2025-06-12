const courseModel = require('../models/course.model')

exports.getAllCourse = async (req, res) => {
    try {
        const listOfCourse = await courseModel.listOfCourse();
        res.json(listOfCourse)
    } catch (error) {
        console.log('getAllCourse error: ', error)
        res.status(500).JSON({ error: error.message || 'Internal Server Error' })
    }

}