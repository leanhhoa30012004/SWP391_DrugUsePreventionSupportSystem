const db = require('../../config/db.config')

const findByUsername = async (username) => {
    const user = db.execute(`SELECT *
FROM Users WHERE username = ? AND role = 'consultant' AND is_active = 1`, [username])
    return user;
}
const findByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM Users WHERE email = ? AND role = 'consultant' AND is_active = 1", [email]);
  return rows[0];
};
const saveGoogleTokens = async (userId, { google_token, google_refresh_token }) => {
  const sql = `
    UPDATE Users
    SET google_token = ?, google_refresh_token = ?
    WHERE user_id = ?
  `;
  await db.execute(sql, [google_token, google_refresh_token, userId]);
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM Users WHERE user_id = ?', [id]);
  return rows[0];
};
module.exports = {
    findByUsername,
    findByEmail,
    saveGoogleTokens,
    findById
}