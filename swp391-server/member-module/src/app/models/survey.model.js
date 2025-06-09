const db = require("../../config/db.config")

const listOfSurvey = async () => {
    const [rows] = await db.execute("SELECT * FROM Survey WHERE is_active = 1")
    return rows;
}

const findSurveyByType = async (type) => {
    const searchType = `%${type}%`;
    const [rows] = await db.execute("SELECT * FROM Survey WHERE survey_type like ? AND is_active = 1", [searchType]);
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

module.exports = {
    listOfSurvey,
    findSurveyByType,
    calculateScore
}