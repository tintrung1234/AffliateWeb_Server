const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/middlewares");
const multer = require("multer");
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Định dạng ảnh không hợp lệ"), false);
        }
        cb(null, true);
    },
});

const {
    getAllBanner,
    createBanner,
    deleteBanner
} = require("../controllers/bannerController");

// Lấy tất cả bài viết
router.get("/", getAllBanner);

// Tạo bài viết
router.post("/create", upload.single("image"), authMiddleware, createBanner);

router.delete("/delete/:id", authMiddleware, deleteBanner);

module.exports = router;
