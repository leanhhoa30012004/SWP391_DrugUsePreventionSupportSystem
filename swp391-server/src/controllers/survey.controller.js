const surveyModel = require('../app/models/survey.model')

exports.viewSurvey = async (req, res) => {
    try {
        const listSurvey = await surveyModel.listOfSurvey()
        res.json(listSurvey)
    } catch (error) {
        console.log('viewSurvey error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.findSurveyByType = async (req, res) => {
    const { type } = req.query;
    try {
        const survey = await surveyModel.findSurveyByType(type);
        res.json(survey);
    } catch (error) {
        console.log('findSurveyByType error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.submitSurvey = async (req, res) => {

    try {
        const { survey_type, answers } = req.body;

        if (!survey_type || !answers) {
            return res.status(400).json({ error: "Missing survey_type or answers" });
        }

        // Lấy survey từ DB theo loại
        const rows = await surveyModel.findSurveyByType(survey_type);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Survey not found" });
        }

        const surveyContent = rows.content;

        // Tính điểm
        const totalScore = surveyModel.calculateScore(surveyContent, answers);

        res.json({ totalScore });
    } catch (error) {
        console.error("submitSurvey error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}