import React, { useState, useEffect } from "react";
import axios from "axios";
import { MultiMarketCoins } from "../config/api";
import { ConstructionOutlined } from "@mui/icons-material";

const MultiMarket = () => {
    const exchangesName = [
        "binance",
        "ftx_us",
        "gdax",
        "kraken",
        "kucoin",
        "gate",
        "gemini",
        "huobi",
        "bitfinex",
        "binance_us",
    ];

    const exchangesMap = new Map([
        ["binance", ""],
        ["ftx_us", ""],
        ["gdax", ""],
        ["kraken", ""],
        ["kucoin", ""],
        ["gate", ""],
        ["gemini", ""],
        ["huobi", ""],
        ["bitfinex", ""],
        ["binance_us", ""],
    ]);

    const [object, setObject] = useState(exchangesMap);

    const [loadingData, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        for (let i = 0; i < exchangesName.length; i++) {
            let exchangeName = exchangesName[i];
            axios
                .get(MultiMarketCoins("bitcoin", exchangeName))
                .then((response) => {
                    if (response.data) {
                        setObject(
                            exchangesMap.set(
                                exchangeName,
                                response.data.tickers[0]
                            )
                        );
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setLoading(false);
    }, [exchangesName, exchangesMap]);

    if (loadingData) {
        return <></>;
    }

    return <div>hello</div>;
};

export default MultiMarket;
