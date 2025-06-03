const db = require("../../config/db.config");

const createMember = async ({ username, password, email, fullname }) => {
  const [rows] = await db.execute(
    "INSERT INTO Member (username, password, email, fullname) VALUES (?, ?, ?, ?)",
    [username, password, email, fullname]
  );
  return rows;
};

const findByUsername = async (username) => {
  const [rows] = await db.execute("SELECT * FROM Member WHERE username = ?", [
    username,
  ]);
  return rows[0];
};

const findByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM Member WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

const updateResetToken = async (email, token, expiry) => {
  await db.execute(
    "UPDATE Member SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [token, expiry, email]
  );
};

const findByResetToken = async (token) => {
  const [rows] = await db.execute(
    "SELECT * FROM Member WHERE reset_token = ? AND reset_token_expiry > NOW()",
    [token]
  );
  return rows[0];
};

const updatePassword = async (id, newPassword) => {
  await db.execute(
    "UPDATE Member SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE member_id = ?",
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
