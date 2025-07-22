const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, updateUser, deleteUser, changePassword } = require("../controllers/authController");
const authMiddleware = require("../middlewares/middlewares");

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, getAllUsers);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
