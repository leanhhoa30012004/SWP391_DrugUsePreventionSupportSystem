const reportModel = require('../models/report.models');
exports.getReportNumberOfSurveyDone = async (req, res) => {
    try {
        const { period, date, year, week, month } = req.params;
        const params = { date, year, week, month };
        const count = await reportModel.reportNumberOfSurveyDone(period, params);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching survey report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getReportNumberOfCoursesDone = async (req, res) => {
    try {
        const { period, date, year, week, month } = req.params;
        const params = { date, year, week, month };
        const count = await reportModel.reportNumberOfCoursesDone(period, params);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching course report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}   
exports.getReportNumberOfAppointmentsDone = async (req, res) => {
    try {
        const { period, date, year, week, month } = req.params;
        const params = { date, year, week, month };
        const count = await reportModel.reportNumberOfAppointmentsDone(period, params);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching appointment report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getReportNumberOfMembers = async (req, res) => {
    try {
        const { total, active, percentage } = await reportModel.reportNumberOfActiveUsers();
        res.status(200).json({ total, active, percentage });
    } catch (error) {
        console.error("Error fetching member report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getReportNumberOfMembersByRole = async (req, res) => {
    try {
        const count = await reportModel.reportNumberOfUsersEachRole();
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching member by role report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getReportNumberOfAppointmentsDoneEachConsultant = async (req, res) => {
    try {
        const { period, date, year, week, month, consultantId } = req.params;
        console.log(period, date, year, week, month, consultantId);
        const params = { date, year, week, month };
        const count = await reportModel.reportNumberOfAppointmentsDoneByEachConsultant(consultantId, period, params);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching appointment by consultant report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
