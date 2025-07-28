const consultationModel = require('../models/consultation.model');
const memberModel = require('../models/member.model');
const createMeetConfig = require('../../config/createMeet.config');
const { pushNotice } = require('../models/notice.helper.model');
const cloudinary = require('../../service/cloudinary.service')
const fs = require('fs')

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
            const ListConsultant = await consultationModel.getConsultantFreeTime(appointment_date, appointment_time);
            const ListConsultantFree = ListConsultant.filter(freetime => freetime.countByTime === 0);
            if (ListConsultantFree != null && ListConsultantFree.length > 0)
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
        const ListConsultant = await consultationModel.getConsultantFreeTime(appointment_date, appointment_time)
        const ListConsultantFree = ListConsultant.filter(freetime => freetime.countByTime === 0);
        const freeConsultant = ListConsultantFree[Math.floor(Math.random() * ListConsultantFree.length)];
        const appointment_id = await consultationModel.addAppointment(member_id, appointment_date, appointment_time, freeConsultant.user_id);
        const memberInfo = await memberModel.findById(member_id);
        // create meet link
        const meetLink = await createMeetConfig.createMeetEvent(freeConsultant.user_id, appointment_date, appointment_time, member_id);

        const isSuccess = await consultationModel.createMeetLink(freeConsultant.user_id, appointment_id, meetLink);
        if (!isSuccess) return res.json('Fail to create meet link!');
        // if success, system will send email to member and consultant
        //send mail with meet link
        await consultationModel.sendAppointmentEmail(memberInfo.email, {
            member_name: memberInfo.fullname,
            appointment_date: appointment_date,
            appointment_time: appointment_time,
            consultant_name: freeConsultant.fullname,
            meeting_link: meetLink
        });
        //send notice to member
        await pushNotice({
            userID: member_id,
            title: 'Appointment Booking Confirmation',
            message: `Your appointment with ${freeConsultant.fullname} on ${appointment_date} at ${appointment_time} has been successfully created. Check your email for the meeting link.`,
            type: 'success',
            redirect_url: `/appointments/${appointment_id}`
        });
        //send notice to consultant
        await pushNotice({
            userID: freeConsultant.user_id,
            title: 'New Appointment with Member' + memberInfo.fullname,
            message: `You have a new appointment request from ${memberInfo.fullname} on ${appointment_date} at ${appointment_time}.`,
            type: 'info',
            redirect_url: `/appointments/${appointment_id}`
        });
        res.json({ message: 'Appointment created successfully! Check your email to get meeting link', appointment_id });
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
        console.log("Consultant ID param:", req.params.consultant_id); // thêm dòng này

        const rows = await consultationModel.getAllAppointmentByConsultantId(consultant_id);
        res.json(rows);
    } catch (error) {
        console.log('getAllRequestAppointmentForConsultant error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

exports.rejectAppointment = async (req, res) => {
    const appointment_id = req.params.appointment_id;
    const is_active = req.params.is_active
    try {
        const appointment = await consultationModel.getAppointmentById(appointment_id)
        if (await consultationModel.rejectOrActiveAppointment(appointment_id, is_active)) {
            //send notice to member
            console.log(is_active)
            await pushNotice({
                userID: appointment.member_id,
                title: `Appointment ID ${appointment_id} ${is_active == 1 ? 'Accepted' : 'Rejected'}`,
                message: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} has been ${is_active == 1 ? 'Accepted' : 'Rejected'}.`,
                type: 'warning',
                redirect_url: `/profile`
            });

            return res.json('Your appointment has been cancelled!');
        }
        else res.json('Your appointment cannot be canceled!')
    } catch (error) {
        console.error('deleteRequestAppointment:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }


}

// exports.createMeetLink = async (req, res) => {
//     const appointment_id = req.params.appointment_id;
//     try {
//         const appointment = await consultationModel.getAppointmentById(appointment_id);
//         const dateStr = (new Date(appointment.appointment_date)).toISOString().slice(0, 10);
//         // console.log(">>>>>>>>>>>", appointment.appointment_time)
//         const timeStr = appointment.appointment_time.slice(0, 5);
//         const meetLink = await createMeetConfig.createMeetEvent(appointment.consultant_id, dateStr, timeStr);
//         const row = await consultationModel.createMeetLink(appointment.consultant_id, appointment_id, meetLink);

//         if (!row) return res.json('Fail to create meet link!')
//         return res.json('Create meet link successfully!')
//     } catch (error) {
//         console.error('AcceptAppointmentRequest:', error)
//         res.status(500).json({ error: error.message || "Internal Server Error" })
//     }
// }


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
        if (isComplete) {
            //send notice to member
            const appointment = await consultationModel.getAppointmentById(appointment_id)
            await pushNotice({
                userID: appointment.member_id,
                title: 'Appointment Completed',
                message: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} has been completed.`,
                type: 'success',
                redirect_url: `/appointments/${appointment_id}`
            });
            return res.json('Appointment completed!')
        }
        else return res.json('Appointment not yet completed!')
    } catch (error) {
        console.error('completeAppointment:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.updateCertificate = async (req, res) => {
    const { certificate_name, expired, certificate_id } = req.body;
    let certificate_img = '';
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads'
            })
            // get url from cloudinary
            certificate_img = result.secure_url;
            console.log(certificate_img)
            // delete local uploads
            fs.unlinkSync(req.file.path)
        }
        const certificate = { certificate_name, expired, certificate_id, certificate_img }

        const isUpdate = await consultationModel.updateConsultantProfile(certificate);
        if (!isUpdate)
            res.json('Update failed!')
        res.json('Updated sucessfully!')
    } catch (error) {
        console.error('updateCertificate:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.addCertificate = async (req, res) => {
    const { consultant_id, certificate_name, expired, certificate_id } = req.body;
    let certificate_img = ''
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads'
            })
            certificate_img = result.secure_url;
            console.log(certificate_img)
            fs.unlinkSync(req.file.path)
        }
        const certificate = { consultant_id, certificate_name, expired, certificate_id, certificate_img }


        const isAdd = await consultationModel.addConsultantProfile(certificate)
        if (!isAdd)
            res.json('Add failed!')
        res.json('Added Successfully!')
    } catch (error) {
        console.error('addCertificate:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.getCertificateByConsultantId = async (req, res) => {
    const consultant_id = req.params.consultant_id;
    try {
        const certificates = await consultationModel.getConsultantProfileByConsultantId(consultant_id)
        if (!certificates)
            res.json("This consultant doesn't have any certificate")
        res.json(certificates)
    } catch (error) {
        console.error('findCertificateByConsultantId:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.approveCertificateRequest = async (req, res) => {
    const certificate_id = req.params.certificate_id;
    try {
        const isApprove = await consultationModel.approveCertificateRequest(certificate_id)
        if (!isApprove)
            res.json('Approve failed!')
        res.json('Approved successfully!')
    } catch (error) {
        console.error('approveCertificateRequest:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

exports.rejectCertificateRequest = async (req, res) => {
    const certificate_id = req.params.certificate_id;
    const { reject_reason } = req.body;
    try {
        const isReject = await consultationModel.rejectCertificateRequest(certificate_id, reject_reason);
        if (!isReject)
            res.json('Reject failed!')
        res.json('Rejected successfully!')
    } catch (error) {
        console.error('rejectCertificateRequest:', error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}