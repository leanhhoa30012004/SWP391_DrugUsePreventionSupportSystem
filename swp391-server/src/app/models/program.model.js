const { dlp_v2 } = require('googleapis');
const db = require('../../config/db.config');

const getAllCommunityProgram = async () => {
    const [listProgram] = await db.execute(`SELECT program_id,title,description,start_date,end_date,location,detail,age_group,manager_id,survey_question,response,status FROM Community_programs 
WHERE is_active = 1`)
    return listProgram.map(item => ({
        program_id: item.program_id,
        title: item.title,
        description: JSON.parse(item.description),
        start_date: item.start_date,
        end_date: item.end_date,
        location: item.location,
        detail: JSON.parse(item.detail),
        age_group: item.age_group,
        manager_id: item.manager_id,
        survey_question: JSON.parse(item.survey_question),
        response: JSON.parse(item.response),
        status: item.status
    }));
}

const numberParticipantProgram = async () => {
    const [number] = await db.execute(`SELECT program_id, COUNT(member_id) AS participant_count
FROM Community_program_participant
GROUP BY program_id`)
    return number;
}

const registeredProgram = async (program_id, member_id) => {
    const [row] = await db.execute(`INSERT INTO Community_program_participant(member_id, program_id, status)
VALUES (?, ?, 'registered')`, [member_id, program_id])
    return row.affectedRows > 0;
}

const markParticipantAsPresent = async (program_id, member_id) => {
    const [row] = await db.execute(`UPDATE Community_program_participant
SET status = 'present'
WHERE program_id = ? AND member_id = ?`, [program_id, member_id])
    return row.affectedRows > 0
}

const updateStatusProgram = async () => {
    const [ongoing] = await db.execute(`UPDATE Community_programs
SET status = 'on going'
WHERE status = 'not started'
AND start_date <= NOW()
AND end_date > NOW()`);
    // console.log('[DEBUG] Ongoing affected:', ongoing.affectedRows);

    const [closed] = await db.execute(`UPDATE Community_programs
      SET status = 'closed'
      WHERE status = 'on going'
        AND end_date <= NOW()`);
    // console.log('[DEBUG] Closed affected:', closed.affectedRows);

    const isUpdate = ongoing.affectedRows > 0 || closed.affectedRows > 0;
    return isUpdate;
}

const getProgramById = async (program_id) => {
    const [row] = await db.execute(`SELECT * FROM Community_programs WHERE program_id = ? AND is_active = 1`,
        [program_id]
    );
    return {
        program_id: row[0].program_id,
        title: row[0].title,
        description: JSON.parse(row[0].description),
        start_date: row[0].start_date,
        end_date: row[0].end_date,
        location: row[0].location,
        detail: JSON.parse(row[0].detail),
        age_group: row[0].age_group,
        manager_id: row[0].manager_id,
        survey_question: JSON.parse(row[0].survey_question),
        response: JSON.parse(row[0].response),
        status: row[0].status
    };
}

const updateResponseProgram = async (program_id, response) => {
    const [isUpdate] = await db.execute(`UPDATE Community_programs
SET response = ?
WHERE program_id = ? AND is_active = 1`, [response, program_id])
    return isUpdate.affectedRows > 0;
}

module.exports = {
    getAllCommunityProgram,
    numberParticipantProgram,
    registeredProgram,
    markParticipantAsPresent,
    updateStatusProgram,
    getProgramById,
    updateResponseProgram
}