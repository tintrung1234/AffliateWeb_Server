const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, updateUser, deleteUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/middlewares");

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, getAllUsers);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);

module.exports = router;
