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
            return res.json(`Cannot found with keyword '${course_name}'`)
        }
        return res.json(courses)
    } catch (error) {
        console.log('getCourseByName error: ', error)
        return res.status(500).json({ error: error.message || 'Internal Server Error' })
    }
}
exports.checkEnrollmentCourse = async (req, res) => {
    const { member_id, course_id, enroll_version } = req.params;
    console.log('checkEnrollmentCourse params: ', req.params)

    try {
        const check = await courseModel.checkEnrollmentCourse(member_id, course_id, enroll_version);
        if (check) {
            return res.json({
                isEnrolled: true,
                status: check.status
            });
        }
        return res.json({ isEnrolled: false });
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

        // Đếm số MOOC đã hoàn thành (score >= 8 và không null/undefined)
        const moocLength = Array.isArray(learning_progress_mooc)
            ? learning_progress_mooc.filter(mooc => mooc && mooc.totalScore >= 8).length
            : 0;

        console.log(`Progress: ${moocLength}/${course_content.length} MOOCs completed`);

        if (moocLength === 0) {
            // Trả về MOOC đầu tiên với quantity
            const firstMooc = course_content[0];
            res.json({
                version: course_progress.version,
                data: firstMooc,
                quantity: course_content.length
            });
        } else if (moocLength > 0 && moocLength < course_content.length) {
            // Trả về MOOC tiếp theo với quantity
            const nextMooc = course_content[moocLength];
            res.json({
                version: course_progress.version,
                data: nextMooc,
                quantity: course_content.length
            });
        } else {
            // Đã hoàn thành tất cả MOOCs
            res.json({
                message: "You have completed all the content of this course",
                quantity: course_content.length
            });
        }
    } catch (error) {
        console.log('memberContinuesLearnCourseById error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.createMemberEnrollmentCourse = async (req, res) => {
    const { member_id, course_id, enroll_version } = req.params;

    try {
        const checkEnrollment = await courseModel.checkEnrollmentCourse(member_id, course_id, enroll_version);
        if (checkEnrollment) {
            return res.status(400).json({
                message: "You have already enrolled in this course",
                status: checkEnrollment.status
            });
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
    console.log('1st log: ', req.body)
    try {
        const course = await courseModel.getCourseByIdAndVersion(course_id, version);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        const submittedCourse = await courseModel.calculateScoreMooc(course.content, member_answer);
        if (submittedCourse.totalScore < 8) {
            return res.status(400).json({ error: "You need to score at least 8 to complete this course", score: submittedCourse.totalScore });
        }
        const learning_process = await courseModel.memberContinuesLearnCourseById(member_id, course_id);
        learning_process.learning_process.push(submittedCourse.MoocDetails);
        await courseModel.updateLearningProcess(member_id, course_id, learning_process.learning_process);

        const checkLearningProcess = await courseModel.memberContinuesLearnCourseById(member_id, course_id);

        if (checkLearningProcess.learning_process.length === course.content.length) {
            const finishCourse = await courseModel.finishCourse(member_id, course_id);

            if (finishCourse) {
                // add certificate
                return res.json({ courseResult: submittedCourse.MoocDetails, message: "You have successfully this course!", score: submittedCourse.totalScore })
            }
        }
        res.json({ courseResult: submittedCourse.MoocDetails, message: "You have successfully completed this mooc", score: submittedCourse.totalScore });


    } catch (error) {
        console.log('submitCourse error: ', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.getAllCourseFollowCourseEnrollmentByMemberId = async (req, res) => {
    const member_id = req.params.member_id;
    try {
        const listOfCourse = await courseModel.getParticipantCourseByMemberId(member_id);
        return res.json(listOfCourse);
    } catch (error) {
        console.error('getAllCourseEnrollmetByMemberId error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getAllCourseForMemberByMemberId = async (req, res) => {
    const member_id = req.params.member_id;
    try {
        const listOfCourse = await courseModel.getAllCourseForMemberByMemberId(member_id)
        return res.json(listOfCourse)
    } catch (error) {
        console.error('getAllCourseForMemberByMemberId error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getLearningProcessByCourseIdAndMemberId = async (req, res) => {
    const { member_id, course_id } = req.params;
    try {
        const learningProcess = await courseModel.getLearningProcessByCourseIdAndMemberId(member_id, course_id);
        if (!learningProcess || learningProcess.length === 0) {
            return res.status(404).json({ error: "No learning process found for this course and member" });
        }
        res.json(learningProcess);
    } catch (error) {
        console.error('getLearningProcessByCoureseIdAndMemberId error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}