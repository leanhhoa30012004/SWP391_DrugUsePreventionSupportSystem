const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./src/uploads"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + ext);
    },
});

const imageUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const types = ["image/png", "image/jpeg", "image/jpg"];
        cb(null, types.includes(file.mimetype));
    },
});

module.exports = { imageUpload };