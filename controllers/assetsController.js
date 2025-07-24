const Assets = require("../models/Assets");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getAllAssets = async (req, res) => {
    try {
        const assets = await Assets.find().sort({ createdAt: -1 });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin", error });
    }
}

const createAssets = async (req, res) => {
    try {
        let imageUrl = "";
        let imagePublicId = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "assetss",
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;

            // Xóa file tạm
            const fs = require("fs");
            fs.unlinkSync(req.file.path);
        }

        // Tạo assets mới
        const newAssets = new Assets({
            imageUrl,
            imagePublicId,
            createdAt: new Date(),
        });

        const savedAssets = await newAssets.save();

        res
            .status(201)
            .json({ message: "Assets created successfully", Assets: savedAssets });
        console.log("Assets created successfully:", savedAssets);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Error creating Assets", error: err.message });
        console.error("Error creating Assets:", err);
    }
};

const deleteAssets = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Assets.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Assets not found" });
        }

        res.json({ message: "Assets deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting Assets", error: err.message });
    }
};

module.exports = {
    getAllAssets,
    createAssets,
    deleteAssets
};
