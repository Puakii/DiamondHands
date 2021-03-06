//version 2 og version
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCryptoState } from "../../context/CryptoContext";
import { SingleCoin } from "../../config/api";

import Alert from "./Alert";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    LinearProgress,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const CoinSummary = ({ coinId, bestToBuy, bestToSell }) => {
    const [coinData, setCoinData] = useState(null);
    const [loading, setLoading] = useState(true);

    //for button clicked
    const [clicked, setClick] = useState(false);

    //get from contextAPI
    const { currency, symbol, setCurrency } = useCryptoState();

    function refreshPrices(coinId, currency) {
        setLoading(true);
        axios
            .get(SingleCoin(coinId, currency))
            .then((response) => {
                setCoinData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }

    useEffect(() => {
        refreshPrices(coinId, currency);

        const timerId = setInterval(
            () => refreshPrices(coinId, currency),
            5000
        );
        return function cleanup() {
            clearInterval(timerId);
        };
    }, [coinId, currency]);

    return (
        <Box
            className="coinSummaryContainer"
            sx={{
                width: "85%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: { xs: "2.5%", lg: "0%" },
            }}
        >
            {loading ||
            coinData === null ||
            bestToBuy.length === 0 ||
            bestToSell.length === 0 ? (
                <LinearProgress style={{ backgroundColor: "var(--primary)" }} />
            ) : (
                <Grid container spacing={2} direction="column">
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "2%",
                            marginBottom: "1%",
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            md={4}
                            // sx={{ marginLeft: { xs: "0%" lg: "5%" } }}
                        >
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    sx={{
                                        width: { xs: "12%", lg: "10%" },
                                        height: { xs: "12%", lg: "10%" },
                                        paddingRight: "1.5%",
                                    }}
                                    alt={coinData[0].id}
                                    src={coinData[0].image}
                                />
                                <Typography
                                    sx={{
                                        display: {
                                            xs: "none",
                                            tablet: "block",
                                            lg: "block",
                                        },
                                        marginLeft: "2%",
                                    }}
                                    variant="h1"
                                    component="h6"
                                    fontSize="2.5rem"
                                    fontWeight="700"
                                >
                                    {coinData[0].name}
                                </Typography>
                                <Box
                                    marginLeft="3%"
                                    sx={{
                                        display: {
                                            xs: "none",
                                            tablet: "block",
                                        },
                                        border: "1px solid",
                                        padding: "0.3%",
                                        borderRadius: "20%",
                                        borderColor: "gray",
                                    }}
                                >
                                    {coinData[0].symbol.toUpperCase()}
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Box
                                    sx={{
                                        marginTop: { xs: "3%", lg: "1.5%" },
                                        color: "whitesmoke",
                                        fontSize: "0.8rem",
                                        padding: "0.5%",
                                        border: "1px solid",
                                        borderRadius: "10%",
                                        borderColor: "gray",
                                    }}
                                >
                                    {"Rank #" + coinData[0].market_cap_rank}
                                </Box>
                                <Box
                                    sx={{
                                        marginTop: { xs: "3%", lg: "1.5%" },
                                        marginLeft: "3%",
                                        color: "whitesmoke",
                                        fontSize: "0.8rem",
                                        padding: "0.5%",
                                        border: "1px solid",
                                        borderRadius: "10%",
                                        borderColor: "gray",
                                    }}
                                >
                                    Coin
                                </Box>
                                <Alert coinId={coinId} apiData={coinData} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column">
                                <Box display="flex" alignItems="center">
                                    <Typography
                                        fontSize="1rem"
                                        color="whitesmoke"
                                        fontWeight="700"
                                    >
                                        {coinData[0].name +
                                            " Price" +
                                            " (" +
                                            coinData[0].symbol.toUpperCase() +
                                            ")"}
                                    </Typography>
                                    <Select
                                        variant="outlined"
                                        sx={{
                                            width: 80,
                                            height: 30,
                                            "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                    borderColor:
                                                        "rgb(0, 255, 242)",
                                                },
                                            "& .MuiSvgIcon-root": {
                                                color: "rgb(0, 255, 242)",
                                            },
                                            marginLeft: {
                                                xs: "9%",
                                                md: "7%",
                                            },
                                        }}
                                        value={currency}
                                        onChange={(e) =>
                                            setCurrency(e.target.value)
                                        }
                                    >
                                        <MenuItem value={"USD"}>USD</MenuItem>
                                        <MenuItem value={"SGD"}>SGD</MenuItem>
                                    </Select>
                                </Box>
                                <Box
                                    className="price-and-change"
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Typography
                                        className="price"
                                        fontSize="2.5rem"
                                        color="whitesmoke"
                                        fontWeight="700"
                                    >
                                        {symbol}
                                        {coinData[0].current_price.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </Typography>
                                    <Box
                                        className="price-change"
                                        marginLeft="4%"
                                        border="1px solid"
                                        borderRadius="10%"
                                        padding="2px"
                                        borderColor={
                                            coinData[0]
                                                .price_change_percentage_24h < 0
                                                ? "red"
                                                : "green"
                                        }
                                    >
                                        {coinData[0]
                                            .price_change_percentage_24h < 0 ? (
                                            <span
                                                style={{
                                                    color: "red",
                                                    display: "flex",
                                                }}
                                            >
                                                <FiArrowDown />
                                                {coinData[0].price_change_percentage_24h.toFixed(
                                                    2
                                                )}
                                                %
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    color: "green",
                                                    display: "flex",
                                                }}
                                            >
                                                <FiArrowUp />
                                                {coinData[0].price_change_percentage_24h.toFixed(
                                                    2
                                                )}
                                                %
                                            </span>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={12} md={4}>
                            <Alert coinId={coinId} data={data} />
                        </Grid> */}
                    </Grid>

                    <Divider sx={{ display: { xs: "none", lg: "block" } }} />

                    <Grid
                        container
                        spacing={2}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "2%",
                            marginBottom: "2%",
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            md={2.3}
                            sx={{
                                display: {
                                    xs: clicked ? "flex" : "none",
                                    md: "flex",
                                    lg: "flex",
                                },
                            }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box
                                className="market-cap"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                    // sx={{paddingRight}}
                                >
                                    Market Cap
                                </Typography>
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    {symbol}
                                    {coinData[0].market_cap.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </Typography>

                                {coinData[0].price_change_percentage_24h < 0 ? (
                                    <span
                                        style={{
                                            color: "red",
                                            display: "flex",
                                        }}
                                    >
                                        <FiArrowDown />
                                        {coinData[0].market_cap_change_percentage_24h.toFixed(
                                            2
                                        )}
                                        %
                                    </span>
                                ) : (
                                    <span
                                        style={{
                                            color: "green",
                                            display: "flex",
                                        }}
                                    >
                                        <FiArrowUp />
                                        {coinData[0].market_cap_change_percentage_24h.toFixed(
                                            2
                                        )}
                                        %
                                    </span>
                                )}
                            </Box>
                        </Grid>

                        {/* by default is 0 pixel so need set to true */}
                        <Divider flexItem={true} orientation="vertical" />

                        <Grid
                            item
                            xs={12}
                            md={2.3}
                            sx={{
                                display: {
                                    xs: clicked ? "flex" : "none",
                                    md: "flex",
                                    lg: "flex",
                                },
                            }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box
                                className="circulating-supply"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    Circulating Supply
                                </Typography>
                                {coinData[0].circulating_supply.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}{" "}
                                {coinData[0].symbol.toUpperCase()}
                            </Box>
                        </Grid>
                        <Divider flexItem={true} orientation="vertical" />
                        <Grid
                            item
                            xs={12}
                            md={2.3}
                            sx={{
                                display: {
                                    xs: clicked ? "flex" : "none",
                                    md: "flex",
                                    lg: "flex",
                                },
                            }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box
                                className="24-hr"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    24h
                                </Typography>
                                <span style={{ color: "green" }}>
                                    High: {symbol}
                                    {coinData[0].high_24h.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>
                                <span style={{ color: "red" }}>
                                    Low: {symbol}
                                    {coinData[0].low_24h.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>
                            </Box>
                        </Grid>
                        <Divider flexItem={true} orientation="vertical" />
                        <Grid
                            item
                            xs={12}
                            md={2.3}
                            sx={{
                                display: {
                                    xs: clicked ? "flex" : "none",
                                    md: "flex",
                                },
                            }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box
                                className="best-to-buy"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                            >
                                <Typography
                                    fontSize="1rem"
                                    color="green"
                                    fontWeight="700"
                                >
                                    Best To Buy
                                </Typography>
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    Market: {bestToBuy[0]}
                                </Typography>
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    Trading Pair: {bestToBuy[1]}
                                </Typography>
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    Price: USD{" "}
                                    {bestToBuy[2].toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={2.3}
                            sx={{
                                display: {
                                    xs: clicked ? "flex" : "none",
                                    md: "flex",
                                },
                            }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box
                                className="best-to-sell"
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography
                                    fontSize="1rem"
                                    color="red"
                                    fontWeight="700"
                                >
                                    Best To Sell
                                </Typography>
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    Market: {bestToSell[0]}
                                </Typography>
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    Trading Pair: {bestToSell[1]}
                                </Typography>
                                <Typography
                                    fontSize="1rem"
                                    color="whitesmoke"
                                    fontWeight="700"
                                >
                                    Price: USD{" "}
                                    {bestToSell[2].toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {clicked ? (
                        <Button
                            variant="contained"
                            sx={{
                                display: { md: "none" },
                                "&.MuiButton-root": {
                                    backgroundColor: "var(--primary)",
                                },
                                borderRadius: "10px",
                                width: "80%",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "2%",
                                marginBottom: "2%",
                            }}
                            onClick={() => setClick(false)}
                        >
                            Less Stats
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            sx={{
                                display: { md: "none" },
                                "&.MuiButton-root": {
                                    backgroundColor: "var(--primary)",
                                },
                                borderRadius: "10px",
                                width: "95%",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "2%",
                                marginBottom: "2%",
                            }}
                            onClick={() => setClick(true)}
                        >
                            More Stats
                        </Button>
                    )}

                    <Divider sx={{ display: { xs: "none", lg: "block" } }} />
                </Grid>
            )}
        </Box>
    );
};
export default CoinSummary;
