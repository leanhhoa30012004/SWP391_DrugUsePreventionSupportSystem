const managerModels = require("../models/manager.model");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  const { username, password, email, fullname, role, birthday } = req.body;
  
  try {
    // Validate required fields
    if (!username || !password || !email || !fullname || !birthday) {
      return res.status(400).json({ 
        message: "All fields are required: username, password, email, fullname, birthday" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await managerModels.createUser({
      username,
      password: hashedPassword,
      email,
      fullname,
      role: role || 'member',
      birthday,
    });
    
    res.status(201).json({ 
      message: "User created successfully", 
      userId: user.userId 
    });
  } catch (error) {
    console.error("Error creating User:", error);
    
    // Handle duplicate username/email error
    if (error.sqlMessage && error.sqlMessage.includes('Duplicate entry')) {
      if (error.sqlMessage.includes('username')) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (error.sqlMessage.includes('email')) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.sqlMessage || error.message 
    });
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

exports.toggleUserActive = async (req, res) => {
  const id = req.params.id;
  const { is_active } = req.body;
  if (typeof is_active !== 'boolean' && is_active !== 0 && is_active !== 1) {
    return res.status(400).json({ message: 'is_active must be boolean' });
  }
  try {
    await managerModels.toggleUserActive(id, is_active);
    res.json({ message: `User is now ${is_active ? 'active' : 'inactive'}` });
  } catch (error) {
    console.error('Error toggling user active:', error);
    res.status(500).json({ message: 'Internal server error', error: error.sqlMessage });
  }
};
