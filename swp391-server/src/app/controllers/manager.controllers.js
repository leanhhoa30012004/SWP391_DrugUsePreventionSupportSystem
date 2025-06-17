const managerModels = require("../models/manager.model");
exports.createUser = async (req, res) => {
  const { username, password, email, fullname, role, age } = req.body;
  try {
    const user = await managerModels.createUser({
      username,
      password,
      email,
      fullname,
      role,
      age,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating User:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
exports.changeProfile = async (req, res) => {
  const { fullname, email, password } = req.body;
  const user_id = req.user.user_id; // Assuming userId is set in the request by authentication middleware

  try {
    const result = await managerModels.changeProfile(user_id, {
      fullname,
      email,
      password,
    });
    res.json(result);
  } catch (error) {
    console.error("Error changing profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await managerModels.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
exports.updateRole = async (req, res) => {
  const { user_id, role } = req.body;
  try {
    await managerModels.updateRole(user_id, role);
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
exports.deleteUser = async (req, res) => {
  const  id  = req.params.id; // Assuming user_id is passed as a URL parameter
  try {
    await managerModels.deleteUser(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};
