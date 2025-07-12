const Notice = require('../models/notice.models');
const { emitToUser } = require('../models/socket.model');
const { getIO } = require('../models/socket.model');

async function pushNotice({ userID = null, title, message, type = 'info', redirect_url = null }) {
    try {
        const result = await Notice.isCreateNewNotice(userID, title, message, type, redirect_url);

        if (!result) return false;

        const payload = { title, message, type, redirect_url };

        if (userID) {
            emitToUser(userID, 'system_notification', payload);
        } else {
            getIO().emit('system_notification', payload);
        }

        return true;
    } catch (error) {
        console.error('Error in pushNotice:', error);
        return false;
    }
}

module.exports = {
    pushNotice
};
