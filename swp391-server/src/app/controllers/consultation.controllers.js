const consultationModel = require('../models/consultation.model');

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