const courseModel = require('../models/course.model')

exports.getAllCourse = async (req, res) => {
    try {
        const listOfCourse = await courseModel.listOfCourse();
        res.json(listOfCourse)
    } catch (error) {
        console.log('getAllCourse error: ', error)
        res.status(500).json({ error: error.message || 'Internal Server Error' })
    }
}

exports.getCourseByName = async (req, res) => {
    const { course_name } = req.body;
    try {
        const courses = await courseModel.searchCourseByName(course_name);
        if (courses.length === 0 || !courses) {
            res.json(`Cannot found with keyword '${course_name}'`)
        }
        res.json(courses)
    } catch (error) {
        console.log('getCourseByName error: ', error)
        res.status(500).json({ error: error.message || 'Internal Server Error' })
    }
}

exports.memberCountinuesLearnCourseById = async (req, res) => {
    const { user_id, course_id } = req.body;
    try {
        const course_progress = await courseModel.memberContinuesLearnCourseById(user_id, course_id);
        const learning_progress_mooc = course_progress.learning_process;
        const course_content = course_progress.content;

        const moocLength = learning_progress_mooc[0]?.moocs?.length || 0;

        if (moocLength === 0) {
            res.json(course_content[0]);
        } else if (moocLength > 0 && moocLength < course_content.length) {

            res.json(course_content[moocLength]);
        } else {
            res.json({ message: "You have completed all the content of this course" });
        }
    } catch (error) {
        console.log('countiuesLearnCourseById error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }

}