const nodemailer = require('nodemailer');
const db = require("../../config/db.config");
const bcrypt = require('bcryptjs');
const addAppointment = async (member_id, appointment_date, appointment_time, consultant_id) => {
    const [result] = await db.execute(`
        INSERT INTO Appointment (member_id, appointment_date, appointment_time, date_sent_request, consultant_id)
        VALUES (?, ?, ?, NOW(), ?)
    `, [member_id, appointment_date, appointment_time, consultant_id]);

    return result.insertId;
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
    const [rows] = await db.execute(`SELECT a.appointment_id,u.fullname ,a.appointment_date, a.appointment_time, a.date_sent_request, a.status , a.meeting_link 
FROM Appointment a JOIN Users u ON a.consultant_id = u.user_id
WHERE a.member_id = ? AND a.is_active = 1`, [member_id])
    return rows;
}

const getAllAppointmentByConsultantId = async (consultant_id) => {
    const [rows] = await db.execute(`SELECT a.appointment_id, a.member_id, u.fullname, a.date_sent_request, a.appointment_date, a.appointment_time, a.status, a.meeting_link
FROM Appointment a JOIN Users u ON a.member_id = u.user_id
WHERE a.consultant_id = ? AND a.is_active = 1`, [consultant_id])
    return rows;

}

const createMeetLink = async (consultant_id, appointment_id, meetLink) => {
    const [rows] = await db.execute(
        'UPDATE Appointment SET meeting_link = ? WHERE consultant_id = ? AND appointment_id = ?',
        [meetLink, consultant_id, appointment_id]
    );
    return rows.affectedRows > 0;
};

const sendAppointmentEmail = async (toEmail, appointmentInfo) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Drug Use Prevention Support System" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Appointment in  ${appointmentInfo.appointment_date} at ${appointmentInfo.appointment_time} Confirmation`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2c3e50;">Appointment Confirmation</h2>
            <p>Dear <strong>${appointmentInfo.member_name}</strong>,</p>
            <p>Your appointment has been successfully scheduled. Here are the details:</p>
            <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px; font-weight: bold;">Date:</td>
                <td style="padding: 8px;">${appointmentInfo.appointment_date}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Time:</td>
                <td style="padding: 8px;">${appointmentInfo.appointment_time}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Consultant:</td>
                <td style="padding: 8px;">${appointmentInfo.consultant_name}</td>
            </tr>
            ${appointmentInfo.meeting_link
                ? `<tr>
                    <td style="padding: 8px; font-weight: bold;">Google Meet:</td>
                    <td style="padding: 8px;"><a href="${appointmentInfo.meeting_link}" style="color: #1a73e8;">${appointmentInfo.meeting_link}</a></td>
                    </tr>`
                : ''
            }
            </table>
            <p style="margin-top: 20px;">Thank you for using our service.</p>
            <p style="color: #888; font-size: 12px;">This is an automated message from Drug Use Prevention Support System.</p>
        </div>
        `,

    };

    await transporter.sendMail(mailOptions);
};



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

const rejectOrActiveAppointment = async (appointment_id, is_active) => {
    const [rows] = await db.execute(`UPDATE Appointment SET is_active = ?
WHERE appointment_id = ?`, [is_active, appointment_id]);
    return rows.affectedRows > 0;

}

const getConsultantFreeTime = async (appointment_date, appointment_time) => {
    const [rows] = await db.execute(`SELECT 
    u.user_id,
    u.fullname, 
    COUNT(CASE 
        WHEN a.appointment_date = ? 
            AND a.appointment_time = ? 
            AND (a.status = 'pending' OR a.status IS NULL)
        THEN a.appointment_id 
    END) AS countByTime,

    COUNT(CASE 
        WHEN a.appointment_date = ? 
            AND (a.status = 'pending' OR a.status IS NULL)
        THEN a.appointment_id 
    END) AS countByDate

FROM Users u
LEFT JOIN Appointment a ON a.consultant_id = u.user_id
WHERE u.role = 'consultant' 
  AND (a.is_active = 1 OR a.is_active IS NULL)
GROUP BY u.user_id
ORDER BY countByTime, countByDate;`, [appointment_date, appointment_time, appointment_date])

    return rows;
}

const getAppointmentById = async (appointment_id) => {
    const [row] = await db.execute(`SELECT * 
FROM Appointment
WHERE appointment_id = ?`, [appointment_id])
    return row[0];
}

const getAllAppointment = async (appointment_date, appointment_time) => {
    const [row] = await db.execute(`SELECT *
FROM Appointment
WHERE appointment_date LIKE ? AND appointment_time LIKE ?
ORDER BY appointment_date, appointment_time, consultant_id, status
`, [`%${appointment_date}%`, `%${appointment_time}%`])
    return row;
}

const changeAppointmentStatus = async (appointment_id, appointment_status) => {
    const [row] = await db.execute(`UPDATE Appointment
SET status = ?
WHERE appointment_id = ?`, [appointment_status, appointment_id])
    return row.affectedRows > 0
}

const updateConsultantProfile = async (certificate) => {
    const [isUpdate] = await db.execute(`UPDATE Consultant_certificate
SET certificate_name = ?, url = ?, expired = ?, date_submit = NOW()
WHERE certificate_id = ? `, [certificate.certificate_name, certificate.certificate_img, certificate.expired, certificate.certificate_id])
    return isUpdate.affectedRows > 0;
}

const addConsultantProfile = async (certificate) => {
    const [isAdd] = await db.execute(`INSERT INTO Consultant_certificate(consultant_id, certificate_name, url, expired, date_submit)
VALUES (?, ?, ?, ?, NOW())`, [certificate.consultant_id, certificate.certificate_name, certificate.certificate_img, certificate.expired]);
    return isAdd.affectedRows > 0;
}

const getConsultantProfileByConsultantId = async (consultant_id) => {
    const [profile] = await db.execute(`SELECT cc.certificate_id, u.fullname, cc.certificate_name, cc.url, cc.expired, cc.date_submit, cc.date_submit, cc.status, cc.reject_reason
FROM Consultant_certificate cc JOIN Users u ON cc.consultant_id = u.user_id
WHERE cc.consultant_id = ?`, [consultant_id])
    return profile;
}

const approveCertificateRequest = async (certificate_id) => {
    const [isApprove] = await db.execute(`UPDATE Consultant_certificate
SET status = 'approved'
WHERE certificate_id = ?`, [certificate_id])
    return isApprove.affectedRows > 0
}

const rejectCertificateRequest = async (certificate_id, reject_reason) => {
    console.log('Rejecting certificate request with ID:', certificate_id, 'Reason:', reject_reason);
    const [isReject] = await db.execute(`UPDATE Consultant_certificate
SET status = 'rejected', reject_reason = ?
WHERE certificate_id = ?`, [reject_reason, certificate_id])
    return isReject.affectedRows > 0
}

const addConsultantRefused = async (appointment_id, consultant_refused) => {
    const [isAdd] = await db.execute(`UPDATE Appointment
SET consultant_refused = ?
WHERE appointment_id = ? AND is_active = 1`, [consultant_refused, appointment_id])
    return isAdd.affectedRows > 0;
}

const changeConsultantInAppointment = async (appointment_id, consultant_id, meeting_link) => {
    const [isChage] = await db.execute(`UPDATE Appointment
SET consultant_id = ?, meeting_link = ?
WHERE appointment_id = ? AND is_active = 1`, [consultant_id, meeting_link, appointment_id]);
    return isChage.affectedRows > 0;
}
module.exports = {
    addAppointment,
    numberOfConsultant,
    numberOfRequestAppointment,
    getAllAppointmentByMemberId,
    getAllAppointmentByConsultantId,
    createMeetLink,
    // getRequestAppointmentByMemberIdAndDate,
    sendAppointmentEmail,
    rejectOrActiveAppointment,
    checkAppointmentByMemberId,
    getConsultantFreeTime,
    getAppointmentById,
    getAllAppointment,
    changeAppointmentStatus,
    updateConsultantProfile,
    addConsultantProfile,
    getConsultantProfileByConsultantId,
    approveCertificateRequest,
    rejectCertificateRequest,
    addConsultantRefused,
    changeConsultantInAppointment,
}