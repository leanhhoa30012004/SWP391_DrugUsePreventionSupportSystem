const surveyModel = require('../models/survey.model')

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
    const { type } = req.body;
    try {
        const survey = await surveyModel.findSurveyByType(type);
        res.json(survey);
    } catch (error) {
        console.log('findSurveyByType error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.findSurveyBySurveyId = async (req, res) => {
    const { survey_id } = req.body;
    try {
        const survey = await surveyModel.findSurveyBySurveyID(survey_id)
        res.json(survey);
    } catch (error) {
        console.log('findSurveyBySurveyId error: ', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.submitSurvey = async (req, res) => {

    try {
        const { survey_id, answers, member_id, member_version } = req.body;


        // Lấy survey từ DB theo loại
        const rows = await surveyModel.findSurveyBySurveyID(survey_id);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Survey not found" });
        }

        const surveyContent = rows.content;

        // Tính điểm
        const totalScore = surveyModel.calculateScore(surveyContent, answers);
        const addEnrollment = await surveyModel.addEnrollmentSurvey(survey_id, member_id, answers, member_version)
        if (!addEnrollment) {
            return res.status(500).json({ error: "Failed to add enrollment" });
        }


        if (!survey_id || !answers) {
            return res.status(400).json({ error: "Missing survey_id or answers" });
        }

        res.json({ totalScore });
    } catch (error) {
        console.error("submitSurvey error or addEnrollmentSurvey:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getSurveyHistoryByMember = async (req, res) => {
    const { user_id } = req.body;

    // Validate input
    if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
    }

    try {
        const memberHistorySurvey = await surveyModel.getSurveyHistoryByMember(user_id);

        // Check if data exists
        if (!memberHistorySurvey || memberHistorySurvey.length === 0) {
            return res.json({ consultHistorySurvey: [] });
        }

        // Process data with proper async handling
        const consultHistorySurvey = await Promise.all(
            memberHistorySurvey.map(async (historySurvey) => {
                try {
                    // Get survey data with error handling
                    const surveyData = await surveyModel.findSurveyBySurveyID(historySurvey.survey_id);

                    if (!surveyData || !surveyData.content) {
                        console.warn(`Survey content not found for ID: ${historySurvey.survey_id}`);
                        return {
                            survey_id: historySurvey.survey_id,
                            memberName: historySurvey.fullname,
                            score: 0, // Default score
                            date: historySurvey.date,
                            version: historySurvey.version,
                            error: "Survey content not found"
                        };
                    }
                    // Check if response and answers exist
                    // const answers = JSON.parse(historySurvey.response);
                    const score = surveyModel.calculateScore(surveyData.content, JSON.parse(historySurvey.response));

                    return {
                        survey_id: historySurvey.survey_id,
                        memberName: historySurvey.fullname,
                        score: score,
                        date: historySurvey.date,
                        version: historySurvey.version
                    };

                } catch (itemError) {
                    console.error(`Error processing survey ${historySurvey.survey_id}:`, itemError);
                    return {
                        survey_id: historySurvey.survey_id,
                        memberName: historySurvey.fullname,
                        score: 0,
                        date: historySurvey.date,
                        version: historySurvey.version,
                        error: "Processing error"
                    };
                }
            })
        );

        res.json({ consultHistorySurvey });

    } catch (error) {
        console.error("getSurveyHistoryByMember error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};