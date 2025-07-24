const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/middlewares");
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
    getAllAssets,
    createAssets,
    deleteAssets
} = require("../controllers/assetsController");

// Lấy tất cả bài viết
router.get("/", getAllAssets);

// Tạo bài viết
router.post("/create", upload.single("image"), authMiddleware, createAssets);

router.delete("/delete/:id", authMiddleware, deleteAssets);

module.exports = router;
