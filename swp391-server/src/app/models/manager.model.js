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
    [fullname, email, password, id, birthday]
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

const getNameByUserId = async (user_id) => {
  const [name] = await db.execute(`SELECT username
FROM Users WHERE user_id = ? AND is_active = 1`, [user_id])
  // console.log(name[0].username)
  return name[0].username;
}

module.exports = {
  changeProfile,
  createUser,
  findByUsername,
  updateRole,
  getAllUsers,
  toggleUserActive,
  getNameByUserId
};
