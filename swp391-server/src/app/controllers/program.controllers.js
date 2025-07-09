const { json } = require('express');
const programModel = require('../models/program.model');

exports.getAllCommunityProgram = async (req, res) => {
    try {
        const listProgram = await programModel.getAllCommunityProgram();
        if (!listProgram) return res.json('There are no programs in system!')
        return res.json(listProgram);
    } catch (error) {
        console.error("Error getAllCommnunityProgram:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.numberOfParticipantProgram = async (req, res) => {
    try {
        const number = await programModel.numberParticipantProgram();
        return res.json(number);
    } catch (error) {
        console.error("Error numberOfParticipantProgram:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.registeredProgram = async (req, res) => {
    const { program_id, member_id } = req.params
    try {
        const isRegistered = programModel.registeredProgram(program_id, member_id);
        if (isRegistered) return res.json('Registered successfully!');
        return res.json('Register Failed!')
    } catch (error) {
        console.error("Error registeredProgram:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.markParticipantAsPresent = async (req, res) => {
    const { program_id, member_id } = req.params;
    try {
        const isMarked = programModel.markParticipantAsPresent(program_id, member_id);
        if (isMarked) return res.json('Marked succesfully!');
        return res.json('Mark Failed!')
    } catch (error) {
        console.error("markParticipantAsPresent: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.submitResponse = async (req, res) => {
    const program_id = req.params.program_id;
    const survey_response = req.body;

    try {
        const program = await programModel.getProgramById(program_id);
        if (!program)
            return res.json(`This program doesn't exist!`);

        let responseData = program.response;
        let i = 0;

        if (survey_response.type === 'pre') {
            responseData.pre_response.forEach(item => {
                item.push(survey_response.answer[i]);
                i++;
            });
        } else if (survey_response.type === 'post') {
            responseData.post_response.forEach(item => {
                item.push(survey_response.answer[i]);
                i++;
            });
        }

        // console.log(JSON.stringify(responseData))

        const isUpdated = await programModel.updateResponseProgram(program_id, JSON.stringify(responseData));
        console.log(isUpdated)
        if (isUpdated)
            return res.json('Submit successful!');
        else
            return res.json('Submit failed!');
    } catch (error) {
        console.error("submitResponse: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

