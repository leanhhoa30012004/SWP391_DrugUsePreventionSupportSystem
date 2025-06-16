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

const deleteCourse = async (course_id) => {
  await db.execute("UPDATE Course SET is_active = 0 WHERE course_id = ?", [
    course_id,
  ]);
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  listOfCourse,
  searchCourseByName,
  memberContinuesLearnCourseById,
};
