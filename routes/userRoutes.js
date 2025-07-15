const express = require("express");
const router = express.Router();
const { register, login, getUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/middlewares");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUser);

module.exports = router;
