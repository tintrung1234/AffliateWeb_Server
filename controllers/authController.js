
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { email, username, password, photoUrl, publicId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      photoUrl,
      publicId,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        photoUrl: newUser.photoUrl,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        favoritesProduct: user.favoritesProduct,
        favoritesPost: user.favoritesPost,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Nếu bạn chỉ muốn cho admin xem:
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.json(users); // Trả về toàn bộ user (trừ password)
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { email, username, role } = req.body;

    const userId = req.user.id; // req.user được gắn từ middleware khi decode token

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        username,
        role,
      },
      { new: true, runValidators: true } // trả về bản ghi sau cập nhật
    ).select("-password"); // không trả về password

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  res.json({ message: "Đổi mật khẩu thành công" });
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting User", error: err.message });
  }
};

exports.toggleProductFavorite = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.favoritesProduct.indexOf(productId);
    let action;

    if (index === -1) {
      // Chưa có => thêm
      user.favoritesProduct.push(productId);
      action = 'added';
    } else {
      // Đã có => xóa
      user.favoritesProduct.splice(index, 1);
      action = 'removed';
    }

    await user.save();
    res.json({ message: `Product ${action} to favorites`, favoritesProduct: user.favoritesProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.togglePostFavorite = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.favoritesPost.indexOf(postId);
    let action;

    if (index === -1) {
      // Chưa có => thêm
      user.favoritesPost.push(postId);
      action = 'added';
    } else {
      // Đã có => xóa
      user.favoritesPost.splice(index, 1);
      action = 'removed';
    }

    await user.save();
    res.json({ message: `Post ${action} to favorites`, favoritesPost: user.favoritesPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
