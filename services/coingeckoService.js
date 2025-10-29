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

  const { data } = await axios.get(COINGECKO_URL, { params });
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

module.exports = { fetchTopCoins };