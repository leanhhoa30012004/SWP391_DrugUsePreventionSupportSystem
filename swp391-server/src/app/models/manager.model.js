const db = require("../../config/db.config");

const createUser = async ({
  username,
  password,
  email,
  fullname,
  role,
  birthday,
}) => {
  const [existRows] = await db.execute(
    "SELECT user_id FROM Users WHERE email = ?",
    [email]
  );
  if (existRows.length > 0) {
    return { error: true, message: "Email was used. You must change another Email!" };
  }

  const [rows] = await db.execute(
    "INSERT INTO Users (username, password, email, fullname, role, birthday) VALUES (?, ?, ?, ?, ?, ?)",
    [username, password, email, fullname, role, birthday]
  );
  return { userId: rows.insertId, message: "User created successfully" };
};

const changeProfile = async (id, { fullname, email, password, birthday }) => {
  await db.execute(
    "UPDATE Users SET fullname = ?, email = ?, password = ?, birthday = ? WHERE user_id = ?",
    [fullname, email, password, birthday, id]
  );
  return { message: "Profile updated successfully" };
};

const findByUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT user_id, username, password, email, fullname, role, birthday, is_active FROM Users WHERE username = ? AND is_active = 1 AND (role = 'manager' OR role = 'admin')",
    [username]
  );
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE user_id = ? AND is_active = 1 AND (role = 'manager' OR role = 'admin')",
    [id]
  );
  return rows[0];
};

// Thêm function để tìm manager theo email
const findByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT user_id, username, password, email, fullname, role, birthday, is_active FROM Users WHERE email = ? AND is_active = 1 AND (role = 'manager' OR role = 'admin')",
    [email]
  );
  return rows[0];
};

// Thêm function để update reset token
const updateResetToken = async (email, token, expiry) => {
  await db.execute(
    "UPDATE Users SET reset_token = ?, reset_token_expiry = ? WHERE email = ? AND (role = 'manager' OR role = 'admin')",
    [token, expiry, email]
  );
};

// Thêm function để tìm manager theo reset token
const findByResetToken = async (token) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE reset_token = ? AND reset_token_expiry > NOW() AND (role = 'manager' OR role = 'admin')",
    [token]
  );
  return rows[0];
};

// Thêm function để update password
const updatePassword = async (id, newPassword) => {
  await db.execute(
    "UPDATE Users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?",
    [newPassword, id]
  );
};

// Thêm function để update user (cho UserManagement)
const updateUser = async (id, { fullname, email, password, role, birthday }) => {
  let query = "UPDATE Users SET fullname = ?, email = ?, birthday = ?, role = ?";
  let params = [fullname, email, birthday, role];
  
  // Add password to update if provided
  if (password) {
    query += ", password = ?";
    params.push(password);
  }
  
  query += " WHERE user_id = ?";
  params.push(id);
  
  await db.execute(query, params);
};

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM Users ");
  return rows;
};

const updateRole = async (id, role) => {
  await db.execute("UPDATE Users SET role = ? WHERE user_id = ?", [role, id]);
};

const toggleUserActive = async (id, is_active) => {
  await db.execute("UPDATE Users SET is_active = ? WHERE user_id = ?", [is_active ? 1 : 0, id]);
};

module.exports = {
  changeProfile,
  createUser,
  findByUsername,
  findById,
  findByEmail,
  updateResetToken,
  findByResetToken,
  updatePassword,
  updateUser,
  updateRole,
  getAllUsers,
  toggleUserActive
};
