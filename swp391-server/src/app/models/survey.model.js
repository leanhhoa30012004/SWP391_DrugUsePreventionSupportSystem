const { response, json } = require("express");
const db = require("../../config/db.config")

const listOfSurvey = async () => {
    const [rows] = await db.execute("SELECT * FROM Survey WHERE is_active = 1")
    return rows;
}

const findSurveyByType = async (type) => {
    const searchType = `%${type}%`;
    const [rows] = await db.execute("SELECT * FROM Survey s WHERE s.survey_type LIKE ? AND s.is_active = 1 ORDER BY s.version DESC LIMIT 1", [searchType]);
    if (rows.length === 0) {
        throw new Error("Survey not found");
    }

    return {
        survey_id: rows[0].survey_id,
        survey_type: rows[0].survey_type,
        content: JSON.parse(rows[0].content),
        created_by: rows[0].created_by,
        created_at: rows[0].created_at,
        edit_by: rows[0].edit_by,
        edit_at: rows[0].edit_at,
        version: rows[0].version
    }
}

const findSurveyBySurveyID = async (survey_id) => {
    const [rows] = await db.execute("SELECT * FROM Survey s WHERE s.survey_id = ? AND s.is_active = 1", [survey_id]);
    if (rows.length === 0) {
        throw new Error("Survey not found");
    }

    return {
        survey_id: rows[0].survey_id,
        survey_type: rows[0].survey_type,
        content: JSON.parse(rows[0].content),
        created_by: rows[0].created_by,
        created_at: rows[0].created_at,
        edit_by: rows[0].edit_by,
        edit_at: rows[0].edit_at,
        version: rows[0].version
    }
}

const findSurveyByTypeAndVersion = async (type, version) => {
    const searchType = `%${type}%`;
    const [rows] = await db.execute("SELECT * FROM Survey s WHERE s.survey_type LIKE ? AND s.version = ? AND s.is_active = 1",
        [searchType, version]
    )
    if (row.length === 0) {
        throw new Error("Servey not found");
    }
    return {
        survey_id: rows[0].survey_id,
        survey_type: rows[0].survey_type,
        content: JSON.parse(rows[0].content),
        created_by: rows[0].created_by,
        created_at: rows[0].created_at,
        edit_by: rows[0].edit_by,
        edit_at: rows[0].edit_at,
    }
}

const calculateScore = (questions, answers) => {
    let totalScore = 0;

    questions.forEach((question) => {
        const userAnswer = answers[question.id]
        if (!userAnswer)
            return;

        if (question.type === "multiple_choice" && Array.isArray(userAnswer)) {
            userAnswer.forEach((ans) => {
                const option = question.options.find((opt) => opt.text === ans);
                if (option) totalScore += option.score || 0;
            })
        }

        if (question.type === "single_choice" && typeof userAnswer === "string") {
            const option = question.options.find((opt) => opt.text === userAnswer);
            if (option) totalScore += option.score || 0;
        }

    });
    return totalScore;
}

const getSurveyHistoryByMember = async (member_id) => {
    const [rows] = await db.execute("SELECT s.survey_id, u.fullname, se.response, se.`date`, se.member_version FROM Survey_enrollment se JOIN Survey s ON se.survey_id = s.survey_id JOIN Users u ON se.member_id = u.user_id WHERE u.user_id = ?",
        [member_id]
    );
    return rows;
}

const addEnrollmentSurvey = async (survey_id, member_id, response, member_version) => {
    const [rows] = await db.execute("INSERT INTO Survey_enrollment (survey_id, member_id, response, date, member_version) VALUES(?, ?, ?, NOW(), ?)",
        [survey_id, member_id, response, member_version]
    );
    return rows;

}



module.exports = {
    listOfSurvey,
    findSurveyByType,
    findSurveyBySurveyID,
    findSurveyByTypeAndVersion,
    calculateScore,
    getSurveyHistoryByMember,
    addEnrollmentSurvey
}