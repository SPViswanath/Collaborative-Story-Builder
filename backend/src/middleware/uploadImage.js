const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "storybuilder/covers",   // auto-created in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1200, height: 630, crop: "fill" }],
    overwrite: true,
  },
});

const uploadStoryImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = uploadStoryImage;
