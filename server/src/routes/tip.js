const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { ResponseHelper, createPaginationMeta } = require('../utils/response');
const Transaction = require('../models/Transaction');
const Blog = require('../models/Blog');
const User = require('../models/User');
const blockchainService = require('../utils/blockchain');

const router = express.Router();

// POST /api/tips/:blogId - Gửi tip cho blog
router.post('/:blogId', authenticateToken, requireRole(['reader']), async (req, res) => {
  try {
    const { blogId } = req.params;
    const { txHash, amount, message = '' } = req.body;
    const fromUserId = req.user._id;
    
    const blog = await Blog.findById(blogId).populate('author');
    if (!blog) {
      return ResponseHelper.notFound(res, 'Bài viết không tồn tại');
    }
    
    if (!blog.settings.allowTips) {
      return ResponseHelper.forbidden(res, 'Bài viết này không cho phép tip');
    }
    
    if (fromUserId.toString() === blog.author._id.toString()) {
      return ResponseHelper.error(res, 'Không thể tip cho chính mình', 400);
    }
    
    const existingTx = await Transaction.findOne({ txHash });
    if (existingTx) {
      return ResponseHelper.conflict(res, 'Transaction đã được xử lý');
    }
    
    const transaction = new Transaction({
      txHash,
      from: fromUserId,
      to: blog.author._id,
      amount: parseFloat(amount),
      blog: blogId,
      message,
      status: 'pending'
    });
    
    await transaction.save();

    const verification = await blockchainService.verifyTransaction(txHash);
    
    if (verification.success) {
      transaction.status = 'confirmed';
      transaction.blockNumber = verification.blockNumber;
      transaction.gasUsed = verification.gasUsed;
      transaction.gasPrice = verification.gasPrice;
      transaction.confirmedAt = new Date();
      await transaction.save();

      // Không cần update Blog stats (totalTips, totalTipAmount) vì đã xóa
      // Frontend sẽ load tip count từ blockchain hoặc Transaction model

      // Không cần update User stats vì tip data đã lưu trên blockchain
      // Frontend sẽ load trực tiếp từ blockchain service

      const io = req.app.get('io');
      if (io) {
        io.to(`blogger-${blog.author._id}`).emit('new-tip', {
          transaction,
          from: req.user,
          blog,
          amount
        });
      }

      return ResponseHelper.success(res, {
        transaction,
        blog: { _id: blog._id, title: blog.title }
      }, 'Tip thành công', 201);
      
    } else {
      transaction.status = 'failed';
      await transaction.save();
      return ResponseHelper.error(res, `Tip thất bại: ${verification.reason}`, 400);
    }

  } catch (error) {
    console.error('Tip error:', error);
    return ResponseHelper.serverError(res, 'Lỗi gửi tip', error);
  }
});

// GET /api/tips/sent
router.get('/sent', authenticateToken, requireRole(['reader']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ from: req.user._id, status: 'confirmed' })
      .populate('to', 'username profile')
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ from: req.user._id, status: 'confirmed' });
    const pagination = createPaginationMeta(page, limit, total);

    return ResponseHelper.paginated(res, transactions, pagination, 'Lấy lịch sử tips thành công');
  } catch (error) {
    return ResponseHelper.serverError(res, 'Lỗi lấy lịch sử tips', error);
  }
});

// GET /api/tips/received
router.get('/received', authenticateToken, requireRole(['blogger']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ to: req.user._id, status: 'confirmed' })
      .populate('from', 'username profile')
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ to: req.user._id, status: 'confirmed' });
    const pagination = createPaginationMeta(page, limit, total);

    return ResponseHelper.paginated(res, transactions, pagination, 'Lấy lịch sử tips nhận thành công');
  } catch (error) {
    return ResponseHelper.serverError(res, 'Lỗi lấy lịch sử tips', error);
  }
});

// GET /api/tips/blog/:blogId
router.get('/blog/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return ResponseHelper.notFound(res, 'Bài viết không tồn tại');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ blog: blogId, status: 'confirmed' })
      .populate('from', 'username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ blog: blogId, status: 'confirmed' });
    const pagination = createPaginationMeta(page, limit, total);

    return ResponseHelper.paginated(res, transactions, pagination, 'Lấy tips của bài viết thành công');
  } catch (error) {
    return ResponseHelper.serverError(res, 'Lỗi lấy tips', error);
  }
});

// GET /api/tips/stats - Public endpoint for platform statistics
router.get('/stats', async (req, res) => {
  try {
    const totalTips = await Transaction.countDocuments({ status: 'confirmed' });
    const totalAmount = await Transaction.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return ResponseHelper.success(res, {
      totalTips,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
    }, 'Lấy thống kê tips thành công');
  } catch (error) {
    return ResponseHelper.serverError(res, 'Lỗi lấy thống kê tips', error);
  }
});

module.exports = router;

module.exports = router;