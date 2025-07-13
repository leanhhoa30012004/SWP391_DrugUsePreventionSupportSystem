const managerModels = require("../models/manager.model");
const bcrypt = require("bcryptjs");

// Tạo user mới
exports.createUser = async (req, res) => {
  const { username, password, email, fullname, role, birthday } = req.body;

  try {
    if (!username || !password || !email || !fullname || !birthday) {
      return res.status(400).json({
        message: "All fields are required: username, password, email, fullname, birthday"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await managerModels.createUser({
      username,
      password: hashedPassword,
      email,
      fullname,
      role: role || 'member',
      birthday,
    });

    if (result.error) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json({
      message: "User created successfully",
      userId: result.userId
    });
  } catch (error) {
    console.error("Error creating User:", error);

    // Xử lý lỗi trùng unique từ DB (phòng trường hợp model không bắt được)
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

// Cập nhật profile manager hiện tại
exports.changeProfile = async (req, res) => {
  const { fullname, email, password, birthday } = req.body;
  let hashedPassword = null;
  const user_id = req.user.user_id;
  
  if(password){
    hashedPassword = await bcrypt.hash(password, 10);
  } else {
    const currentUser = await managerModels.findById(user_id);
    hashedPassword = currentUser.password;
  }
  
  try {
    const result = await managerModels.changeProfile(user_id, {
      fullname,
      email,
      password: hashedPassword,
      birthday,
    });
    res.json(result);
  } catch (error) {
    console.error("Error changing profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { fullname, email, birthday } = req.body;

  try {
    // Validate required fields
    if (!fullname) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const result = await managerModels.updateUserProfile(id, {
      fullname,
      email,
      birthday,
    });
    res.json(result);
  } catch (error) {
    console.error("Error updating user profile:", error);
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

// Cập nhật role user
exports.updateRole = async (req, res) => {
  const { id, role } = req.params;
  try {
    await managerModels.updateRole(id, role);
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id; // Assuming user_id is passed as a URL parameter
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


exports.updateUser = async (req, res) => {
  const {  id} = req.params;
  const { fullname, email, password, role, birthday } = req.body;
  
  try {
    if (!fullname || !email || !birthday) {
      return res.status(400).json({ 
        message: "Fullname, email, and birthday are required" 
      });
    }

    const existingUser = await managerModels.findByEmail(email);
    if (existingUser && existingUser.user_id != id) {
      return res.status(400).json({ message: "Email is already in use by another user" });
    }

    const updateData = {
      fullname,
      email,
      birthday,
      role: role || 'member'
    };

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await managerModels.updateUser(id, updateData);
    
    res.json({ 
      message: "User updated successfully",
      userId: id
    });
    
  } catch (error) {
    console.error("Error updating user:", error);
    
    if (error.sqlMessage && error.sqlMessage.includes('Duplicate entry')) {
      if (error.sqlMessage.includes('email')) {
        return res.status(500).json({ message: "Email is already in use" });
      }
    }
    
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.sqlMessage || error.message 
    });
  }
};
