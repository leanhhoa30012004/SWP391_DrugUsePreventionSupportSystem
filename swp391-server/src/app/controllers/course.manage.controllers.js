const courseModels = require("../models/course.model");
exports.createCourse = async (req, res) => {
  const { course_name, content, age_group } = req.body;
  const created_by = req.user.user_id; // Assuming user_id is set in the request by authentication middleware
  try {
    const course_id = await courseModels.createCourse({
      course_name,
      content,
      age_group,
      created_by,
    });
    res.status(201).json({ message: "Course created successfully", course_id });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
}
exports.updateCourse = async (req, res) => {
  const { course_id, course_name, content, age_group } = req.body;
  const edited_by = req.user.user_id; // Assuming user_id is set in the request by authentication middleware
  try {
    const result = await courseModels.updateCourse({
      course_id: course_id,
      course_name: course_name,
      content: content,
      age_group: age_group,
      edited_by: edited_by, // Assuming edited_by is the same as created_by for simplicity
    });
    res.json({ message: "Course updated successfully", result });
  } catch (error) {
    console.error("Error updating course:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.sqlMessage });
  }
}
exports.deleteCourse = async (req, res) => {
    const { course_id } = req.body;
    try {
        await courseModels.deleteCourse(course_id);
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res
        .status(500)
        .json({ message: "Internal server error", error: error.sqlMessage });
    }
    }
exports.listOfCourse = async (req, res) => {
    try {
        const courses = await courseModels.getAllCourses();
        res.json({ message: "List of courses", courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res
        .status(500)
        .json({ message: "Internal server error", error: error.sqlMessage });
    }
    }
exports.searchCourseByName = async (req, res) => {
    const { course_name } = req.query;
    try {
        const courses = await courseModels.searchCourseByName(course_name);
        res.json({ message: "Search results", courses });
    } catch (error) {
        console.error("Error searching courses:", error);
        res
        .status(500)
        .json({ message: "Internal server error", error: error.sqlMessage });
    }
}
