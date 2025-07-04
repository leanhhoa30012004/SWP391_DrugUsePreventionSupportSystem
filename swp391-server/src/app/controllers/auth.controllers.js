const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const memberModel = require("../models/member.model");
const managerModels = require("../models/manager.model");
const surveyModel = require("../models/survey.model");

exports.register = async (req, res) => {
  const { username, password, email, fullname, birthday } = req.body;
  try {
    const existing = await memberModel.findByUsername(username);
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await memberModel.createMember({
      username,
      password: hashedPassword,
      email,
      fullname,
      birthday,

    });
    res.status(201).json({ message: "User registered successfully", id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await memberModel.findByUsername(username);

    const isMatch = user && await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );
    res.status(200).json({ message: "Login successful", user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const member = await memberModel.findByEmail(email);
  if (!member) return res.status(404).json({ message: "Email not found" });

  const token = Math.random().toString(36).substring(2);
  const expiry = new Date(Date.now() + 3600000); // 1 hour
  await memberModel.updateResetToken(email, token, expiry);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password Drug Use Prevention System",
    html: `Click link to reset password <a href="http://localhost:5173/reset-password/${token}">Click here to reset your password</a>`,
  });

  res.json({ message: "Password reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const member = await memberModel.findByResetToken(token);
  if (!member)
    return res.status(400).json({ message: "Token invalid or expired" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await memberModel.updatePassword(member.user_id, hashed);
  res.json({ message: "Password reset successful" });
};
exports.loginManager = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("Manager login attempt for username:", username);

    const user = await managerModels.findByUsername(username);
    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found or not a manager/admin");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if password is hashed (bcrypt hashes start with $2b$, $2a$, or $2y$)
    const isPasswordHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$') || user.password.startsWith('$2y$');
    
    let isMatch = false;
    
    if (isPasswordHashed) {
      // Password is hashed, use bcrypt compare
      isMatch = await bcrypt.compare(password, user.password);
      console.log("Using bcrypt comparison - Match:", isMatch);
    } else {
      // Password is plain text, do direct comparison (temporary fix)
      isMatch = password === user.password;
      console.log("Using plain text comparison - Match:", isMatch);
      
      // Hash the password for future use
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await managerModels.updatePassword(user.user_id, hashedPassword);
        console.log("Password has been hashed and updated in database");
      }
    }
    
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    console.log("Manager login successful for:", username);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error logging in manager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await memberModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove password from response
    const { password, reset_token, reset_token_expiry, ...userInfo } = user;

    res.status(200).json({
      success: true,
      user: userInfo
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullname, email, birthday } = req.body;

    // Check if email is already used by another user
    const existingUser = await memberModel.findByEmail(email);
    if (existingUser && existingUser.user_id !== userId) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use"
      });
    }

    await memberModel.updateProfile(userId, { fullname, email, birthday });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await memberModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await memberModel.updatePassword(userId, hashedNewPassword);

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Mock data - thay thế bằng query database thực tế
    const courses = [
      {
        course_id: 1,
        title: "Drug Prevention Basics",
        description: "Learn the fundamentals of drug prevention and awareness",
        status: "completed",
        progress: 100,
        enrolled_date: "2024-01-15",
        completed_date: "2024-02-15"
      },
      {
        course_id: 2,
        title: "Understanding Addiction",
        description: "Deep dive into addiction psychology and recovery",
        status: "in_progress",
        progress: 65,
        enrolled_date: "2024-02-20",
        completed_date: null
      }
    ];

    res.status(200).json({
      success: true,
      courses: courses
    });
  } catch (error) {
    console.error("Get user courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Mock data - thay thế bằng query database thực tế
    const certificates = [
      {
        certificate_id: "CERT001",
        title: "Drug Prevention Specialist",
        description: "Certified in basic drug prevention knowledge",
        type: "Course Completion",
        earned_date: "2024-02-15",
        course_id: 1
      }
    ];

    res.status(200).json({
      success: true,
      certificates: certificates
    });
  } catch (error) {
    console.error("Get user certificates error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getUserSurveys = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Lấy survey history từ database
    const memberHistorySurvey = await surveyModel.getSurveyHistoryByMember(userId);

    if (!memberHistorySurvey || memberHistorySurvey.length === 0) {
      return res.status(200).json({
        success: true,
        surveys: []
      });
    }

    // Process data để format theo frontend expectation
    const surveys = await Promise.all(
      memberHistorySurvey.map(async (historySurvey) => {
        try {
          // Lấy survey data để tính score
          const surveyData = await surveyModel.findSurveyBySurveyID(historySurvey.survey_id);

          if (!surveyData || !surveyData.content) {
            console.warn(`Survey content not found for ID: ${historySurvey.survey_id}`);
            return null;
          }

          // Parse answers
          let answers = [];
          try {
            answers = JSON.parse(historySurvey.response);
          } catch (e) {
            console.error("Invalid JSON in historySurvey.response:", historySurvey.response);
            answers = [];
          }

          // Tính score
          const score = surveyModel.calculateScore(surveyData.content, answers);
          const totalQuestions = surveyData.content.length;

          // Determine risk level based on score percentage
          const scorePercentage = (score / totalQuestions) * 100;
          let risk_level = 'low';
          let recommendations = 'Continue maintaining healthy lifestyle choices';

          if (scorePercentage >= 70) {
            risk_level = 'high';
            recommendations = 'We recommend seeking professional help and joining support groups';
          } else if (scorePercentage >= 40) {
            risk_level = 'medium';
            recommendations = 'Consider enrolling in prevention courses and monitoring your habits';
          }

          return {
            survey_id: historySurvey.survey_id,
            title: surveyData.survey_type || "Survey Assessment",
            completed_date: historySurvey.date,
            score: score,
            total_questions: totalQuestions,
            risk_level: risk_level,
            recommendations: recommendations,
            certificate_eligible: risk_level === 'low' && scorePercentage >= 80
          };
        } catch (itemError) {
          console.error(`Error processing survey ${historySurvey.survey_id}:`, itemError);
          return null;
        }
      })
    );

    // Filter out null results
    const validSurveys = surveys.filter(survey => survey !== null);


    res.status(200).json({
      success: true,
      surveys: validSurveys
    });
  } catch (error) {
    console.error("Get user surveys error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
