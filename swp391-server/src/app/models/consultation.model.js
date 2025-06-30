const db = require("../../config/db.config");
const bcrypt = require('bcryptjs');

const addRequestAppointment = async (member_id, request_date, request_time) => {
    const [rows] = await db.execute(`INSERT INTO Request_appointment (member_id, date_sent_request, request_date, request_time)
VALUES (?,NOW(),?,?)`, [member_id, request_date, request_time])
    return rows[0];
}

const numberOfConsultant = async () => {
    const row = await db.execute(`SELECT COUNT(u.user_id) AS numberOfConsultant
FROM Users u WHERE u.role = 'consultant' AND u.is_active = 1`);
    return row[0];
}

const numberOfRequestAppointment = async (request_date, request_time) => {
    const [rows] = await db.execute(`SELECT
    COUNT(CASE WHEN request_date = ? AND is_active = 1 THEN request_id END) AS count_by_date,
    COUNT(CASE WHEN  request_date = ? AND request_time = ? AND is_active = 1 THEN request_id END) AS count_by_time
FROM Request_appointment;`, [request_date, request_date, request_time]);
    return rows[0];
}

const getAllAppointmentByMemberId = async (member_id) => {
    const [rows] = await db.execute(`SELECT ra.date_sent_request, ra.request_date, ra.request_time, ra.is_confirm FROM Request_appointment ra
WHERE ra.is_active = 1 AND ra.member_id = ?`, [member_id])
    return rows;
}

const getAllRequestAppointmentForConsultant = async () => {
    const [rows] = await db.execute(`SELECT ra.request_id, ra.member_id, ra.date_sent_request, ra.request_date, ra.request_time, ra.is_confirm FROM Request_appointment ra WHERE ra.is_confirm = 'pending' AND ra.is_active = 1`)
    return rows;

}

const createMeetLink = async (consultant_id, appointment_id, meetLink) => {
    const [rows] = await db.execute('UPDATE Appointment SET meeting_link = ? WHERE consultant_id = ? AND appointment_id = ?',
        [meetLink, consultant_id, appointment_id]
    )
    return rows;
}

const acceptAppointment = async (request_id, consultant_id, assign_by) => {
    const [rows] = await db.execute('INSERT INTO Appointment (request_id, consultant_id, confirm_at, assign_by) VALUES(?, ?, NOW(), ?)',
        [request_id, consultant_id, assign_by]
    )
    return rows;
}

module.exports = {
    addRequestAppointment,
    numberOfConsultant,
    numberOfRequestAppointment,
    getAllAppointmentByMemberId,
    getAllRequestAppointmentForConsultant,
    createMeetLink,
    acceptAppointment
}