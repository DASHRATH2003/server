const CurrentCoin = require('../models/CurrentCoin');
const HistoricalCoin = require('../models/HistoricalCoin');
const { fetchTopCoins } = require('../services/coingeckoService');

// GET /api/coins
async function getCoins(req, res) {
  try {
    const coins = await fetchTopCoins();
    // Optionally skip DB writes in restricted environments
    if (process.env.DISABLE_DB_WRITE !== 'true') {
      // Try to upsert into CurrentCoin, but don't fail the response
      // if the database operation errors out (e.g., cloud DB not reachable).
      try {
        const ops = coins.map((c) => ({
          updateOne: {
            filter: { coinId: c.coinId },
            update: { $set: c },
            upsert: true,
          },
        }));
        if (ops.length) {
          await CurrentCoin.bulkWrite(ops);
        }
      } catch (dbErr) {
        console.error('DB upsert failed (continuing with API response):', dbErr.message);
      }
    }
    return res.json(coins);
  } catch (err) {
    console.error('Error in getCoins:', err.message);
    return res.status(500).json({ error: 'Failed to fetch coins' });
  }
}

// POST /api/history
async function postHistory(req, res) {
  try {
    const coins = await fetchTopCoins();
    if (process.env.DISABLE_DB_WRITE === 'true') {
      return res.status(200).json({ inserted: 0, message: 'DB writes disabled' });
    }
    const docs = coins.map((c) => ({ ...c, snapshotAt: new Date() }));
    const result = await HistoricalCoin.insertMany(docs);
    console.log(`POST /api/history inserted: ${result.length}`);
    return res.status(201).json({ inserted: result.length });
  } catch (err) {
    console.error('Error in postHistory:', err.message);
    return res.status(500).json({ error: 'Failed to store history' });
  }
}

// GET /api/history/:coinId
async function getHistory(req, res) {
  try {
    const { coinId } = req.params;
    if (!coinId) return res.status(400).json({ error: 'coinId is required' });
    const history = await HistoricalCoin.find({ coinId }).sort({ snapshotAt: -1 }).limit(200);
    return res.json(history);
  } catch (err) {
    console.error('Error in getHistory:', err.message);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
}

module.exports = { getCoins, postHistory, getHistory };