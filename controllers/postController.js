const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy bài viết", error });
  }
};

const searchPosts = async (req, res) => {
  const query = req.query.q || "";
  const category = req.query.category || "";
  const tag = req.query.tag || "";
  try {
    const posts = await Post.find({
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
        category ? { category: category } : {},
        tag ? { tags: tag } : {},
      ],
    }).limit(10);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

const getPostsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const posts = await Post.find({ category: category }).limit(10);
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts by category", error });
  }
};

const getPostDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết bài viết", error });
  }
};

// Lấy 5 bài viết mới nhất
const getPostsNewest = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Lỗi getPostsNewest:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách bài viết",
      error: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { uid, title, description, views, category, content } = req.body;

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
        folder: "posts",
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;


      // Xóa file tạm
      const fs = require("fs");
      fs.unlinkSync(req.file.path);
    }

    // Tạo post mới
    const newPost = new Post({
      uid,
      title,
      description,
      views: typeof views === "number" ? views : 0,
      category,
      content,
      imageUrl,
      imagePublicId,
      createdAt: new Date(),
    });

    const savedPost = await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: savedPost });
    console.log("Post created successfully:", savedPost);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
    console.error("Error creating post:", err);
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, description, views, content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // // Kiểm tra quyền sở hữu
    // if (post.uid !== req.user.uid) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    //Xoa anh 
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    // Upload ảnh mới nếu có
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      post.imageUrl = result.secure_url;
      post.imagePublicId = result.public_id;
      // Xoá file tạm
      fs.unlinkSync(req.file.path);
    }

    // Cập nhật các trường còn lại
    post.category = category || post.category;
    post.title = title || post.title;
    post.description = description || post.description;
    post.content = content || post.content;
    post.views = views !== undefined ? Number(views) : post.views;

    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // ✅ Delete image from Cloudinary
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
};

const getTop1Blog = async (req, res) => {
  try {
    const posts = await Post.findOne().sort({ createdAt: -1 }); // Sắp xếp mới nhất trước
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy bài viết", error });
  }
};

module.exports = {
  getAllPosts,
  searchPosts,
  getPostsByCategory,
  getPostDetail,
  getPostsNewest,
  createPost,
  updatePost,
  deletePost,
  getTop1Blog
};
