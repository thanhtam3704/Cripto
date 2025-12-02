// Script để resync totalArticles và followers cho tất cả user
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Blog = require('./src/models/Blog');

async function resyncStats() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/crypto-tip-system');
    console.log('✅ Connected to MongoDB');

    // Lấy tất cả user
    const allUsers = await User.find({});
    console.log(`\n📊 Total users: ${allUsers.length}`);
    allUsers.forEach(u => console.log(`   - ${u.username} (${u.role})`));
    
    // Lấy tất cả blogger
    const bloggers = await User.find({ role: 'blogger' });
    console.log(`\n📊 Found ${bloggers.length} bloggers`);

    for (const blogger of bloggers) {
      // Đếm số bài viết thực tế
      const blogCount = await Blog.countDocuments({ author: blogger._id });
      
      // Số followers hiện tại (đã đúng từ array)
      const followersCount = blogger.bloggerStats?.followers?.length || 0;
      
      const oldTotalArticles = blogger.bloggerStats?.totalArticles || 0;
      
      // Update totalArticles
      blogger.bloggerStats.totalArticles = blogCount;
      await blogger.save();
      
      console.log(`\n👤 ${blogger.username}:`);
      console.log(`   - Bài viết: ${oldTotalArticles} → ${blogCount}`);
      console.log(`   - Followers: ${followersCount}`);
      
      if (oldTotalArticles !== blogCount) {
        console.log(`   ⚠️  FIXED: totalArticles không khớp!`);
      }
    }

    console.log('\n✅ Resync hoàn tất!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resyncStats();
