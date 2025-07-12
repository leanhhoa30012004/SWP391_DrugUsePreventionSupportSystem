const db = require('../../config/db.config')

const blogPost = async (author, title, tags, cover_img, content) => {
    const [post] = await db.execute(`INSERT INTO Blog(post_date,author,title,tags,cover_img ,content)
VALUES (NOW(),?,?,?,?,?)`, [author, title, tags, cover_img, content])
    return post.affectedRows > 0
}

const getAllBlogByMemberId = async (member_id) => {
    const [list] = await db.execute(`SELECT b.blog_id,b.post_date,u.fullname,b.title,b.tags,b.cover_img,b.content,b.manager_id,b.approval_date,b.status,b.reject_reason
FROM Blog b JOIN Users u ON b.author = u.user_id WHERE b.is_active = 1 AND user_id = ?`, [member_id])
    return list;
}

const getAllBlogPending = async () => {
    const [list] = await db.execute(`SELECT b.blog_id,b.post_date,u.fullname,b.title,b.tags,b.cover_img,b.content,b.manager_id,b.approval_date,b.status,b.reject_reason
FROM Blog b JOIN Users u ON b.author = u.user_id WHERE b.is_active = 1`)
    return list;
}

const approvalBlog = async (manager_id, blog_id) => {
    const [isApproved] = await db.execute(`UPDATE Blog
SET status = 'Approved', approval_date = NOW(), manager_id = ?
WHERE is_active = 1 AND blog_id = ?`, [manager_id, blog_id])
    return isApproved.affectedRows > 0
}

const rejectBlog = async (manager_id, blog_id) => {
    const [isReject] = await db.execute(`UPDATE Blog
SET status = 'Rejected', approval_date = NOW(), manager_id = 5, reject_reason = 'bai viet qua nghien'
WHERE is_active = 1 AND blog_id = 1`, [manager_id, blog_id])
    return isReject.affectedRows > 0
}

const getBlogById = async (blog_id) => {
    const [blog] = await db.execute(`SELECT blog_id,post_date,author,title,tags,cover_img,content,manager_id,approval_date,status,reject_reason
FROM Blog WHERE blog_id = ? AND is_active =1`, [blog_id])
    return blog[0]
}

module.exports = {
    blogPost,
    getAllBlogPending,
    getAllBlogByMemberId,
    approvalBlog,
    rejectBlog,
    getBlogById,
}