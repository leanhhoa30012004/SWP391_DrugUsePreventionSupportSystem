const Notice = require('../models/notice.models');
const { emitToUser, getIO } = require('../models/socket.model');

exports.createNewNotice = (req, res) => {
    const { userID, title, message, type, redirect_url } = req.body;
    Notice.isCreateNewNotice(userID, title, message, type, redirect_url)
        .then(result => {
            if (result) {
                const payload = { title, message, type, redirect_url };

                if (userID) {
                    emitToUser(userID, 'system_notification', payload);
                } else {
                    getIO().emit('system_notification', payload);
                }

                res.status(201).json({ message: 'Notice created successfully' });
            } else {
                res.status(400).json({ error: 'Failed to create notice' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

exports.getNoticeByUserId = (req, res) => {
    const userID = req.params.userID;
    Notice.getNoticeByUserId(userID)
        .then(notices => {
            res.json(notices);
        })
        .catch(() => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

exports.updateNoticeStatusIsRead = (req, res) => {
    const id = req.params.id;
    Notice.isUpdateNoticeStatusIsRead(id)
        .then(result => {
            if (result) {
                res.json({ message: 'Notice status updated to read' });
            } else {
                res.status(400).json({ error: 'Failed to update notice status' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

exports.makeReadForAllNotice = (req, res) => {
    const userID = req.params.userID;
    Notice.isMakeReadForAllNotice(userID)
        .then(result => {
            if (result) {
                res.json({ message: 'All notices marked as read' });
            } else {
                res.status(400).json({ error: 'Failed to mark all notices as read' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
};
