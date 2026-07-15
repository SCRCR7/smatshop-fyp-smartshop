const mongoose = require('mongoose');

const flashSaleConfigSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('FlashSaleConfig', flashSaleConfigSchema);