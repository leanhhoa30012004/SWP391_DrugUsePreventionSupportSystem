const db = require("../../config/db.config");

const listOfCourse = async () => {
  const [rows] = await db.execute(
    "SELECT c.course_id, c.course_name, c.created_at, u.fullname, c.video, c.quiz, c.version FROM Course c JOIN Users u ON c.created_by = u.user_id WHERE c.is_active = 1"
  );
  return rows;
};

const searchCourseByName = async (course_name) => {
  const name = `%${course_name}%`;
  const [rows] = await db.execute(
    "SELECT c.course_id, c.course_name, c.created_at, c.created_by, c.video, c.quiz, c.version FROM Course c WHERE course_name LIKE ? AND is_active = 1",
    [name]
  );
  return rows;
};

const memberContinuesLearnCourseById = async (member_id, course_id) => {
  const [rows] = await db.execute(
    "SELECT c.course_id, u.fullname, c.course_name, ce.learning_process, c.content, c.version  FROM Users u  JOIN  Course_enrollment ce ON u.user_id = ce.member_id JOIN Course c ON ce.course_id = c.course_id WHERE u.user_id = ? AND ce.course_id = ? AND ce.is_active = 1 ",
    [member_id, course_id]
  );
  return {
    course_id: rows[0].course_id,
    fullname: rows[0].fullname,
    course_name: rows[0].course_name,
    learning_process: JSON.parse(rows[0].learning_process),
    content: JSON.parse(rows[0].content),
    version: rows[0].version,
  };
};

const createMemberEnrollmentCourse = async (member_id, course_id) => {
  const [rows] = await db.execute(
    "INSERT INTO Course_enrollment (member_id, course_id) VALUES (?, ?)",
    [member_id, course_id]
  );
  return rows;
};

const checkEnrollemtCourse = async (member_id, course_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM Course_enrollment ce WHERE ce.is_active = 1 AND member_id = ? AND course_id = ? ",
    [member_id, course_id]
  );
  return rows.length > 0;
};

const updateLearningProcess = async (
  member_id,
  course_id,
  learning_process
) => {
  const [rows] = await db.execute(
    "UPDATE Course_enrollment SET learning_process = ? WHERE member_id  = ? AND course_id  = ? AND is_active = 1",
    [JSON.stringify(learning_process), member_id, course_id]
  );
  return rows;
};

const updateStatusLearningProcess = async (member_id, course_id) => {
  const [rows] = await db.execute(
    'UPDATE Course_enrollment SET status = "complete" WHERE member_id  = ? AND course_id  = ? AND is_active = 1',
    [member_id, course_id]
  );
  return rows;
};

const getCourseEnrollmentByMemberIdAndCourseId = async (
  member_id,
  course_id
) => {
  const [rows] = await db.execute(
    "SELECT * FROM Course_enrollment WHERE member_id = ? AND course_id = ? AND is_active = 1",
    [member_id, course_id]
  );
  return {
    course_id: rows[0].course_id,
    member_id: rows[0].member_id,
    learning_process: JSON.parse(rows[0].learning_process),
    // course_certificate: rows[0].course_certificate,
    status: rows[0].status,
  };
};

const getCourseById = async (course_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM Course WHERE course_id = ? AND is_active = 1",
    [course_id]
  );
  return {
    course_id: rows[0].course_id,
    course_name: rows[0].course_name,
    created_at: rows[0].created_at,
    created_by: rows[0].created_by,
    content: JSON.parse(rows[0].content),
    version: rows[0].version,
  };
};

const calculateScoreMooc = async (questions, answers) => {
  const mooc = questions.find((item) => item.id === answers.mooc_id);
  console.log("mooc", mooc);
  if (!mooc) {
    return { error: "Mooc not found" };
  }
  let totalScore = 0;
  let details = {};
  // console.log("mooc.quiz", mooc.quiz);
  mooc.quiz.forEach((question, idx) => {
    const userAnswer = answers.answers[idx + 1];

    if (question.type === "sigle_choice") {
      question.options.forEach((option) => {
        if (option.text === userAnswer) {
          totalScore += option.score;
          details[question.id] = {
            question: question.options,
            answer: userAnswer,
            score: option.score,
            isCorrect: true,
          };
        } else {
          details[question.id] = {
            question: option,
            answer: userAnswer,
            score: 0,
            isCorrect: false,
          };
        }
      });
    } else if (question.type === "multiple_choice") {
      if (Array.isArray(userAnswer)) {
        userAnswer.forEach((ans) => {
          const option = question.options.find((opt) => opt.text === ans);
          if (option) {
            totalScore += option.score || 0;
            details[question.id] = {
              question: question.options,
              answer: ans,
              score: option.score || 0,
              isCorrect: true,
            };
          } else {
            details[question.id] = {
              question: question.options,
              answer: ans,
              score: 0,
              isCorrect: false,
            };
          }
        });
      }
    }
  });
  console.log("details", details);
  console.log("totalScore", totalScore);
  return {
    totalScore,
    details,
  };
};
const createCourse = async (course) => {
  const [rows] = await db.execute(
    "INSERT INTO Course (course_name, age_group, created_at, created_by, content, version) VALUES (?, ?, NOW(), ?, ?, 1.0)",
    [
      course.course_name,
      course.age_group,
      course.created_by,
      JSON.stringify(course.content),
    ]
  );
  return rows;
};
const updateCourse = async (course) => {
  const [rows] = await db.execute(
    "UPDATE Course SET course_name = ?, age_group = ?, content = ?, version = version + 0.1, edited_at = NOW(), edited_by = ? WHERE course_id = ?",
    [
      course.course_name,
      course.age_group,
      JSON.stringify(course.content),
      course.edited_by,
      course.course_id,
    ]
  );
  return rows;
};
const deleteCourse = async (course_id) => {
  await db.execute("UPDATE Course SET is_active = 0 WHERE course_id = ?", [
    course_id,
  ]);
};
module.exports = {
  listOfCourse,
  searchCourseByName,
  memberContinuesLearnCourseById,
  createMemberEnrollmentCourse,
  checkEnrollemtCourse,
  updateLearningProcess,
  getCourseEnrollmentByMemberIdAndCourseId,
  getCourseById,
  calculateScoreMooc,
  deleteCourse,
  updateStatusLearningProcess,
  createCourse,
  updateCourse,
};
