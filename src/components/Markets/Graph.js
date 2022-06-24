import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress } from "@mui/material";

import { CryptoState } from "../../pages/CryptoContext";
import { HistoricalChart } from "../../config/api";
import { Line } from "react-chartjs-2";

const Graph = ({ coinId }) => {
    //use context api to keep track of what to display as well as the currency
    const { setGraphOrMarket, currency } = CryptoState();

    //state for storing historical data obtained from API
    const [historicData, setHistoricData] = useState(null);

    const [days, setDays] = useState(1);
    const [loading, setLoading] = useState(true);

    //for timespan buttons below of graph
    const toggleDays = [
        {
            label: "24 Hours",
            value: 1,
        },
        {
            label: "30 Days",
            value: 30,
        },
        {
            label: "3 Months",
            value: 90,
        },
        {
            label: "1 Year",
            value: 365,
        },
    ];

    function refreshPrices(coinId, days, currency) {
        setLoading(true);
        axios
            .get(HistoricalChart(coinId, days, currency))
            .then((response) => {
                setHistoricData(response.data.prices);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }

    useEffect(() => {
        refreshPrices(coinId, days, currency);
        const timerId = setInterval(
            () => refreshPrices(coinId, days, currency),
            5000
        );
        return function cleanup() {
            clearInterval(timerId);
        };
        //disable dependency warning as there is no way in this page where we can change coin, so coinId is not a required dependencies
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days, currency]);

    // if (historicData !== null) {
    //     console.log(historicData);
    // }

    return (
        <Box>
            <Box
                className="Box for toggling buttons"
                display="flex"
                width="85%"
                marginLeft="auto"
                marginRight="auto"
                marginTop="2%"
            >
                <Button
                    variant="contained"
                    sx={{
                        marginRight: "1%",
                        "&.MuiButton-root": {
                            backgroundColor: "rgb(0, 255, 242)",
                        },
                        fontWeight: 700,
                    }}
                >
                    Overview
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setGraphOrMarket(false)}
                >
                    Market
                </Button>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="85%"
                marginLeft="auto"
                marginRight="auto"
                marginTop="5%"
            >
                {loading || historicData === null ? (
                    <CircularProgress
                        size="10%"
                        sx={{ color: "var(--primary)" }}
                    />
                ) : (
                    <Box
                        className="containerForGraph"
                        width="100%"
                        height="20%"
                    >
                        <Line
                            data={{
                                labels: historicData.map((instance) => {
                                    const date = new Date(instance[0]);
                                    const time =
                                        date.getHours() > 12
                                            ? date.getMinutes() < 10
                                                ? `${
                                                      date.getHours() - 12
                                                  }: 0${date.getMinutes()} PM`
                                                : `${
                                                      date.getHours() - 12
                                                  }: ${date.getMinutes()} PM`
                                            : date.getMinutes() < 10
                                            ? `${date.getHours()}: 0${date.getMinutes()} AM`
                                            : `${date.getHours()}: ${date.getMinutes()} AM`;

                                    return days === 1
                                        ? time
                                        : date.toLocaleDateString();
                                }),

                                datasets: [
                                    {
                                        data: historicData.map(
                                            (instance) => instance[1]
                                        ),

                                        label: `Price:  Past ${days} Day(s) in ${currency}`,
                                        borderColor: "rgb(0, 255, 242)",
                                    },
                                ],
                            }}
                            width={300}
                            height={330}
                            options={{
                                maintainAspectRatio: false,
                                elements: { point: { radius: 1 } },
                            }}
                        />
                        <Box
                            display="flex"
                            marginTop="2%"
                            justifyContent="space-evenly"
                        >
                            {toggleDays.map((selection) => (
                                <Button
                                    key={selection.value}
                                    sx={{
                                        "&.MuiButton-root": {
                                            backgroundColor:
                                                selection.value === days
                                                    ? "rgb(0, 255, 242)"
                                                    : "black",
                                            color:
                                                selection.value === days
                                                    ? "black"
                                                    : "white",
                                        },

                                        width: { xs: "25%", md: "15%" },
                                        border: "1px solid",
                                        borderColor: "rgb(0, 255, 242)",
                                        paddingLeft: "7px",
                                        paddingRight: "7px",
                                        fontWeight: "700",
                                    }}
                                    onClick={() => {
                                        setDays(selection.value);
                                    }}
                                >
                                    {selection.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Graph;
