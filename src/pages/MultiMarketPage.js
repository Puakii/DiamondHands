import React, { useState, useEffect } from "react";
import axios from "axios";
import { MultiMarketCoins } from "../config/api";
import Navbar from "../components/EntireWebsite/Navbar";
import MultiMarketTable from "../components/MultiMarketPage/MultiMarketTable";
import { Box } from "@mui/system";
import CoinSummary from "../components/MultiMarketPage/CoinSummary";
import { useParams } from "react-router-dom";
import Graph from "../components/MultiMarketPage/Graph";
import { useCryptoState } from "../context/CryptoContext";

const MultiMarketPage = () => {
    //get the userIf param from the URL
    const { coinId } = useParams();

    const [data, setData] = useState(null);
    const [loadingData, setLoading] = useState(true);

    //for best market to buy and sell
    const [bestToBuy, setBestToBuy] = useState([]);
    const [bestToSell, setBestToSell] = useState([]);

    // //keep track of number of results returned by API call
    const [numOfResult, setNumberOfResult] = useState(0);

    //use context api to keep track of what to display
    const { graphOrMarket } = useCryptoState();

    function refreshPrices(coinId) {
        axios
            .get(MultiMarketCoins(coinId))
            .then((response) => {
                setData(response.data.tickers);
                setNumberOfResult(response.data.tickers.length);
                //for loop to find best price to sell and best price to buy
                var bestPlatformToBuy = "";
                var bestPriceToBuy = Number.MAX_SAFE_INTEGER;
                var buyingPairs = "";
                var bestPlatformToSell = "";
                var bestPriceToSell = Number.MIN_SAFE_INTEGER;
                var sellingPairs = "";
                for (let i = 0; i < response.data.tickers.length; i++) {
                    const element = response.data.tickers[i];
                    if (element.converted_last.usd < bestPriceToBuy) {
                        bestPriceToBuy = element.converted_last.usd;
                        bestPlatformToBuy = element.market.name;
                        buyingPairs = element.base + "/" + element.target;
                    }
                    if (element.converted_last.usd > bestPriceToSell) {
                        bestPriceToSell = element.converted_last.usd;
                        bestPlatformToSell = element.market.name;
                        sellingPairs = element.base + "/" + element.target;
                    }
                }
                var arrayBuy = [bestPlatformToBuy, buyingPairs, bestPriceToBuy];
                setBestToBuy(arrayBuy);
                var arraySell = [
                    bestPlatformToSell,
                    sellingPairs,
                    bestPriceToSell,
                ];
                setBestToSell(arraySell);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        refreshPrices(coinId);
        setLoading(false);
        const timerId = setInterval(() => refreshPrices(coinId), 5000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, [coinId]);

    if (!loadingData && data !== null) {
        // console.log(data);
        // console.log(bestToBuy);
        // console.log(bestToSell);
    }

    return (
        <Box>
            {/* <Alert severity="error">
                This is an error alert — check it out!
            </Alert> */}
            <Navbar />
            <CoinSummary
                coinId={coinId}
                bestToBuy={bestToBuy}
                bestToSell={bestToSell}
            />
            {graphOrMarket ? (
                <Graph coinId={coinId} />
            ) : (
                <MultiMarketTable
                    tableData={data}
                    numOfResult={numOfResult}
                    loadingData={loadingData}
                />
            )}
        </Box>
    );
};

export default MultiMarketPage;
