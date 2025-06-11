//get all user permissions
const e = require("express");
const db = require("../../config/db.config");
const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM Users");
  return rows;
};
// update user role
const updateUserRole = async (userId, role) => {
  const [result] = await db.execute(
    "UPDATE Users SET role = ? WHERE user_id = ?",
    [role, userId]
  );
  return result.affectedRows > 0;
};
module.exports = {
  getAllUsers,
  updateUserRole,
};
