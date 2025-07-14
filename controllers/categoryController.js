const Categories = require("../models/Categories");
const fs = require("fs");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh muc", error });
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedCategory = await Categories.findByIdAndUpdate(
      id,
      { title },
      { new: true } // Trả về bản đã cập nhật
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category: updatedCategory });
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newCategory = new Categories({ title });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Categories.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err.message });
  }
};

module.exports = {
  getAllCategories,
  updateCategory,
  createCategory,
  deleteCategory
};
