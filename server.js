const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const cron = require('node-cron');
const { fetchTopCoins } = require('./services/coingeckoService');
const HistoricalCoin = require('./models/HistoricalCoin');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Cron job: every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Cron: fetching coins for history...');
    const coins = await fetchTopCoins();
    const docs = coins.map((c) => ({ ...c, snapshotAt: new Date() }));
    await HistoricalCoin.insertMany(docs);
    console.log(`Cron: inserted ${docs.length} historical records.`);
  } catch (err) {
    console.error('Cron error:', err.message);
  }
});