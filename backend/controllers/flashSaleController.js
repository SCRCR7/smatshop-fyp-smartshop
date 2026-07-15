const FlashSaleConfig = require('../models/FlashSaleConfig');

// GET /api/flash-sale
exports.getFlashSale = async (req, res) => {
  const config = await FlashSaleConfig.findOne().sort({ updatedAt: -1 });
  if (!config) return res.json({ isActive: false });

  const now = new Date();
  let status = 'inactive';
  if (config.isActive) {
    if (now < config.startTime) status = 'upcoming';
    else if (now >= config.startTime && now <= config.endTime) status = 'active';
    else status = 'expired';
  }
  res.json({
    isActive: config.isActive,
    startTime: config.startTime,
    endTime: config.endTime,
    status,
    now,
  });
};

// PUT /api/flash-sale (admin only)
exports.updateFlashSale = async (req, res) => {
  const { isActive, startTime, endTime } = req.body;
  let config = await FlashSaleConfig.findOne();
  if (!config) config = new FlashSaleConfig();
  config.isActive = isActive;
  config.startTime = startTime;
  config.endTime = endTime;
  await config.save();
  res.json({ success: true, config });
};
