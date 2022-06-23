export const CoinList = (currency) =>
    currency === "USD"
        ? "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&or"
        : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=SGD&or";

export const SingleCoin = (id) =>
    `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id, days = 365, currency) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

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
        ? "https://min-api.cryptocompare.com/data/v2/news/?13b7c441cb76aec3a29ee3c43ac633bc15eee7cf3177f757cf0a5d07af5b7f3alang=EN&excludeCategories=Sponsored"
        : `https://min-api.cryptocompare.com/data/v2/news/?13b7c441cb76aec3a29ee3c43ac633bc15eee7cf3177f757cf0a5d07af5b7f3alang=EN&lTs=${time}&excludeCategories=Sponsored`;
