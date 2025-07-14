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
WHERE program_id = ? AND member_id = ? AND status NOT LIKE 'present'`, [program_id, member_id])
    return row.affectedRows > 0
}

const updateStatusProgram = async () => {
    const [ongoing] = await db.execute(`UPDATE Community_programs
SET status = 'on going'
WHERE status = 'not started'
AND start_date <= NOW()
AND end_date > NOW()`);

    const [closed] = await db.execute(`UPDATE Community_programs
      SET status = 'closed'
      WHERE status = 'on going'
        AND end_date <= NOW()`);

    const isUpdate = ongoing.affectedRows > 0 || closed.affectedRows > 0;
    return isUpdate;
}

const getProgramById = async (program_id) => {
    const [row] = await db.execute(`SELECT * FROM Community_programs WHERE program_id = ? AND is_active = 1`,
        [program_id]
    );
    if (!row || row.length === 0)
        return;
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

const updateProgram = async (program) => {
   
    const [isUpdate] = await db.execute(`UPDATE Community_programs
SET title = ?, description = ?, start_date = ?, end_date = ?,  location = ?, detail = ?, age_group = ?, survey_question = ?, response = ?
WHERE program_id = ? AND is_active = 1`,
        [program.title,
        JSON.stringify(program.description),
        program.start_date,
        program.end_date,
        program.location,
        JSON.stringify(program.detail),
        program.age_group,
        JSON.stringify(program.survey_question),
        JSON.stringify(program.response || { pre_response: [], post_response: [] }),
        program.program_id])
    return isUpdate.affectedRows > 0;
}

const deleteProgram = async (program_id) => {
    const [isDelete] = await db.execute(`UPDATE Community_programs
SET is_active = 0
WHERE program_id = ? AND is_active = 1`, [program_id])
    return isDelete.affectedRows > 0;
}

const getAllMemberByProgramId = async (program_id) => {
    const [list] = await db.execute(`SELECT cp.program_id, u.fullname, cpp.status
FROM Community_programs cp JOIN Community_program_participant cpp ON cp.program_id = cpp.program_id
JOIN Users u ON cpp.member_id = u.user_id
WHERE cp.program_id = ? AND cp.is_active = 1`, [program_id]);
    return list;
}

const checkMemberRegistered = async (program_id, member_id) => {
    const [member] = await db.execute(`SELECT *
FROM Community_program_participant WHERE member_id = ? AND program_id = ?`, [member_id, program_id]);
    if (!member[0])
        return false;
    return true;
}

const createProgram = async (program) => {
    console.log(program)
    const [isCreate] = await db.execute(`INSERT INTO Community_programs (title, description, start_date, end_date, location, detail, age_group, manager_id, survey_question, status)
VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [program.title,
        JSON.stringify(program.description),
        program.start_date,
        program.end_date,
        program.location,
        JSON.stringify(program.detail),
        program.age_group,
        program.manager_id,
        program.survey_question,
        program.status]);
    return isCreate.affectedRows > 0
}

const updateStatusProgramParticipants = async () => {
    const [isUpdate] = await db.execute(`UPDATE Community_program_participant cpp
JOIN Community_programs cp 
    ON cpp.program_id = cp.program_id
SET cpp.status = 'absent'
WHERE cpp.status = 'registered'
  AND cp.status = 'closed';`)
    return isUpdate.affectedRows > 0
}

module.exports = {
    getAllCommunityProgram,
    numberParticipantProgram,
    registeredProgram,
    markParticipantAsPresent,
    updateStatusProgram,
    getProgramById,
    updateResponseProgram,
    updateProgram,
    deleteProgram,
    getAllMemberByProgramId,
    checkMemberRegistered,
    createProgram,
    updateStatusProgramParticipants
}