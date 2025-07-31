const Product = require("../models/Products");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
};

const searchProducts = async (req, res) => {
    const query = req.query.q || "";
    const category = req.query.category || "";
    const ids = req.query.ids ? req.query.ids.split(",") : null;

    let filters = [];

    // Search by text
    if (query) {
        filters.push({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        });
    }

    // Search by category
    if (category) {
        filters.push({ category });
    }

    // Search by product IDs
    if (ids && ids.length > 0) {
        filters.push({ _id: { $in: ids } });
    }

    try {
        const products = await Product.find(
            filters.length > 0 ? { $and: filters } : {}
        ).limit(10);

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products", error });
    }
};

const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category: category }).limit(10);
        res.json(products);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching products by category", error });
    }
};

const createProduct = async (req, res) => {
    try {
        const { uid, title, price, description, discount, URL, views, rating, category } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!title || !description || !category) {
            return res
                .status(400)
                .json({ message: "Title, description, and category are required" });
        }

        // Upload image nếu có
        let imageUrl = "";
        let imagePublicId = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;


            // Xóa file tạm
            const fs = require("fs");
            fs.unlinkSync(req.file.path);
        }

        // Tạo Product mới
        const newProduct = new Product({
            uid,
            title,
            price,
            description,
            discount: typeof discount === "number" ? discount : 0,
            views: typeof views === "number" ? views : 0,
            rating: typeof rating === "number" ? rating : 0,
            category,
            URL,
            imageUrl,
            imagePublicId,
            createdAt: new Date(),
        });

        const savedProduct = await newProduct.save();

        res
            .status(201)
            .json({ message: "Product created successfully", Product: savedProduct });
        console.log("Product created successfully:", savedProduct);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Error creating Product", error: err.message });
        console.error("Error creating Product:", err);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            category,
            title,
            description,
            discount,
            views,
            URL,
            rating,
            price
        } = req.body;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Xoá ảnh cũ nếu có
        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }

        // Upload ảnh mới nếu có
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });
            product.imageUrl = result.secure_url;
            product.imagePublicId = result.public_id;

            const fs = require("fs");
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Failed to delete temp file:", err);
            }
        }

        // Cập nhật các trường
        product.category = category || product.category;
        product.title = title || product.title;
        product.price = price !== undefined ? Number(price) : product.price;
        product.description = description || product.description;
        product.discount = discount !== undefined ? Number(discount) : product.discount;
        product.views = views !== undefined ? Number(views) : product.views;
        product.URL = URL !== undefined ? Number(URL) : product.URL;
        product.rating = rating !== undefined ? Number(rating) : product.rating;

        await product.save();

        res.json({ message: "Product updated successfully", product });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Error updating product", error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // ✅ Delete image from Cloudinary
        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }

        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product", error: err.message });
    }
};

const getProductDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết sản phẩm", error });
    }
};

const get2TopDiscount = async (req, res) => {
    try {
        const products = await Product.find().sort({ discount: -1 }).limit(2);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
};

const getDiscountProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ discount: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
};

module.exports = {
    getAllProducts,
    searchProducts,
    getProductsByCategory,
    getProductDetail,
    createProduct,
    get2TopDiscount,
    updateProduct,
    deleteProduct,
    getDiscountProducts
};
