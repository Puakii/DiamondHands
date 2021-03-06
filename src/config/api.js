export const CoinList = (currency) =>
    currency === "USD"
        ? "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&or"
        : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=SGD&or";

export const SingleCoin = (coinId, currency) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinId}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const HistoricalChart = (coinId, days = 365, currency) =>
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;

export const HighLightCoins = (currency) =>
    currency === "USD"
        ? "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false"
        : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=sgd&order=market_cap_desc&per_page=6&page=1&sparkline=false";

export const TrendingCoins = (currency) =>
    currency === "USD"
        ? "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=8&page=1&sparkline=false"
        : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=sgd&order=volume_desc&per_page=8&page=1&sparkline=false";

export const FetchNews = (time) =>
    time === ""
        ? `https://min-api.cryptocompare.com/data/v2/news/?${process.env.NEWS_API_KEY}lang=EN&excludeCategories=Sponsored`
        : `https://min-api.cryptocompare.com/data/v2/news/?${process.env.NEWS_API_KEY}lang=EN&lTs=${time}&excludeCategories=Sponsored`;

export const MultiMarketCoins = (coinId) =>
    `https://api.coingecko.com/api/v3/coins/${coinId}/tickers?include_exchange_logo=true&order=volume_desc&depth=true`;
