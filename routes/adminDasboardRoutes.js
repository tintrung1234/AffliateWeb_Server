const express = require("express");
const router = express.Router();
const adminStatsController = require("../controllers/adminDasboardController");

router.get("/overview", adminStatsController.getOverview);
router.get("/views-per-day", adminStatsController.getViewsPerDay);
router.get("/views-per-category", adminStatsController.getViewsPerCategory);

module.exports = router;
