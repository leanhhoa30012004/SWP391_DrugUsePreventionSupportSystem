const { response, json } = require("express");
const db = require("../../config/db.config");

const listOfSurvey = async () => {
  const [rows] = await db.execute(`WITH Ranked AS (
  SELECT 
    s.survey_id,
    s.survey_type,
    s.created_by,
    s.created_date,
    sv.content,
    sv.edited_at,
    sv.version,
    ROW_NUMBER() OVER (PARTITION BY s.survey_id ORDER BY sv.version DESC) AS rn
  FROM Survey s
  JOIN Survey_version sv ON s.survey_id = sv.survey_id
  WHERE s.is_active = 1
)
SELECT * FROM Ranked WHERE rn = 1;`);
  return rows.map(row => ({
    survey_id: row.survey_id,
    survey_type: row.survey_type,
    content: JSON.parse(row.content),
    created_by: row.created_by,
    created_at: row.created_date,
    version: row.version,
  }));
};

const findSurveyByType = async (type) => {
  const searchType = `%${type}%`;
  const [rows] = await db.execute(
    `WITH Ranked AS (
  SELECT 
    s.survey_id,
    s.survey_type,
    s.created_by,
    s.created_date,
    sv.content,
    sv.edited_at,
    sv.version,
    ROW_NUMBER() OVER (
      PARTITION BY s.survey_id 
      ORDER BY sv.version DESC
    ) AS rn
  FROM Survey s
  JOIN Survey_version sv ON s.survey_id = sv.survey_id
  WHERE s.survey_type LIKE ? AND s.is_active = 1
)
SELECT * FROM Ranked WHERE rn = 1;
`,
    [searchType]
  );
  if (rows.length === 0) {
    throw new Error("Survey not found");
  }

  return {
    survey_id: rows[0].survey_id,
    survey_type: rows[0].survey_type,
    content: JSON.parse(rows[0].content),
    created_by: rows[0].created_by,
    created_at: rows[0].created_date,
    version: rows[0].version,
  };
};

const findSurveyBySurveyID = async (survey_id) => {
  console.log(survey_id)
  const [rows] = await db.execute(
    `WITH Ranked AS (
  SELECT 
    s.survey_id,
    s.survey_type,
    s.created_by,
    s.created_date,
    sv.content,
    sv.edited_at,
    sv.version,
    ROW_NUMBER() OVER (
      PARTITION BY s.survey_id
      ORDER BY sv.version DESC
    ) AS rn
  FROM Survey s
  JOIN Survey_version sv ON s.survey_id = sv.survey_id
  WHERE s.survey_id = ? AND s.is_active = 1
  )
  SELECT * FROM Ranked WHERE rn = 1;
  `,
    [survey_id]
  );

  if (rows.length === 0) {
    throw new Error("Survey not found");
  }

  return {
    survey_id: rows[0].survey_id,
    survey_type: rows[0].survey_type,
    content: JSON.parse(rows[0].content),
    created_by: rows[0].created_by,
    created_at: rows[0].created_date,
    version: rows[0].version,
  };
};

const findSurveyByTypeAndVersion = async (type, version) => {
  const searchType = `%${type}%`;
  const [rows] = await db.execute(
    `SELECT s.survey_id,
    s.survey_type,
    s.created_by,
    s.created_date,
    sv.content,
    sv.edited_at,
    sv.version
FROM Survey s JOIN Survey_version sv ON s.survey_id = sv.survey_id 
WHERE s.survey_type  = ? AND sv.version = ? AND s.is_active = 1`,
    [searchType, version]
  );
  if (row.length === 0) {
    throw new Error("Servey not found");
  }
  return {
    survey_id: rows[0].survey_id,
    survey_type: rows[0].survey_type,
    content: JSON.parse(rows[0].content),
    created_by: rows[0].created_by,
    created_at: rows[0].created_date,
    version: rows[0].version,
  };
};

const calculateScore = (questions, answers) => {
  let totalScore = 0;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (!userAnswer) return;

    if (question.type === "multiple_choice" && Array.isArray(userAnswer)) {
      userAnswer.forEach((ans) => {
        const option = question.options.find((opt) => opt.text === ans);
        if (option) totalScore += option.score || 0;
      });
    }

    if (question.type === "single_choice" && typeof userAnswer === "string") {
      const option = question.options.find((opt) => opt.text === userAnswer);
      if (option) totalScore += option.score || 0;
    }
  });
  return totalScore;
};

const getSurveyHistoryByMember = async (member_id) => {
  const [rows] = await db.execute(
    `SELECT se.survey_enrollment_id, se.survey_id, u.fullname, se.response, se.date, se.enroll_version
FROM Survey_enrollment se JOIN Users u ON se.member_id = u.user_id AND se.is_active = 1
WHERE se.member_id = ?`,
    [member_id]
  );
  return rows;
};

const addEnrollmentSurvey = async (survey_id, member_id, response, enroll_version) => {
  const [rows] = await db.execute(
    "INSERT INTO Survey_enrollment (survey_id, member_id, response, date, enroll_version) VALUES(?, ?, ?, NOW(), ?)",
    [survey_id, member_id, response, enroll_version]
  );
  return rows;
};
const addSurvey = async (survey) => {
  const { survey_type, content, created_by } = survey;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();


    const [insertSurvey] = await connection.execute(
      'INSERT INTO Survey (survey_type, created_by, created_date) VALUES (?, ?, NOW());',
      [survey_type, created_by]
    );
    const survey_id = insertSurvey.insertId;


    const [insertSurveyVersion] = await connection.execute(
      'INSERT INTO Survey_version (survey_id, content, version) VALUES (?, ?, ?);',
      [survey_id, JSON.stringify(content), 1.0]
    );

    await connection.commit();
    connection.release();

    return {
      success: true,
      survey_id,
      survey_version_id: insertSurveyVersion.insertId
    };
  } catch (error) {
    await connection.rollback();
    connection.release();
    return {
      success: false,
      error: error.message || error
    };
  }
};

const updateSurvey = async (survey) => {
  try {
    const { survey_id, content, edited_by, version } =
      survey;

    // Kiểm tra và xử lý dữ liệu
    const contentString = JSON.stringify(content);
    console.log(contentString)
    const newVersion = parseFloat(version || 1) + 0.1;
    const [rows] = await db.execute(
      'INSERT INTO Survey_version (content, edited_at, edited_by, survey_id, version) VALUES (?, NOW(), ?, ?, ?);',
      [contentString, edited_by, survey_id, newVersion]
    );
    return rows;
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
};
const deleteSurvey = async (survey_id) => {
  const [rows] = await db.execute(
    "UPDATE Survey SET is_active = 0 WHERE survey_id = ?",
    [survey_id]
  );
  return rows;
};

const getAllSurveyFollowEnrollmentSurveyByMemberId = async (member_id) => {
  const [listOfSurvey] = await db.execute(`SELECT
    s.survey_id,
    s.survey_type,
    s.created_by,
    s.created_date,
    sv.content,
    sv.edited_at,
    sv.edited_by,
    sv.version
FROM Survey s
LEFT JOIN Survey_enrollment se 
    ON s.survey_id = se.survey_id AND se.member_id = ? AND se.is_active = 1
LEFT JOIN Survey_version sv 
    ON sv.survey_id = s.survey_id 
    AND sv.is_active = 1
    AND (
        sv.version = se.enroll_version
        OR (
            se.enroll_version IS NULL AND
            sv.version = (
                SELECT MAX(version)
                FROM Survey_version
                WHERE survey_id = s.survey_id AND is_active = 1
            )
        )
    )
WHERE s.is_active = 1;`, [member_id]);
  return listOfSurvey.map(survey => ({
    survey_id: survey.survey_id,
    survey_type: survey.survey_type,
    created_by: survey.created_by,
    created_date: survey.created_date,
    content: JSON.parse(survey.content),
    edited_at: survey.edited_at,
    edited_by: survey.edited_by,
    version: survey.version
  }));
}

const getSurveyHistoryBySurveyEnrollmenId = async (survey_enrollment_id) => {
  const [surveyEnroll] = await db.execute(`SELECT survey_enrollment_id, survey_id, member_id, response, date, enroll_version
FROM Survey_enrollment
WHERE survey_enrollment_id = ? AND is_active = 1`, [survey_enrollment_id]);
  return {
    survey_enrollment_id: surveyEnroll[0].survey_enrollment_id,
    survey_id: surveyEnroll[0].survey_id,
    member_id: surveyEnroll[0].member_id,
    response: JSON.parse(surveyEnroll[0].response),
    date: surveyEnroll[0].date,
    enroll_version: surveyEnroll[0].enroll_version
  }
}

const findSurveyBySurveyIDAndVersion = async (survey_id, version) => {
  const [rows] = await db.execute(`SELECT version_id, survey_id, version, content, edited_by, edited_at
FROM Survey_version
WHERE survey_id = ? AND version = ? AND is_active = 1`, [survey_id, version]);
  return {
    version_id: rows[0].version_id,
    survey_id: rows[0].survey_id,
    version: rows[0].version,
    content: JSON.parse(rows[0].content),
    edited_by: rows[0].edited_by,
    edited_at: rows[0].edited_at
  };
};

module.exports = {
  listOfSurvey,
  findSurveyByType,
  findSurveyBySurveyID,
  findSurveyByTypeAndVersion,
  calculateScore,
  deleteSurvey,
  getSurveyHistoryByMember,
  addEnrollmentSurvey,
  updateSurvey,
  addSurvey,
  getAllSurveyFollowEnrollmentSurveyByMemberId,
  getSurveyHistoryBySurveyEnrollmenId,
  findSurveyBySurveyIDAndVersion,
};
