const Banner = require("../models/Banner");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getAllBanner = async (req, res) => {
    try {
        const banner = await Banner.find().sort({ createdAt: -1 });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin", error });
    }
}

const createBanner = async (req, res) => {
    try {
        let imageUrl = "";
        let imagePublicId = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "banners",
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;


            // Xóa file tạm
            const fs = require("fs");
            fs.unlinkSync(req.file.path);
        }

        // Tạo banner mới
        const newBanner = new Banner({
            imageUrl,
            imagePublicId,
            createdAt: new Date(),
        });

        const savedBanner = await newBanner.save();

        res
            .status(201)
            .json({ message: "Banner created successfully", Banner: savedBanner });
        console.log("Banner created successfully:", savedBanner);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Error creating Banner", error: err.message });
        console.error("Error creating Banner:", err);
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Banner.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Banner not found" });
        }

        res.json({ message: "Banner deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting Banner", error: err.message });
    }
};

module.exports = {
    getAllBanner,
    createBanner,
    deleteBanner
};
