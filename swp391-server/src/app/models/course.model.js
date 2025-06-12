const db = require('../../config/db.config')

const listOfCourse = async () => {
    const [rows] = await db.execute('SELECT c.course_id, c.course_name, c.created_at, u.fullname, c.video, c.quiz, c.version FROM Course c JOIN Users u ON c.created_by = u.user_id WHERE c.is_active = 1')
    return rows;
}

module.exports = {
    listOfCourse
}