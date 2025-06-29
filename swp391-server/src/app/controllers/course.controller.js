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
    const course_name = req.params.course_name;
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
exports.checkEnrollmentCourse = async (req, res) => {
    const { member_id, course_id, enroll_version } = req.params;
    try {
        const check = await courseModel.checkEnrollmentCourse(member_id, course_id, enroll_version);
        res.json({ isEnrolled: check });
    } catch (error) {
        console.log('checkEnrollmentCOurse error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}
exports.memberContinuesLearnCourseById = async (req, res) => {
    const { member_id, course_id } = req.params;
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
        console.log('memberContinuesLearnCourseById error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }

}

exports.createMemberEnrollmentCourse = async (req, res) => {
    const { member_id, course_id, enroll_version } = req.params;

    try {
        if (await courseModel.checkEnrollmentCourse(member_id, course_id, enroll_version)) {
            return res.status(400).json({ error: "You have already enrolled in this course" });
        }
        const enrollment = await courseModel.createMemberEnrollmentCourse(member_id, course_id, enroll_version)
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
    const { member_id, course_id, member_answer, version } = req.body;
    // console.log("course_id>>>", course_id)
    try {
        const course = await courseModel.getCourseByIdAndVersion(course_id, version);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        const submittedCourse = await courseModel.calculateScoreMooc(course.content, member_answer);
        if (submittedCourse.totalScore < 8) {
            console.log(submittedCourse.totalScore)
            return res.status(400).json({ error: "You need to score at least 8 to complete this course" });
        }
        const learning_process = await courseModel.memberContinuesLearnCourseById(member_id, course_id);
        learning_process.learning_process.push(submittedCourse.MoocDetails);
        await courseModel.updateLearningProcess(member_id, course_id, learning_process.learning_process);

        const checkLearningProcess = await courseModel.memberContinuesLearnCourseById(member_id, course_id);

        if (checkLearningProcess.learning_process.length === course.content.length) {
            const finishCourse = await courseModel.finishCourse(member_id, course_id);

            if (finishCourse) {
                // add certificate
                return res.json({ courseResult: submittedCourse.MoocDetails, message: "You have successfully this course!" })
            }
        }
        res.json({ courseResult: submittedCourse.MoocDetails, message: "You have successfully completed this mooc" });


    } catch (error) {
        console.log('submitCourse error: ', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.getCourseByCourseIdAndVersion = async (req, res) => {
    const { course_id, version } = req.params;
    try {
        const row = await courseModel.getCourseByIdAndVersion(course_id, version);
        if (!row) return res.json('course is not exist')
        return res.json(row);

    } catch (error) {
        console.log('getCourseByCourseIdAndVersion error: ', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }

}
