const mongoose = require('mongoose');

const CurrentCoinSchema = new mongoose.Schema({
  coinId: { type: String, index: true, unique: true },
  name: String,
  symbol: String,
  priceUsd: Number,
  marketCapUsd: Number,
  change24hPercent: Number,
  lastUpdated: Date,
}, { timestamps: true });

module.exports = mongoose.model('CurrentCoin', CurrentCoinSchema);