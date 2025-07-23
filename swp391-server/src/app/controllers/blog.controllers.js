const { json } = require('express');
const blogModel = require('../models/blog.model');
const managerModel = require('../models/manager.model');
const cloudinary = require('../../service/cloudinary.service')
const fs = require('fs')

exports.blogPost = async (req, res) => {
    const { author, title, tags, content } = req.body;
    let cover_img = null
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads'
            })
            // get url from cloudinary
            cover_img = result.secure_url;
            console.log(cover_img)
            // delete local uploads
            fs.unlinkSync(req.file.path)
        }

        const isPost = await blogModel.blogPost(author, title, tags, cover_img, content);
        if (isPost)
            return res.json('Your blog posting request has been received, please wait for manager approval.');
        return res.json('Your blog post failed')
    } catch (error) {
        console.error("blogPost: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getAllBlogPending = async (req, res) => {
    try {
        const list = await blogModel.getAllBlogPending();
        // const blogs = list.map(blog => ({
        //     ...blog,
        //     cover_img: blog.cover_img ? `../../uploads/${blog.cover_img}` : null
        // }));
        return res.json(list)
    } catch (error) {
        console.error("getAllBlogPending: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAllBlogByMemberId = async (req, res) => {
    const member_id = req.params.member_id;
    try {
        const list = await blogModel.getAllBlogByMemberId(member_id);
        return res.json(list)
    } catch (error) {
        console.error("getAllBlogByMemberId: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.approvalBlog = async (req, res) => {
    const { manager_id, blog_id } = req.params;
    try {
        const blog = await blogModel.getBlogById(blog_id);
        if (blog.status === 'Approved')
            return res.json('This blog already approved!')
        const isApproved = await blogModel.approvalBlog(manager_id, blog_id);
        if (isApproved) return res.json('Approved suceessfully')
        res.json('Approval failed!')
    } catch (error) {
        console.error("approvalBlog: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.rejectblog = async (req, res) => {
    const { manager_id, blog_id } = req.params;
    const reject_reason = req.body.reject_reason;
    try {
        const blog = await blogModel.getBlogById(blog_id);
        if (blog.status === 'Rejected')
            return res.json('This blog has been rejected.')
        const isRejected = await blogModel.rejectBlog(manager_id, blog_id, reject_reason)
        if (isRejected) return res.json('Rejected successfully')
        res.json('Refused to fail')
    } catch (error) {
        console.error('rejectBlog: ', error)
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAllBlogApproved = async (req, res) => {
    try {
        const list = await blogModel.getAllBlogAprroved();
        if (!list) return res.json("Doesn't have any blog in system!")
        return res.json(list)
    } catch (error) {
        console.error('getAllBlogApproved:', error)
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getLikeNumberByBlogId = async (req, res) => {
    const blog_id = req.params.blog_id;
    try {
        const [likeNumber] = await blogModel.getLikeNumberByBlogId(blog_id);
        return res.json(likeNumber);
    } catch (error) {
        console.error('getLikeNumberByBlogId:', error)
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.likeBlog = async (req, res) => {
    const { member_id, blog_id } = req.params;
    try {
        const likeBlog = await blogModel.likeBlog(member_id, blog_id);
        if (likeBlog) return res.json('like is updated')
        return;
    } catch (error) {
        console.error('likeBlog:', error)
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.commentBlog = async (req, res) => {
    const { member_id, blog_id } = req.params;
    const { content } = req.body;
    try {
        const commentBlog = await blogModel.commentBlog(member_id, blog_id, content);
        if (commentBlog) return res.json('Comment successfully!');
        return res.json('Comment failed!')
    } catch (error) {
        console.error('commentBlog:', error)
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAllCommentByBlogId = async (req, res) => {
    const blog_id = req.params.blog_id;
    try {
        const list = await blogModel.getAllCommentByBlogId(blog_id);
        return res.json(list)
    } catch (error) {
        console.error('getAllCommentByBlogId:', error)
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.removeCommentByCommentId = async (req, res) => {
    const comment_id = req.params.comment_id;
    try {
        const isRemove = await blogModel.removeCommentByCommentId(comment_id);
        if (isRemove) return res.json('Removed comment successfully!');
        return res.json('Removal comment failed!')
    } catch (error) {
        console.error('removeCommentByCommentId:', error)
        res.status(500).json({ error: "Internal server error" });
    }
}