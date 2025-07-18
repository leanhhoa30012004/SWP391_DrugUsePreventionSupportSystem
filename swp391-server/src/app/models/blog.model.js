const db = require('../../config/db.config')

const blogPost = async (author, title, tags, cover_img, content) => {
    console.log('blogPost>>>>', cover_img)
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

const rejectBlog = async (manager_id, blog_id, reject_reason) => {
    const [isReject] = await db.execute(`UPDATE Blog
SET status = 'Rejected', approval_date = NOW(), manager_id = ?, reject_reason = ?
WHERE is_active = 1 AND blog_id = ?`, [manager_id, reject_reason, blog_id])
    return isReject.affectedRows > 0
}

const getBlogById = async (blog_id) => {
    const [blog] = await db.execute(`SELECT blog_id,post_date,author,title,tags,cover_img,content,manager_id,approval_date,status,reject_reason
FROM Blog WHERE blog_id = ? AND is_active =1`, [blog_id])
    return blog[0]
}

const getAllBlogAprroved = async () => {
    const [list] = await db.execute(`SELECT b.blog_id, b.post_date, u.fullname, b.title, b.tags, b.cover_img, b.content
FROM Blog b JOIN Users u ON b.author = u.user_id
WHERE b.status = 'Approved'`)
    return list;
}

const getLikeNumberByBlogId = async (blog_id) => {
    const likeNumber = await db.execute(`SELECT COUNT(member_id ) AS 'Like number'
FROM Like_blog WHERE blog_id = ?`, [blog_id]);
    return likeNumber;
}

const likeBlog = async (member_id, blog_id) => {
    const [isLike] = await db.execute(`INSERT INTO Like_blog  (member_id, blog_id, is_like)
VALUES (?, ?, 1)
ON DUPLICATE KEY UPDATE
is_like = IF(is_like = 1, 0, 1);`, [member_id, blog_id])
    return isLike.affectedRows > 0;
}

const commentBlog = async (member_id, blog_id, content) => {
    const [isComment] = await db.execute(`INSERT INTO Comment_blog (member_id, blog_id, comment_date ,content)
VALUES (?, ?, NOW(), ?)`, [member_id, blog_id, content])
    return isComment.affectedRows > 0;
}

const getAllCommentByBlogId = async (blog_id) => {
    const [comments] = await db.execute(`SELECT cb.comment_id, u.fullname, cb.blog_id, cb.comment_date, cb.content
FROM Comment_blog cb JOIN Users u ON cb.member_id = u.user_id
WHERE cb.is_active = 1 AND cb.blog_id = ?`, [blog_id])
    return comments
}

const removeCommentByCommentId = async (comment_id) => {
    const [isRemove] = await db.execute(`UPDATE Comment_blog
SET is_active = 0 WHERE comment_id = ?`, [comment_id])
    return isRemove.affectedRows > 0
}

module.exports = {
    blogPost,
    getAllBlogPending,
    getAllBlogByMemberId,
    approvalBlog,
    rejectBlog,
    getBlogById,
    getAllBlogAprroved,
    likeBlog,
    getLikeNumberByBlogId,
    commentBlog,
    getAllCommentByBlogId,
    removeCommentByCommentId
}