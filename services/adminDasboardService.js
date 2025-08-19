const Post = require("../models/Post");
const Category = require("../models/Categories");

exports.getOverviewStats = async () => {
    const postCount = await Post.countDocuments();
    const categoryCount = await Category.countDocuments();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const postsLast7Days = await Post.find({ createdAt: { $gte: sevenDaysAgo } });
    const viewsLast7Days = postsLast7Days.reduce((sum, post) => sum + (post.views || 0), 0);

    return { postCount, categoryCount, viewsLast7Days };
};

exports.getViewsPerDay = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const stats = await Post.aggregate([
        { $unwind: "$viewsPerDay" }, // tách từng phần tử trong viewsPerDay
        { $match: { "viewsPerDay.date": { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%d/%m", date: "$viewsPerDay.date" } },
                totalViews: { $sum: "$viewsPerDay.count" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    return {
        labels: stats.map(s => s._id),
        data: stats.map(s => s.totalViews)
    };
};

exports.getViewsPerCategory = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const stats = await Post.aggregate([
        { $unwind: "$viewsPerDay" },
        { $match: { "viewsPerDay.date": { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: "$category",
                totalViews: { $sum: "$viewsPerDay.count" }
            }
        },
        { $sort: { totalViews: -1 } }
    ]);

    return {
        labels: stats.map(s => s._id),
        data: stats.map(s => s.totalViews)
    };
};

