const consultationModel = require('../models/consultation.model');
const { getAuthUrl, getOAuth2Client } = require('../../config/googleAuth.config');
const memberModel = require('../models/member.model');
const createMeetConfig = require('../../config/createMeet.config');


exports.checkAppointment = async (req, res) => {
    const { member_id, appointment_date, appointment_time } = req.params;
    // console.log(await consultationModel.checkAppointmentByMemberId(member_id, appointment_date, appointment_time))
    let status = false;
    let booked = false;
    try {
        const checkup = await consultationModel.checkAppointmentByMemberId(member_id, appointment_date, appointment_time)
        if (checkup) {
            booked = true;
        }
        else {
            const freetime = await consultationModel.getConsultantFreeTime(appointment_date, appointment_time);
            if (freetime.countByTime === 0)
                status = true;
        }
        return res.json({ "status": status, "booked": booked })
    } catch (error) {
        console.log('checkAppointment error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.addAppointment = async (req, res) => {
    const { member_id, appointment_date, appointment_time } = req.body;
    try {
        // const checkMemberRequestAppointment = await consultationModel.getRequestAppointmentByMemberIdAndDate(member_id, request_date, request_time);
        // if (checkMemberRequestAppointment === 1) return res.json('You cannot book multiple appointments at the same time!')
        const getConsultantFree = await consultationModel.getConsultantFreeTime(appointment_date, appointment_time)
        const isInsert = await consultationModel.addAppointment(member_id, appointment_date, appointment_time, getConsultantFree.user_id);
        if (isInsert)
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

exports.getAllAppointmentByConsultantId = async (req, res) => {
    const consultant_id = req.params.consultant_id;
    try {
        const rows = await consultationModel.getAllAppointmentByConsultantId(consultant_id);
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
        // console.log('token>>>', tokens)

        const row = await memberModel.updateTokenUser(consultant_id, JSON.stringify(tokens))
        if (!row) throw error
        return res.send('Google Calender connected successfully!')

    } catch (error) {
        console.error('OAuth2 callback error:', error);
        res.status(500).send('Error authenticating with Google')
    }
}


exports.rejectAppointment = async (req, res) => {
    const appointment_id = req.params.appointment_id;
    try {
        if (await consultationModel.rejectAppointment(appointment_id))
            return res.json('Your appointment has been cancelled!');
        else res.json('Your appointment cannot be canceled!')
    } catch (error) {
        console.error('deleteRequestAppointment:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }


}

exports.createMeetLink = async (req, res) => {
    const appointment_id = req.params.appointment_id;
    try {
        const appointment = await consultationModel.getAppointmentById(appointment_id);
        const dateStr = (new Date(appointment.appointment_date)).toISOString().slice(0, 10);
        // console.log(">>>>>>>>>>>", appointment.appointment_time)
        const timeStr = appointment.appointment_time.slice(0, 5);
        const meetLink = await createMeetConfig.createMeetEvent(appointment.consultant_id, dateStr, timeStr);
        const row = await consultationModel.createMeetLink(appointment.consultant_id, appointment_id, meetLink);

        if (!row) return res.json('Fail to create meet link!')
        return res.json('Create meet link successfully!')
    } catch (error) {
        console.error('AcceptAppointmentRequest:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.getAllAppointment = async (req, res) => {
    let { appointment_date, appointment_time } = req.params;
    if (!appointment_date || appointment_date.startsWith(':')) appointment_date = ''
    if (!appointment_time || appointment_time.startsWith(':')) appointment_time = ''
    try {
        const listAppointment = await consultationModel.getAllAppointment(appointment_date, appointment_time);
        return res.json(listAppointment);
    } catch (error) {
        console.error('getAllAppointment:', error)
        res.status(500).json({ error: error.message || "Interenal Server Error" })
    }
}

exports.completeAppointment = async (req, res) => {
    const appointment_id = req.params.appointment_id;
    try {
        const isComplete = await consultationModel.completeAppointment(appointment_id);
        if (isComplete) return res.json('Appointment completed!')
        else return res.json('Appointment not yet completed!')
    } catch (error) {
        console.error('completeAppointment:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }

}