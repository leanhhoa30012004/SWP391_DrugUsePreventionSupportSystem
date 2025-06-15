const managerModels = require("../models/manager.model");
exports.createUser = async (req, res) => {
  const { username, password, email, fullname, role } = req.body;
  try {
    const user = await managerModels.createUser({
      username,
      password,
      email,
      fullname,
      role,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.changeProfile = async (req, res) => {
  const { fullname, email, password } = req.body;
  const userId = req.user.user_id; // Assuming userId is set in the request by authentication middleware
  console.log(
    "userId:",
    userId,
    "fullname:",
    fullname,
    "email:",
    email,
    "password:",
    password
  );
  try {
    const result = await managerModels.changeProfile(userId, {
      fullname,
      email,
      password,
    });
    res.json(result);
  } catch (error) {
    console.error("Error changing profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await managerModels.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    await managerModels.updateRole(userId, role);
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    await managerModels.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
