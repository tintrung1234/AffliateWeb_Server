const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, updateUser, deleteUser, changePassword, toggleProductFavorite, togglePostFavorite } = require("../controllers/authController");
const { authMiddleware, isUserMiddleware } = require("../middlewares/middlewares");

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, getAllUsers);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);
router.put("/change-password", authMiddleware, changePassword);
router.post('/favorites/product', isUserMiddleware, toggleProductFavorite);
router.post('/favorites/post', isUserMiddleware, togglePostFavorite);

module.exports = router;
