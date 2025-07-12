const db = require("../../config/db.config");
const getNoticeByUserId = async (userID) => {
    console.log(">>>>", userID ? userID : "null")
    const [rows] = await db.execute(`
            SELECT * FROM Notice 
            WHERE user_id LIKE ? OR user_id IS NULL 
            ORDER BY date  DESC`, [userID])
    return rows
}
const isCreateNewNotice = async (userID, title, message, type, redirect_url) => {
    let userIDNull = "NULL"
    let isNullID = false
    if (!userID) isNullID = true
    const [result] = await db.execute(`INSERT INTO Notice(user_id, title, message, date, type, redirect_url) VALUES (?,?,?, now(),?,?)`, [isNullID ? userIDNull : userID, title, type, redirect_url])
    return result.affectedRows > 0
}
const isUpdateNoticeStatusIsRead = async (id) => {
    const [result] = await db.execute(`UPDATE Notice  SET is_read = 1 WHERE id = ?  `, [id])
    return result.affectedRows > 0
}
const isMakeReadForAllNotice = async (userID) => {
    const [result] = await db.execute(`UPDATE Notice  SET is_read = 1 WHERE user_id = ? OR user_id IS NULL `, [userID])
    return result.affectedRows > 0
}
module.exports = {
    getNoticeByUserId,
    isCreateNewNotice,
    isUpdateNoticeStatusIsRead,
    isMakeReadForAllNotice
}