const express = require('express');
const router = express.Router();
const blogController = require('../app/controllers/blog.controllers')
const { imageUpload } = require('../service/upload.service');
const { protectManager, restrictTo } = require("../middleware/auth.middleware");


router.post("/blogPost", imageUpload.single("cover_img"), blogController.blogPost)
router.get("/getAllPendingBlog", protectManager, restrictTo('manager', 'admin'), blogController.getAllBlogPending)
router.get("/getAllBlogByMemberId/:member_id", blogController.getAllBlogByMemberId)
module.exports = router;