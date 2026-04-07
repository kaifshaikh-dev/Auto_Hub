const multer = require('multer');

// Configure multer storage (memory storage for uploading to cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 110 * 1024 * 1024, // 110MB max file size (accounting for video up to 100MB and images)
  },
});

module.exports = upload;
