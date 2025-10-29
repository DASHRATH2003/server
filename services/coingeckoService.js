const axios = require('axios');

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets';

async function fetchTopCoins() {
  const params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h',
  };
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'CryptoTracker/1.0 (+render)',
  };
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }
  const options = {
    params,
    timeout: 10000,
    headers,
  };

  // basic single retry on transient errors / rate limit
  try {
    const { data } = await axios.get(COINGECKO_URL, options);
    return data.map((c) => ({
      coinId: c.id,
      name: c.name,
      symbol: c.symbol?.toUpperCase(),
      priceUsd: c.current_price,
      marketCapUsd: c.market_cap,
      change24hPercent: c.price_change_percentage_24h,
      lastUpdated: c.last_updated ? new Date(c.last_updated) : new Date(),
    }));
  } catch (err) {
    const shouldRetry = !err.response || [429, 500, 502, 503, 504].includes(err.response.status);
    if (shouldRetry) {
      await new Promise((r) => setTimeout(r, 1000));
      const { data } = await axios.get(COINGECKO_URL, options);
      return data.map((c) => ({
        coinId: c.id,
        name: c.name,
        symbol: c.symbol?.toUpperCase(),
        priceUsd: c.current_price,
        marketCapUsd: c.market_cap,
        change24hPercent: c.price_change_percentage_24h,
        lastUpdated: c.last_updated ? new Date(c.last_updated) : new Date(),
      }));
    }
    throw err;
  }
}

module.exports = { fetchTopCoins };