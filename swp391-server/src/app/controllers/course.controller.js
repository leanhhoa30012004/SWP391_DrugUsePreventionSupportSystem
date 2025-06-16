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
    const { member_id, course_id } = req.body;
    try {
        const course_progress = await courseModel.memberContinuesLearnCourseById(member_id, course_id);
        const learning_progress_mooc = course_progress.learning_process;
        const course_content = course_progress.content;


        const moocLength = Array.isArray(learning_progress_mooc) ? learning_progress_mooc.length : 0;

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

exports.createMemberEnrollmentCourse = async (req, res) => {
    const { member_id, course_id } = req.body;
    try {
        if (await courseModel.checkEnrollemtCourse(member_id, course_id)) {
            return res.status(400).json({ error: "You have alreadey enrolled in this course" });
        }
        const enrollment = await courseModel.createMemberEnrollmentCourse(member_id, course_id)
        if (!enrollment) {
            res.status(500).json({ error: "Failed to join course" });
        }
        res.json({ message: "You have successfully enrolled in this course" });
    } catch (error) {
        console.log('createMemberEnrollmentCourse error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.submitCourse = async (req, res) => {
    const { member_id, course_id, member_answer } = req.body;

    try {
        const course = await courseModel.getCourseById(course_id);
        // console.log('submitCourse course: ', course);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        const submittedCourse = await courseModel.calculateScoreMooc(course.content, member_answer);
        // console.log('submittedCourse: ', submittedCourse);
        if (submittedCourse.totalScore < 8) {
            return res.status(400).json({ error: "You need to score at least 8 to complete this course" });
        } else {
            const learning_process = await courseModel.getCourseEnrollmentByMemberIdAndCourseId(member_id, course_id);
            learning_process.learning_process.push(submittedCourse.details);
            await courseModel.updateLearningProcess(member_id, course_id, learning_process.learning_process);
            await courseModel.updateStatusLearningProcess(member_id, course_id);
            res.json({ message: "You have successfully completed this course" });
        }
    } catch (error) {
        console.log('submitCourse error: ', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

