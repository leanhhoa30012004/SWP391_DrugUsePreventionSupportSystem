const blogModel = require('../models/blog.model');
const managerModel = require('../models/manager.model');

exports.blogPost = async (req, res) => {
    const { author, title, tags, content } = req.body;
    const cover_img = req.file?.filename || null;
    try {
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
        const blogs = await Promise.all(
            list.map(async (blog) => ({
                ...blog,
                manager_id: blog.manager_id ? await managerModel.getNameByUserId(blog.manager_id) : null,
                cover_img: blog.cover_img ? `../../uploads/${blog.cover_img}` : null
            }))
        )
        return res.json(blogs)
    } catch (error) {
        console.error("getAllBlogPending: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAllBlogByMemberId = async (req, res) => {
    const member_id = req.params.member_id;
    try {
        const list = await blogModel.getAllBlogByMemberId(member_id);
        const blogs = await Promise.all(
            list.map(async (blog) => ({
                ...blog,
                manager_id: blog.manager_id ? await managerModel.getNameByUserId(blog.manager_id) : null,
                cover_img: blog.cover_img ? `../../uploads/${blog.cover_img}` : null
            }))
        )
        return res.json(blogs)
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
    i
}

// exports.rejectblog = async (req, res) => {
//     const {manager_id, blog_id} = req.params;
//     try {
//         const blog = await blogModel.getBlogById(blog_id);
//         if(blog.status === 'Rejectted')
//     } catch (error) {
//         console.error('rejectBlog: ', error)
//         res.status(500).json({ error: "Internal server error" });
//     }
// }