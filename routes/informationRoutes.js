const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/middlewares");

const {
    getAllInformation,
    updateInformation,
    deleteInformation,
    createInformation,
} = require("../controllers/informationController");

// Lấy tất cả bài viết
router.get("/", getAllInformation);

router.post("/create", authMiddleware, createInformation);

router.delete("/delete/:id", authMiddleware, deleteInformation);

// Cập nhật bài viết theo user
router.put(
    "/update/:id", authMiddleware, updateInformation
);

module.exports = router;
