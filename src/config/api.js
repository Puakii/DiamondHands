export const CoinList = (currency) =>
    currency === "USD"
        ? "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&or"
        : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=SGD&or";

export const SingleCoin = (id) =>
    `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id, days = 365, currency) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

// export const TrendingCoins = (currency) =>
// `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

export const TrendingCoins = (currency) =>
    currency === "USD"
        ? "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=8&page=1&sparkline=false"
        : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=sgd&order=volume_desc&per_page=8&page=1&sparkline=false";
