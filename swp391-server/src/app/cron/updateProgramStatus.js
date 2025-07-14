console.log('[CRON] File updateProgramStatus.js is loaded');
const cron = require('node-cron');
const programModel = require('../models/program.model')


cron.schedule('*/15 * * * *', async () => {
    const isUpdate = await programModel.updateStatusProgram();
    // console.log('update>>>', isUpdate)
    if (isUpdate) console.log(`[CRON] Updated program statuses at ${new Date().toLocaleString()}`)
});

// cron.schedule('*/10 * * * * *', async () => {
//     const isUpdate = await programModel.updateStatusProgramParticipants();
//     console.log(isUpdate)
//     if (isUpdate) console.log(`[CRON] Updated program participant statuses at ${new Date().toLocaleString()}`)
// });