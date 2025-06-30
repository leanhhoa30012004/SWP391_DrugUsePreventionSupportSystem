const db = require("../../config/db.config");

const createMember = async ({ username, password, email, fullname, birthday }) => {
  const [rows] = await db.execute(
    "INSERT INTO Users (username, password, email, fullname, role, birthday) VALUES (?, ?, ?, ?, 'member', ?)",
    [username, password, email, fullname, birthday]
  );
  return rows;
};

const findByUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE username = ? AND role = 'member' AND is_active = 1",
    [username]
  );
  return rows[0];
};
const findByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE email = ? AND role = 'member' AND is_active = 1",
    [email]
  );
  return rows[0];
};

const updateResetToken = async (email, token, expiry) => {
  await db.execute(
    "UPDATE Users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [token, expiry, email]
  );
};

const findByResetToken = async (token) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE reset_token = ? AND reset_token_expiry > NOW()",
    [token]
  );
  return rows[0];
};

const updatePassword = async (id, newPassword) => {
  await db.execute(
    "UPDATE Users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE member_id = ?",
    [newPassword, id]
  );
};

const updateTokenUser = async (user_id, tokens) => {
  const rows = await db.execute(
    `UPDATE Users
SET google_token = ?
WHERE user_id = ? AND is_active = 1`, [tokens, user_id]
  );
  return rows;
}

module.exports = {
  createMember,
  findByUsername,
  findByEmail,
  updateResetToken,
  findByResetToken,
  updatePassword,
  updateTokenUser
};
