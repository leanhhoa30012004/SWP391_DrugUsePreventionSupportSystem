const db = require("../../config/db.config");

const listOfCourse = async () => {
    const [rows] = await db.execute(
        `WITH Ranked AS (
  SELECT 
   	c.course_id , cv.course_img , cv.course_name , c.created_by , c.created_at , cv.content , cv.version, 
    ROW_NUMBER() OVER (PARTITION BY c.course_id ORDER BY cv.version DESC) AS rn
  FROM Course c
  JOIN Course_version cv  ON c.course_id = cv.course_id
  WHERE c.is_active = 1
)
SELECT * FROM Ranked WHERE rn = 1;`);
    return rows.map(row => ({
        course_id: row.course_id,
        course_img: row.course_img,
        course_name: row.course_name,
        content: JSON.parse(row.content),
        created_by: row.created_by,
        created_at: row.created_at,
        version: row.version,
    }));
};
// exports.checkEnrollemtCourse = async (req, res) => {
//     const { member_id, course_id, enroll_version } = req.params;
//     try {
//         const check = await courseModel.checkEnrollemtCourse(member_id, course_id, enroll_version);
//         res.json({ isEnrolled: check });
//     } catch (error) {
//         console.log('checkEnrollmentCOurse error: ', error)
//         res.status(500).json({ error: error.message || "Internal Server Error" })
//     }
// }
const searchCourseByName = async (course_name) => {
    const name = `%${course_name}%`;
    const [rows] = await db.execute(
        `WITH Ranked AS (
  SELECT 
   	c.course_id , cv.course_img , cv.course_name , c.created_by , c.created_at , cv.content , cv.version, 
    ROW_NUMBER() OVER (PARTITION BY c.course_id ORDER BY cv.version DESC) AS rn
  FROM Course c
  JOIN Course_version cv  ON c.course_id = cv.course_id
  WHERE c.is_active = 1 AND cv.course_name LIKE ?
)
SELECT * FROM Ranked WHERE rn = 1;`,
        [name]
    );
    return rows.map(row => ({
        course_id: row.course_id,
        course_img: row.course_img,
        course_name: row.course_name,
        content: JSON.parse(row.content),
        created_by: row.created_by,
        created_at: row.created_at,
        version: row.version,
    }));
};

const memberContinuesLearnCourseById = async (member_id, course_id) => {
    const [rows] = await db.execute(
        `SELECT c.course_id, cv.course_img, cv.course_name, u.fullname, ce.learning_process, cv.content, ce.enroll_version
FROM Course_enrollment ce JOIN Course c ON ce.course_id = c.course_id
JOIN Course_version cv ON c.course_id = cv.course_id
JOIN Users u ON ce.member_id = u.user_id
WHERE ce.enroll_version = cv.version AND cv.course_id = ? AND ce.member_id = ? AND ce.is_active = 1`,
        [course_id, member_id]
    );
    return {
        course_id: rows[0].course_id,
        course_img: rows[0].course_img,
        fullname: rows[0].fullname,
        course_name: rows[0].course_name,
        // learning_process: JSON.parse(rows[0].learning_process),
        learning_process: rows[0].learning_process ? JSON.parse(rows[0].learning_process) : [],
        content: JSON.parse(rows[0].content),
        version: rows[0].enroll_version,
    };
};

const createMemberEnrollmentCourse = async (member_id, course_id, enroll_version) => {
    const [rows] = await db.execute(
        "INSERT INTO Course_enrollment (course_id, member_id, enroll_version, date) VALUES (?, ?, ?, now())",
        [course_id, member_id, enroll_version]
    );
    return rows;
};

const checkEnrollmentCourse = async (member_id, course_id, enroll_version) => {
    const [rows] = await db.execute(
        "SELECT * FROM Course_enrollment ce WHERE ce.is_active = 1 AND course_id = ? AND member_id = ? AND enroll_version = ?",
        [course_id, member_id, enroll_version]
    );
    if (rows.length === 0) return null; // Hoặc false nếu bạn muốn trả về false thay vì null
    return {
        course_id: rows[0].course_id,
        member_id: rows[0].member_id,
        date: rows[0].date,
        learning_process: JSON.parse(rows[0].learning_process),
        enroll_version: rows[0].enroll_version,
        status: rows[0].status
    };
};

const updateLearningProcess = async (member_id, course_id, learning_process) => {
    const [rows] = await db.execute(
        "UPDATE Course_enrollment SET learning_process = ? WHERE member_id  = ? AND course_id  = ? AND is_active = 1",
        [JSON.stringify(learning_process), member_id, course_id]
    );
    return rows;
};

const updateStatusLearningProcess = async (member_id, course_id) => {

    const [rows] = await db.execute('UPDATE Course_enrollment SET status = "completed" WHERE member_id  = ? AND course_id  = ? AND is_active = 1',
        [member_id, course_id]
    )
    return rows
}


const getCourseById = async (course_id) => {
    const [rows] = await db.execute(
        `WITH Ranked AS (
  SELECT 
   	c.course_id , cv.course_img , cv.course_name , c.created_by , c.created_at , cv.content , cv.version, 
    ROW_NUMBER() OVER (PARTITION BY c.course_id ORDER BY cv.version DESC) AS rn
  FROM Course c
  JOIN Course_version cv  ON c.course_id = cv.course_id
  WHERE c.is_active = 1 AND c.course_id = ?
)
SELECT * FROM Ranked WHERE rn = 1;`,
        [course_id]
    );

    return {
        course_id: rows[0].course_id,
        course_img: rows[0].course_img,
        course_name: rows[0].course_name,
        content: JSON.parse(rows[0].content),
        created_by: rows[0].created_by,
        created_at: rows[0].created_at,
        version: rows[0].version,
    };
};

const getCourseByIdAndVersion = async (course_id, version) => {
    const [rows] = await db.execute(
        `SELECT c.course_id, cv.course_img, cv.course_name, c.created_at, c.created_by, c.age_group, cv.content, cv.version
FROM Course c JOIN Course_version cv  ON c.course_id  = cv.course_id
WHERE c.course_id = ? AND cv.version LIKE ? AND c.is_active = 1`,
        [course_id, version])
    return {
        course_id: rows[0].course_id,
        course_name: rows[0].course_name,
        content: JSON.parse(rows[0].content),
        created_by: rows[0].created_by,
        created_at: rows[0].created_at,
        age_group: rows[0].age_group,
        version: rows[0].version,
    }
}

const calculateScoreMooc = async (questions, answers) => {
    const mooc = questions.find(item => item.id === answers.mooc_id);
    if (!mooc) {
        return { error: "Mooc not found" };
    }
    let totalScore = 0;
    let details = {};
    let MoocDetails = {};
    mooc.quiz.forEach((question, idx) => {
        const userAnswer = answers.answers[(idx + 1)];
        if (question.type === 'single_choice') {
            const selectedOption = question.options.find(opt => opt.text === userAnswer);
            if (selectedOption && selectedOption.score > 0) {
                // Người dùng chọn đúng đáp án
                totalScore += selectedOption.score;
                details[idx + 1] = {
                    question: question.question,
                    options: question.options,
                    answer: userAnswer,
                    score: selectedOption.score,
                    isCorrect: true
                };
            } else {
                // Người dùng chọn sai hoặc không chọn
                details[idx + 1] = {
                    question: question.question,
                    options: question.options,
                    answer: userAnswer,
                    score: 0,
                    isCorrect: false
                };
            }
        } else if (question.type === 'multiple_choice') {
            let userAnswersArr = Array.isArray(userAnswer) ? userAnswer : [];
            const correctOptions = question.options.filter(opt => opt.score > 0).map(opt => opt.text);
            let score = 0;
            userAnswersArr.forEach(ans => {
                const option = question.options.find(opt => opt.text === ans);
                if (option) {
                    score += option.score || 0;
                }
            });
            totalScore += score;
            const isCorrect = JSON.stringify(userAnswersArr.sort()) === JSON.stringify(correctOptions.sort());
            details[idx + 1] = {
                question: question.question,
                options: question.options,
                answer: userAnswersArr,
                score: score,
                isCorrect: isCorrect
            };
        }
    });
    MoocDetails = {
        mooc_id: answers.mooc_id,
        totalScore: totalScore,
        details: details
    };
    return {
        totalScore,
        MoocDetails
    };
};

const finishCourse = async (member_id, course_id) => {
    const [rows] = await db.execute(`UPDATE Course_enrollment ce SET ce.status = 'completed'
WHERE ce.course_id = ? AND ce.member_id = ? AND ce.is_active = 1`,
        [course_id, member_id])
    return rows;
}
const createCourse = async (course) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();


        const [insertCourse] = await connection.execute(
            'INSERT INTO Course(created_at, created_by, age_group) VALUES (NOW(), ?, ?)',
            [course.created_by, course.age_group]
        );
        const course_id = insertCourse.insertId;


        const [insertCourseVersion] = await connection.execute(
            'INSERT INTO Course_version (course_id, course_name, content, version, course_img) VALUES (?, ?, ?, 1.0, ?)',
            [
                course_id,
                course.course_name,
                JSON.stringify(course.content),
                course.course_img
            ]
        );

        await connection.commit();
        connection.release();

        return {
            success: true,
            course_id,
            course_version_id: insertCourseVersion.insertId
        };
    } catch (error) {
        await connection.rollback();
        connection.release();
        return {
            success: false,
            error: error.message || error
        };
    }
};

const updateCourse = async (course) => {
    const [rows] = await db.execute(
        'INSERT INTO Course_version (course_id, course_name, content, edited_at, edited_by, version, course_img) VALUES (?,?,?,NOW(),?,?, ?)',
        [
            course.course_id,
            course.course_name,
            JSON.stringify(course.content),
            course.edited_by,
            course.version + 0.1,
            course.course_img
        ]
    );
    return rows;
};
const deleteCourse = async (course_id) => {
    await db.execute("UPDATE Course SET is_active = 0 WHERE course_id = ?", [
        course_id,
    ]);
};
const listOfCourseFullInfo = async () => {
    const [rows] = await db.execute(
        `WITH Ranked AS (
  SELECT 
   	c.course_id , cv.course_img , cv.course_name , c.created_by , c.created_at , cv.content , cv.version, c.age_group,
    ROW_NUMBER() OVER (PARTITION BY c.course_id ORDER BY cv.version DESC) AS rn
  FROM Course c
  JOIN Course_version cv  ON c.course_id = cv.course_id
  WHERE c.is_active = 1
),
EnrollmentStats AS (
  SELECT 
    ce.course_id,
    COUNT(*) as enrolled_count,
    SUM(CASE WHEN ce.status = 'completed' THEN 1 ELSE 0 END) as completed_count
  FROM Course_enrollment ce
  WHERE ce.is_active = 1
  GROUP BY ce.course_id
)
SELECT 
  r.course_id,
  r.course_img,
  r.course_name,
  r.created_by,
  r.created_at,
  r.content,
  r.version,
  r.age_group,
  COALESCE(es.enrolled_count, 0) as enrolled,
  COALESCE(es.completed_count, 0) as completed,
  r.created_at as lastUpdated,
  (SELECT u.fullname FROM Users u WHERE u.user_id = r.created_by) as created_by_name
FROM Ranked r
LEFT JOIN EnrollmentStats es ON r.course_id = es.course_id
WHERE r.rn = 1;`);

    return rows.map(row => ({
        id: row.course_id,
        course_id: row.course_id,
        course_img: row.course_img,
        name: row.course_name,
        course_name: row.course_name,
        content: JSON.parse(row.content),
        description: JSON.parse(row.content).description || '',
        created_by: row.created_by_name || row.created_by,
        createdAt: row.created_at,
        created_at: row.created_at,
        version: row.version,
        age_group: row.age_group,
        enrolled: row.enrolled,
        completed: row.completed,
        lastUpdated: row.lastUpdated,
    }));
};

const getAllCourseForMemberByMemberId = async (member_id) => {
    const [listOfCourse] = await db.execute(`SELECT
	c.course_id,
	c.created_at,
	c.created_by,
	c.age_group,
	cv.course_img,
	cv.course_name,
	cv.content,
	cv.edited_at,
	cv.edited_by,
	cv.version
FROM Course c
LEFT JOIN Course_enrollment ce
	ON c.course_id = ce.course_id AND ce.member_id = ? AND ce.is_active = 1
LEFT JOIN Course_version cv
	ON cv.course_id = c.course_id
	AND (
		cv.version = ce.enroll_version
		OR (
			ce.enroll_version IS NULL AND
			cv.version = (
				SELECT MAX(version )
				FROM Course_version
				WHERE course_id = c.course_id AND is_active = 1 
			)
		)
	)
WHERE c.is_active = 1`, [member_id]);
    return listOfCourse.map(course => ({
        course_id: course.course_id,
        created_at: course.created_at,
        created_by: course.created_by,
        age_group: course.age_group,
        course_img: course.course_img,
        course_name: course.course_name,
        content: JSON.parse(course.content),
        edited_at: course.edited_at,
        edited_by: course.edited_by,
        version: course.version
    }));
}

const getParticipantCourseByMemberId = async (member_id) => {
    const [list] = await db.execute(`SELECT
    ce.member_id,
    ce.course_id,
    ce.enroll_version,
    c.age_group,
    c.created_at,
    cv.course_name,
    cv.course_img,
    cv.version
FROM Course_enrollment ce
JOIN Course c ON ce.course_id = c.course_id
JOIN Course_version cv ON cv.course_id = c.course_id 
WHERE ce.member_id = ? AND ce.enroll_version = cv.version;`, [member_id])
    return list;
}

const getLearningProcessByCourseIdAndMemberId = async (member_id, course_id) => {
    console.log(member_id + "sdads" + course_id)
    const [rows] = await db.execute(`SELECT course_id, member_id, date, learning_process, enroll_version, status
FROM Course_enrollment
WHERE course_id = ? AND member_id = ? AND is_active = 1`, [course_id, member_id]);
    return {
        course_id: rows[0].course_id,
        member_id: rows[0].member_id,
        date: rows[0].date,
        learning_process: JSON.parse(rows[0].learning_process),
        enroll_version: rows[0].enroll_version,
        status: rows[0].status
    };
}

module.exports = {
    listOfCourse,
    searchCourseByName,
    memberContinuesLearnCourseById,
    createMemberEnrollmentCourse,
    checkEnrollmentCourse,
    updateLearningProcess,
    finishCourse,
    getCourseById,
    getCourseByIdAndVersion,
    calculateScoreMooc,
    deleteCourse,
    updateStatusLearningProcess,
    createCourse,
    updateCourse,
    listOfCourseFullInfo,
    getAllCourseForMemberByMemberId,
    getParticipantCourseByMemberId,
    getLearningProcessByCourseIdAndMemberId
};
