const db = require('../../config/db.config')

const findByUsername = async (username) => {
    const user = db.execute(`SELECT *
FROM Users WHERE username = ? AND role = 'consultant' AND is_active = 1`, [username])
    return user;
}

module.exports = {
    findByUsername
}