import React, { useState, useEffect } from "react";
import axios from "axios";
import { MultiMarketCoins } from "../config/api";

const MultiMarket = () => {
    const exchangesName = [
        "binance",
        "ftx",
        "gdax",
        "kraven",
        "kucoin",
        "gate",
        "gemini",
        "huobi",
        "bitfinex",
        "binance_us",
    ];

    const exchangesName2 = new Map([
        ["binance", ""],
        ["ftx", ""],
        ["gdax", ""],
        ["kraven", ""],
        ["kucoin", ""],
        ["gate", ""],
        ["gemini", ""],
        ["huobi", ""],
        ["bitfinex", ""],
        ["binance_us", ""],
    ]);

    const [data, setData] = useState(null);

    useEffect(() => {
        //forloop inside
        for (let i = 0; i < exchangesName.length; i++) {
            let exchangeName = exchangesName[i];

            axios
                .get(MultiMarketCoins("bitcoin", "binance"))
                .then((response) => {
                    exchangesName2.set(exchangeName, response.data.tickers[0]);
                    console.log(exchangesName2);
                })
                .catch((error) => {
                    console.log(error);
                });

            // if (data) {
            //     // exchangesName2.set("binance", data.tickers[0]);
            //     console.log(exchangesName2);
            // }
        }
    });

    if (!data) {
        return <></>;
    }

    // console.log(data);
    // console.log(exchangesName2);

    return <div>{data.tickers[0].last}</div>;
};

export default MultiMarket;
