const express = require("express");
const router = express.Router();
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
    getAllProducts,
    searchProducts,
    getProductsByCategory,
    getProductDetail,
    createProduct,
    get2TopDiscount,
    updateProduct,
    deleteProduct,
    getDiscountProducts
} = require("../controllers/productController");

// Lấy tất cả bài viết
router.get("/", getAllProducts);

// Tìm kiếm bài viết theo query text
router.get("/search", searchProducts);

router.get("/detail/:id", getProductDetail);

router.get("/top2product", get2TopDiscount);

// Lấy bài viết theo category
router.get("/category/:category", getProductsByCategory);

// Tạo bài viết
router.post("/create", upload.single("image"), createProduct);

router.delete("/delete/:id", deleteProduct);

router.get("/getdiscountproducts", getDiscountProducts);

// Cập nhật bài viết theo user
router.put(
    "/update/:id",
    // firebaseAuth,
    upload.single("image"),
    (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: "Ảnh quá lớn (tối đa 2MB)." });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    },
    updateProduct
);

module.exports = router;
