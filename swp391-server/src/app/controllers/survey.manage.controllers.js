const surveyModels = require("../models/survey.model");
exports.createSurvey = async (req, res) => {
  console.log("req.body:", req.body);
  const { survey_type, content } = req.body;
  const created_by = req.user.user_id; // Assuming user_id is set in the request by authentication middleware
  try {
    const survey_id = await surveyModels.addSurvey({
      survey_type,
      content: JSON.stringify(content),
      created_by,
    });
    res.status(201).json({ message: "Survey created successfully", survey_id });
  } catch (error) {
    console.error("Error creating survey:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
exports.updateSurvey = async (req, res) => {
  const { survey_id, content } = req.body;


  const edited_by = req.user.user_id; // Assuming user_id is set in the request by authentication middleware
  try {
    const result = await surveyModels.updateSurvey({
      survey_id: survey_id,
      content: JSON.stringify(content),
      edited_by: edited_by,
    });
    res.json({ message: "Survey updated successfully", result });
  } catch (error) {
    console.error("Error updating survey:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
exports.deleteSurvey = async (req, res) => {
  const survey_id = req.params.id;
  try {
    await surveyModels.deleteSurvey(survey_id);
    res.json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
