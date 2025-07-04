const db = require("../../config/db.config");
const bcrypt = require('bcryptjs');

const addAppointment = async (member_id, appointment_date, appointment_time, consultant_id) => {
    const [rows] = await db.execute(`INSERT INTO Appointment (member_id, appointment_date, appointment_time, date_sent_request, consultant_id)
VALUES(?, ?, ?, NOW(), ?)`, [member_id, appointment_date, appointment_time, consultant_id])
    return rows.affectedRows > 0;
}

const numberOfConsultant = async () => {
    const row = await db.execute(`SELECT COUNT(u.user_id) AS numberOfConsultant
FROM Users u WHERE u.role = 'consultant' AND u.is_active = 1`);
    return row[0];
}

const numberOfRequestAppointment = async (appointment_date, appointment_time) => {
    const [rows] = await db.execute(`SELECT
    COUNT(CASE WHEN appointment_date  = ? AND is_active = 1 THEN appointment_id  END) AS count_by_date,
    COUNT(CASE WHEN  appointment_date  = ? AND appointment_time  = ? AND is_active = 1 THEN appointment_id  END) AS count_by_time
FROM Appointment `, [appointment_date, appointment_date, appointment_time]);
    return rows;
}

const getAllAppointmentByMemberId = async (member_id) => {
    const [rows] = await db.execute(`SELECT appointment_id, appointment_date, appointment_time, date_sent_request, status, meeting_link 
FROM Appointment WHERE member_id = ? AND is_active = 1`, [member_id])
    return rows;
}

const getAllApointmentByConsultantId = async (consultant_id) => {
    const [rows] = await db.execute(`SELECT u.fullname, a.date_sent_request, a.appointment_date, a.appointment_time, a.status, a.meeting_link
FROM Appointment a JOIN Users u ON a.member_id = u.user_id
WHERE a.consultant_id = ? AND a.is_active = 1`, [consultant_id])
    return rows;

}

const createMeetLink = async (consultant_id, appointment_id, meetLink) => {
    const [rows] = await db.execute('UPDATE Appointment SET meeting_link = ? WHERE consultant_id = ? AND appointment_id = ?',
        [meetLink, consultant_id, appointment_id]
    )
    return rows;
}



// const getRequestAppointmentByMemberIdAndDate = async (member_id, request_date, request_time) => {
//     const [rows] = await db.execute(`SELECT * FROM Request_appointment 
// WHERE member_id = ? AND request_time  = ? AND request_date = ? AND is_active = 1`, [member_id, request_time, request_date]);
//     return rows.length > 0 ? 1 : 0;
// }


const checkAppointmentByMemberId = async (member_id, appointment_date, appointment_time) => {
    const [rows] = await db.execute(`SELECT *
FROM Appointment WHERE member_id = ? AND appointment_date = ? AND appointment_time = ? AND is_active = 1`, [member_id, appointment_date, appointment_time])
    return rows.length > 0 ? true : false
}

const deleteRequestAppointment = async (appointment_id) => {
    const [rows] = await db.execute(`UPDATE Appointment SET is_active = 0
WHERE appointment_id = ?`, [appointment_id]);
    return rows.affectedRows > 0;
}

const getConsultantFreeTime = async (appointment_date, appointment_time) => {
    const [rows] = await db.execute(`SELECT u.user_id, COUNT(CASE 
    WHEN a.appointment_date = ? AND a.appointment_time = ? THEN a.appointment_id 
    END) AS countByTime,
    COUNT(CASE
    	WHEN a.appointment_date = ? THEN a.appointment_id
    END) AS countByDate
FROM Users u
LEFT JOIN Appointment a ON a.consultant_id = u.user_id
WHERE u.role = 'consultant' AND a.is_active = 1
GROUP BY u.user_id
ORDER BY countByTime , countByDate;`, [appointment_date, appointment_time, appointment_date])
    console.log(rows[0])
    return rows[0];
}

const getAppointmentById = async (appointment_id) => {
    const [row] = await db.execute(`SELECT consultant_id , appointment_date , appointment_time 
FROM Appointment
WHERE appointment_id = ? AND is_active = 1`, [appointment_id])
    return row[0];
}


module.exports = {
    addAppointment,
    numberOfConsultant,
    numberOfRequestAppointment,
    getAllAppointmentByMemberId,
    getAllApointmentByConsultantId,
    createMeetLink,
    // getRequestAppointmentByMemberIdAndDate,
    deleteRequestAppointment,
    checkAppointmentByMemberId,
    getConsultantFreeTime,
    getAppointmentById
}