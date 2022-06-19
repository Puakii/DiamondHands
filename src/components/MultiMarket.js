import React, { useState, useEffect } from "react";
import axios from "axios";
import { MultiMarketCoins } from "../config/api";
import {
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

const MultiMarket = () => {
    const [object, setObject] = useState(null);

    const [loadingData, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
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
        for (let i = 0; i < exchangesName.length; i++) {
            let exchangeName = exchangesName[i];
            axios
                .get(MultiMarketCoins("bitcoin", exchangeName))
                .then((response) => {
                    if (response.data) {
                        exchangesMap.set(
                            exchangeName,
                            response.data.tickers[0].last
                            // response.data
                        );
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setObject(exchangesMap);

        setLoading(false);
    }, []);

    return (
        <TableContainer
            // className="tableContainer"
            style={{
                width: "100%",
            }}
        >
            {loadingData ? (
                <LinearProgress style={{ backgroundColor: "var(--primary)" }} />
            ) : (
                <Table>
                    <TableHead
                        style={{
                            backgroundColor: "var(--primary)",
                        }}
                    >
                        <TableRow>
                            <TableCell
                                sx={{
                                    color: "black",
                                    fontWeight: "700",
                                    fontFamily: "Montserrat",
                                    position: "sticky",
                                    left: 0,
                                    backgroundColor: "rgba(0, 255, 242)",
                                }}
                                align={"left"}
                            >
                                Source
                            </TableCell>

                            <TableCell
                                sx={{
                                    color: "black",
                                    fontWeight: "700",
                                    fontFamily: "Montserrat",
                                }}
                                align={"right"}
                            >
                                Price
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            //return us an array of the coins that match the search
                            Array.from(object).map((pair) => {
                                return (
                                    <TableRow
                                        sx={{
                                            "&: hover": {
                                                backgroundColor: "#16171a",
                                            },
                                        }}
                                        className="coin-row"
                                        key={pair}
                                    >
                                        <TableCell
                                            // specify component and scope for semantics
                                            component="th"
                                            scope="row"
                                            sx={{
                                                display: "flex",
                                                columnGap: "15px",
                                                position: "sticky",
                                                left: 0,
                                                backgroundColor: "#121212",
                                            }}
                                        >
                                            {pair[0].toUpperCase()}
                                        </TableCell>

                                        <TableCell align="right">
                                            USD {pair[1]}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default MultiMarket;
