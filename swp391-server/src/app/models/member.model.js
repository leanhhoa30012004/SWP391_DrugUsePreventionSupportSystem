const db = require("../../config/db.config");

const createMember = async ({ username, password, email, fullname, birthday }) => {
  const [rows] = await db.execute(
    "INSERT INTO Users (username, password, email, fullname, role, birthday) VALUES (?, ?, ?, ?, 'member', ?)",
    [username, password, email, fullname, birthday]
  );
  return rows;
};

const findByUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE username = ? AND role = 'member' AND is_active = 1",
    [username]
  );
  return rows[0];
};
const findByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE email = ? AND role = 'member' AND is_active = 1",
    [email]
  );
  return rows[0];
};

const updateResetToken = async (email, token, expiry) => {
  await db.execute(
    "UPDATE Users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [token, expiry, email]
  );
};

const findByResetToken = async (token) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE reset_token = ? AND reset_token_expiry > NOW()",
    [token]
  );
  return rows[0];
};

const updatePassword = async (id, newPassword) => {
  await db.execute(
    "UPDATE Users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?",
    [newPassword, id]
  );
};

const findById = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE user_id = ? AND role = 'member' AND is_active = 1",
    [id]
  );
  return rows[0];
};

const updateProfile = async (id, { fullname, email, birthday }) => {
  await db.execute(
    "UPDATE Users SET fullname = ?, email = ?, birthday = ? WHERE user_id = ?",
    [fullname, email, birthday, id]
  );
};

const getUserCourses = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
      c.course_id,
      c.title,
      c.description,
      c.image_url,
      uc.enrolled_date,
      uc.status,
      uc.progress,
      uc.completed_date
    FROM Course c
    INNER JOIN UserCourses uc ON c.course_id = uc.course_id
    WHERE uc.user_id = ? AND uc.is_active = 1
    ORDER BY uc.enrolled_date DESC
  `,
    [userId]
  );
  return rows;
};

const getUserCertificates = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
      cert.certificate_id,
      cert.title,
      cert.description,
      cert.type,
      cert.earned_date,
      cert.certificate_url
    FROM Certificates cert
    WHERE cert.user_id = ? AND cert.is_active = 1
    ORDER BY cert.earned_date DESC
  `,
    [userId]
  );
  return rows;
};

const getUserSurveys = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
      sr.survey_result_id,
      s.survey_id,
      s.title,
      sr.score,
      sr.total_questions,
      sr.risk_level,
      sr.recommendations,
      sr.completed_date,
      sr.certificate_eligible
    FROM SurveyResults sr
    INNER JOIN Survey s ON sr.survey_id = s.survey_id
    WHERE sr.user_id = ? AND sr.is_active = 1
    ORDER BY sr.completed_date DESC
  `,
    [userId]
  );
  return rows;
};

module.exports = {
  createMember,
  findByUsername,
  findByEmail,
  findById,
  updateProfile,
  updateResetToken,
  findByResetToken,
  updatePassword,
  getUserCourses,
  getUserCertificates,
  getUserSurveys,
};
