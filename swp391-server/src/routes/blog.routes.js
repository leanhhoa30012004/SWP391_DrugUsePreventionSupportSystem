const express = require('express');
const router = express.Router();
const blogController = require('../app/controllers/blog.controllers')
const { imageUpload } = require('../service/upload.service');
const { protectManager, restrictTo } = require("../middleware/auth.middleware");


router.post("/blogPost", imageUpload.single("cover_img"), blogController.blogPost)
router.get("/getAllPendingBlog", protectManager, restrictTo('manager', 'admin'), blogController.getAllBlogPending)
router.get("/getAllBlogByMemberId/:member_id", blogController.getAllBlogByMemberId)
router.get("/approval-blog/:manager_id/:blog_id", protectManager, restrictTo('manager', 'admin'), blogController.approvalBlog)
router.post("/reject-blog/:manager_id/:blog_id", protectManager, restrictTo('manager', 'admin'), blogController.rejectblog)
router.get("/get-all-blog-approved", blogController.getAllBlogApproved)
router.get("/get-like-number-by-blog-id/:blog_id", blogController.getLikeNumberByBlogId)
router.get("/like-blog/:member_id/:blog_id", blogController.likeBlog);
router.post("/comment-blog/:member_id/:blog_id", blogController.commentBlog);
router.get("/get-all-comment-by-blog-id/:blog_id", blogController.getAllCommentByBlogId);
router.get("/remove-comment-by-comment-id/:comment_id", protectManager, restrictTo('manager', 'admin'), blogController.removeCommentByCommentId);
module.exports = router;