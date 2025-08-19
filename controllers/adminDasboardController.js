const adminStatsService = require("../services/adminDasboardService");

exports.getOverview = async (req, res) => {
    try {
        const data = await adminStatsService.getOverviewStats();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getViewsPerDay = async (req, res) => {
    try {
        const data = await adminStatsService.getViewsPerDay();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getViewsPerCategory = async (req, res) => {
    try {
        const data = await adminStatsService.getViewsPerCategory();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
