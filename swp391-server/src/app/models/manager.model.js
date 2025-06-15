const db = require("../../config/db.config");

const createUser = async ({
  username,
  password,
  email,
  fullname,
  role,
  age,
}) => {
  const [rows] = await db.execute(
    "INSERT INTO Users (username, password, email, fullname, role, age) VALUES (?, ?, ?, ?, ?, ?)",
    [username, password, email, fullname, role, age]
  );
  return { userId: rows.insertId, message: "User created successfully" };
};
const changeProfile = async (id, { fullname, email, password }) => {
  await db.execute(
    "UPDATE Users SET fullname = ?, email = ?, password = ? WHERE user_id = ?",
    [fullname, email, password, id]
  );
  return { message: "Profile updated successfully" };
};
const findByUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE username = ? AND is_active = 1 AND (role = 'manager' OR role = 'admin')",
    [username]
  );
  return rows[0];
};
const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM Users ");
  return rows;
};
const updateRole = async (id, role) => {
  await db.execute("UPDATE Users SET role = ? WHERE user_id = ?", [role, id]);
};
const deleteUser = async (id) => {
  await db.execute("UPDATE Users SET is_active = 0 WHERE user_id = ?", [id]);
};

module.exports = {
  changeProfile,
  createUser,
  findByUsername,
  updateRole,
  getAllUsers,
  deleteUser,
};
