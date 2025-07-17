const Information = require("../models/Information");
const fs = require("fs");

const getAllInformation = async (req, res) => {
    try {
        const information = await Information.find().sort({ createdAt: -1 });
        res.json(information);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin", error });
    }
}

const updateInformation = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, phoneNumber } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const updatedInformation = await Information.findByIdAndUpdate(
            id,
            { email, phoneNumber },
            { new: true } // Trả về bản đã cập nhật
        );

        if (!updatedInformation) {
            return res.status(404).json({ message: "Information not found" });
        }

        res.json({ message: "Information updated successfully", Information: updatedInformation });
    } catch (err) {
        res.status(500).json({ message: "Error updating Information", error: err.message });
    }
};

const createInformation = async (req, res) => {
    try {
        const { email, phoneNumber} = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const newInformation = new Information({ email, phoneNumber });
        const savedInformation = await newInformation.save();

        res.status(201).json({
            message: "Information created successfully",
            Information: savedInformation,
        });
    } catch (err) {
        console.error("Error creating Information:", err);
        res.status(500).json({ message: "Error creating Information", error: err.message });
    }
};

const deleteInformation = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Information.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Information not found" });
        }

        res.json({ message: "Information deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting Information", error: err.message });
    }
};

module.exports = {
    getAllInformation,
    updateInformation,
    createInformation,
    deleteInformation
};
