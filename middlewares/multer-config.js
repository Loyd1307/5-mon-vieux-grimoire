const multer = require("multer");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.memoryStorage();

module.exports = multer({
    storage,
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true);
        } else {
            callback(new Error('Format d’image non accepté'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single('image');