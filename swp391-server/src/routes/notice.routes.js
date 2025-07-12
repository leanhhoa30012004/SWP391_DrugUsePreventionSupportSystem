const express = require('express');
const router = express.Router();
const noticeController = require('../app/controllers/notice.controllers');

router.post('/', noticeController.createNewNotice);

router.get('/:userID', noticeController.getNoticeByUserId);

router.put('/:id/read', noticeController.updateNoticeStatusIsRead);

router.put('/:userID/read-all', noticeController.makeReadForAllNotice);

module.exports = router;
