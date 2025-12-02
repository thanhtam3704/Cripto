const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    txHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    // Người gửi và nhận
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Thông tin tip
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    // Message kèm theo tip (optional)
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Trạng thái transaction
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    // Thông tin blockchain
    gasUsed: {
      type: Number,
    },
    gasPrice: {
      type: Number,
    },
    // Thời gian confirm
    confirmedAt: {
      type: Date,
    },
    // Metadata
    metadata: {
      clientIP: String,
      userAgent: String,
      platform: String,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual để tính phí transaction
transactionSchema.virtual("transactionFee").get(function () {
  if (this.gasUsed && this.gasPrice) {
    return this.gasUsed * this.gasPrice;
  }
  return 0;
});

// Method để confirm transaction
transactionSchema.methods.confirm = function (blockNumber, gasUsed, gasPrice) {
  this.status = "confirmed";
  this.blockNumber = blockNumber;
  this.gasUsed = gasUsed;
  this.gasPrice = gasPrice;
  this.confirmedAt = new Date();
  return this.save();
};

// Method để fail transaction
transactionSchema.methods.fail = function () {
  this.status = "failed";
  return this.save();
};

// Static method để lấy lịch sử tips của user
transactionSchema.statics.getUserTipHistory = function (userId, type = "sent") {
  const filter = type === "sent" ? { from: userId } : { to: userId };
  return this.find({ ...filter, status: "confirmed" })
    .populate("from", "username profile")
    .populate("to", "username profile")
    .populate("blog", "title coverImage excerpt")
    .sort({ createdAt: -1 });
};

// Static method để lấy thống kê tips theo blog
transactionSchema.statics.getblogTipStats = function (blogId) {
  return this.aggregate([
    {
      $match: {
        blog: mongoose.Types.ObjectId(blogId),
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: "$blog",
        totalTips: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        avgAmount: { $avg: "$amount" },
        maxAmount: { $max: "$amount" },
        minAmount: { $min: "$amount" },
      },
    },
  ]);
};

// Static method để lấy top tippers cho writer
transactionSchema.statics.getTopTippers = function (writerId, limit = 10) {
  return this.aggregate([
    {
      $match: {
        to: mongoose.Types.ObjectId(writerId),
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: "$from",
        totalTips: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        lastTipDate: { $max: "$createdAt" },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "tipper",
      },
    },
    {
      $unwind: "$tipper",
    },
    {
      $project: {
        _id: 1,
        totalTips: 1,
        totalAmount: 1,
        lastTipDate: 1,
        "tipper.username": 1,
        "tipper.profile.displayName": 1,
        "tipper.profile.avatar": 1,
      },
    },
  ]);
};

// Index cho performance (bỏ qua txHash vì đã có unique: true)
transactionSchema.index({ from: 1, status: 1 });
transactionSchema.index({ to: 1, status: 1 });
transactionSchema.index({ blog: 1, status: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ blockNumber: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
