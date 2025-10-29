const mongoose = require('mongoose');

const HistoricalCoinSchema = new mongoose.Schema({
  coinId: { type: String, index: true },
  name: String,
  symbol: String,
  priceUsd: Number,
  marketCapUsd: Number,
  change24hPercent: Number,
  lastUpdated: Date,
  snapshotAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('HistoricalCoin', HistoricalCoinSchema);