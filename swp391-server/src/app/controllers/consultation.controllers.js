const consultationModel = require('../models/consultation.model');
const { getAuthUrl, getOAuth2Client } = require('../../config/googleAuth.config');
const memberModel = require('../models/member.model');
const createMeetConfig = require('../../config/createMeet.config');


exports.checkAppointment = async (req, res) => {
    const { request_date, request_time } = req.params;
    try {
        const numberOfAppointment = await consultationModel.numberOfRequestAppointment(request_date, request_time);
        const numberOfConsultant = await consultationModel.numberOfConsultant();
        if (numberOfAppointment.count_by_date < numberOfConsultant[0].numberOfConsultant * 3) {
            if (numberOfAppointment.count_by_time < 2) {
                res.json(true);
            } else res.json(false);
        } else res.json(false)
    } catch (error) {
        console.log('checkAppointment error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.addRequestAppointment = async (req, res) => {
    const { member_id, request_date, request_time } = req.body;
    try {
        const rows = await consultationModel.addRequestAppointment(member_id, request_date, request_time);
        if (!rows)
            res.json('Your request has been recorded by the system. Please wait for the latest notification.')
        else res.json('somethings wrong!')
    } catch (error) {
        console.log('addRequestAppointment error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.getAllAppointmentByMemberId = async (req, res) => {
    const member_id = req.params.member_id;
    try {
        const rows = await consultationModel.getAllAppointmentByMemberId(member_id);
        res.json(rows);
    } catch (error) {
        console.log('getAllAppointmentByMemberId error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.getAllRequestAppointmentForConsultant = async (req, res) => {
    try {
        const rows = await consultationModel.getAllRequestAppointmentForConsultant();
        res.json(rows);
    } catch (error) {
        console.log('getAllRequestAppointmentForConsultant error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.getAuthUrl = async (req, res) => {
    try {
        const consultant_id = req.params.consultant_id;
        const url = getAuthUrl(consultant_id);
        res.json({ url })
    } catch (error) {
        console.log('getAuthUrl error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.oAuth2CallBack = async (req, res) => {
    const code = req.query.code;
    const consultant_id = req.query.state;
    const oAuth2Client = getOAuth2Client();
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log('token>>>', tokens)
        const row = await memberModel.updateTokenUser(consultant_id, JSON.stringify(tokens))
        if (!row) throw error
        return res.send('Google Calender connected successfully!')

    } catch (error) {
        console.error('OAuth2 callback error:', error);
        res.status(500).send('Error authenticating with Google')
    }
}

exports.acceptAppointmentRequest = async (req, res) => {
    const { consultant_id, assign_by } = req.params;
    const { request_id, appointment_id, date, time } = req.body;
    try {
        await consultationModel.acceptAppointment(request_id, consultant_id, assign_by)
        const meetLink = await createMeetConfig.createMeetEvent(consultant_id, date, time);
        const row = await consultationModel.createMeetLink(consultant_id, appointment_id, meetLink);
        if (!row) return res.json('Fail to create meet link!')
        return res.json('Create meet link successfully!')
    } catch (error) {
        console.error('AcceptAppointmentRequest:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}