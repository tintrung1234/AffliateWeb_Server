const cron = require("node-cron");
const Post = require("./models/Post"); // import model Post

// Cron chạy mỗi ngày lúc 00:05 sáng
cron.schedule("5 0 * * *", async () => {
    try {
        console.log("🔄 Bắt đầu dọn dẹp viewsPerDay...");

        const posts = await Post.find();

        for (let post of posts) {
            // Giữ lại 7 ngày gần nhất
            post.viewsPerDay = post.viewsPerDay
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(-7);

            await post.save();
        }

        console.log("✅ Đã dọn dẹp viewsPerDay xong!");
    } catch (error) {
        console.error("❌ Lỗi cron job:", error.message);
    }
});
