const { response, json } = require("express");
const db = require("../../config/db.config");
// return number of survey done by all member in 1 month year week
const reportNumberOfSurveyDone = async (period, params = {}) => {
    let query = "SELECT COUNT(*) as count FROM Survey_enrollment WHERE 1=1 ";
    let queryParams = [];

    if (period === "day" && params.date) {
        query += "AND DATE(date) = ?";
        queryParams.push(params.date); // "YYYY-MM-DD"
    } else if (period === "week" && params.year && params.week) {
        query += "AND YEAR(date) = ? AND WEEK(date, 1) = ?";
        queryParams.push(params.year, params.week); // year, week
    } else if (period === "month" && params.year && params.month) {
        query += "AND YEAR(date) = ? AND MONTH(date) = ?";
        queryParams.push(params.year, params.month); // year, month
    } else if (period === "year" && params.year) {
        query += "AND YEAR(date) = ?";
        queryParams.push(params.year); // year
    } else {
        return 0;
    }

    const [rows] = await db.execute(query, queryParams);
    return rows[0].count;
};
// number of courses done by all member in 1 month or  year or week
const reportNumberOfCoursesDone = async (period, params = {}) => {
    let query = "SELECT COUNT(*) as count FROM Course_enrollment WHERE status = 'completed' ";
    let queryParams = [];

    if (period === "day" && params.date) {
        query += "AND DATE(date) = ?";
        queryParams.push(params.date); // "YYYY-MM-DD"
    } else if (period === "week" && params.year && params.week) {
        query += "AND YEAR(date) = ? AND WEEK(date, 1) = ?";
        queryParams.push(params.year, params.week); // year, week
    } else if (period === "month" && params.year && params.month) {
        query += "AND YEAR(date) = ? AND MONTH(date) = ?";
        queryParams.push(params.year, params.month); // year, month
    } else if (period === "year" && params.year) {
        query += "AND YEAR(date) = ?";
        queryParams.push(params.year); // year
    } else {
        return 0;
    }

    const [rows] = await db.execute(query, queryParams);
    return rows[0].count;
};
// number of appointments done by all member in 1 month or year or week
const reportNumberOfAppointmentsDone = async (period, params = {}) => {
    let query = "SELECT COUNT(*) as count FROM Appointment WHERE 1=1 ";
    let queryParams = [];

    if (period === "day" && params.date) {
        query += "AND DATE(appointment_date) = ?";
        queryParams.push(params.date); // "YYYY-MM-DD"
    } else if (period === "week" && params.year && params.week) {
        query += "AND YEAR(appointment_date) = ? AND WEEK(appointment_date, 1) = ?";
        queryParams.push(params.year, params.week); // year, week
    } else if (period === "month" && params.year && params.month) {
        query += "AND YEAR(appointment_date) = ? AND MONTH(appointment_date) = ?";
        queryParams.push(params.year, params.month); // year, month
    } else if (period === "year" && params.year) {
        query += "AND YEAR(appointment_date) = ?";
        queryParams.push(params.year); // year
    } else {
        return 0;
    }

    const [rows] = await db.execute(query, queryParams);
    return rows[0].count;
};
// number of appointments done by each consultant member in 1 month or year or week
const reportNumberOfAppointmentsDoneByEachConsultant = async (consultantId, period, params = {}) => {
    let query = "SELECT COUNT(*) as count FROM Appointment WHERE consultant_id = ? ";
    let queryParams = [consultantId];
    console.log(`Consultant ID: ${consultantId}, Period: ${period}, Params:`, params);
    if (period === "day" && params.date) {
        query += "AND DATE(appointment_date) = ?";
        queryParams.push(params.date); // "YYYY-MM-DD"
    } else if (period === "week" && params.year && params.week) {
        query += "AND YEAR(appointment_date) = ? AND WEEK(appointment_date, 1) = ?";
        queryParams.push(params.year, params.week); // year, week
    } else if (period === "month" && params.year && params.month) {
        query += "AND YEAR(appointment_date) = ? AND MONTH(appointment_date) = ?";
        queryParams.push(params.year, params.month); // year, month
    } else if (period === "year" && params.year) {
        query += "AND YEAR(appointment_date) = ?";
        queryParams.push(params.year); // year
    } else {
        return 0;
    }

    const [rows] = await db.execute(query, queryParams);
    console.log(rows)
    return rows[0].count;
};
// number of user is active in system
const reportNumberOfActiveUsers = async () => {
    let query = "SELECT COUNT(*) as count FROM Users WHERE 1=1 ";
    const [rows] = await db.execute(query);
    const numberOfUsers = rows[0].count;
    query = "SELECT COUNT(*) as count FROM Users WHERE is_active = 1 ";
    const [activeRows] = await db.execute(query);
    const numberOfActiveUsers = activeRows[0].count;
    return {
        total: numberOfUsers,
        active: numberOfActiveUsers,
        percentage: numberOfActiveUsers / numberOfUsers * 100
    };
};
const reportNumberOfUsersEachRole = async () => {
    let query = "SELECT role, COUNT(*) as count FROM Users WHERE is_active = 1 GROUP BY role";
    const [rows] = await db.execute(query);
    return rows;
}
module.exports = {
    reportNumberOfSurveyDone,
    reportNumberOfActiveUsers,
    reportNumberOfCoursesDone,
    reportNumberOfAppointmentsDone,
    reportNumberOfUsersEachRole,
    reportNumberOfAppointmentsDoneByEachConsultant
};
