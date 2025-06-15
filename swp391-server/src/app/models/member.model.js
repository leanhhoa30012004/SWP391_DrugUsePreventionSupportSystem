const db = require("../../config/db.config");

const createMember = async ({ username, password, email, fullname, age }) => {
  const [rows] = await db.execute(
    "INSERT INTO Users (username, password, email, fullname, role, age) VALUES (?, ?, ?, ?, 'member', ?)",
    [username, password, email, fullname, age]
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

module.exports = {
  createMember,
  findByUsername,
  findByEmail,
  updateResetToken,
  findByResetToken,
  updatePassword,
};
