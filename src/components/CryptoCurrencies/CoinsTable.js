import React, { useState, useEffect } from "react";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import { CoinList } from "../../config/api";
import { CryptoState } from "../../pages/CryptoContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
    createTheme,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    ThemeProvider,
} from "@mui/material";

import "./CoinsTable.css";

const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#fff",
        },

        mode: "dark",
    },
});

const CoinsTable = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    //default state for search should be "" instead of null .includes will return true for "" but false for null
    const [search, setSearch] = useState("");
    const [watchlist, setWatchlist] = useState([]);

    // for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    //get currency from contextAPI
    const { currency, symbol, session } = CryptoState();

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get(CoinList(currency))
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
                console.log("hehe");
            });
        setLoading(false);
    }, [currency]);

    useEffect(() => {
        if (session && data) {
            getWatchlist();
        }
    }, [session, data]);

    // use if statement to hide error
    if (!data) return null;

    const getWatchlist = async () => {
        try {
            setLoading(true);
            const user = supabase.auth.user();
            // const { error2 } = await supabase.from("profiles").upsert([
            //     {
            //         id: user.id,
            //     },
            // ]);
            // if (error2) throw error2;
            let { data, error, status } = await supabase
                .from("profiles")
                .select("watchlist")
                .eq("id", user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }
            if (data) {
                console.log(watchlist);
                if (!watchlist) {
                    setWatchlist(data.watchlist);
                }
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeBox = (val, coin) => {
        if (session) {
            if (val) {
                removeFromWatchlist(coin);
            } else {
                addToWatchlist(coin);
            }
        } else {
            navigate("/signin");
        }
    };

    const addToWatchlist = async (coin) => {
        setWatchlist([...watchlist, coin.name]);
        try {
            const user = supabase.auth.user();
            const { error } = await supabase
                .from("profiles")
                .update({
                    watchlist: watchlist,
                })
                .match({ id: user.id });
            // console.log(user.id);
            if (error) throw error;

            //   setAlert({
            //     open: true,
            //     message: `${coin.name} Added to the Watchlist !`,
            //     type: "success",
            //   });
        } catch (error) {
            //   setAlert({
            //     open: true,
            //     message: error.message,
            //     type: "error",
            //   });
            alert(error.error_description || error.message);
        } finally {
            // getWatchlist();
        }
    };

    const removeFromWatchlist = async (coin) => {
        setWatchlist(watchlist.filter((wish) => wish !== coin.name));
        try {
            const user = supabase.auth.user();
            const { error } = await supabase
                .from("profiles")
                .update({
                    watchlist: watchlist,
                })
                .match({ id: user.id });
            if (error) throw error;

            //   setAlert({
            //     open: true,
            //     message: `${coin.name} Added to the Watchlist !`,
            //     type: "success",
            //   });
        } catch (error) {
            //   setAlert({
            //     open: true,
            //     message: error.message,
            //     type: "error",
            //   });
            alert(error.error_description || error.message);
        } finally {
            // getWatchlist();
        }
    };

    // const removeFromWatchlist = async (coin) => {
    //     try {
    //         const user = supabase.auth.user();
    //         let { data, error, status } = await supabase
    //             .from("profiles")
    //             .select("watchlist")
    //             .eq("id", user.id)
    //             .single();
    //         if (error && status !== 406) {
    //             throw error;
    //         }
    //         const { error2 } = await supabase
    //             .from("profiles")
    //             .update({
    //                 watchlist: data.watchlist.filter(
    //                     (wish) => wish !== coin.name
    //                 ),
    //             })
    //             .match({ id: user.id });

    //         if (error2) throw error2;

    //         //   setAlert({
    //         //     open: true,
    //         //     message: `${coin.name} Added to the Watchlist !`,
    //         //     type: "success",
    //         //   });
    //     } catch (error) {
    //         //   setAlert({
    //         //     open: true,
    //         //     message: error.message,
    //         //     type: "error",
    //         //   });
    //         alert(error.error_description || error.message);
    //     } finally {
    //         getWatchlist();
    //     }
    // };

    const handleSearch = (inputData) => {
        return inputData.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const inWatchlist = (coin) => watchlist.includes(coin.name);

    console.log(watchlist);

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="crypto-prices-all">
                <div className="pricesContainer">
                    <h3>CryptoCurrencies Prices By Market Cap</h3>

                    <TextField
                        label="Search For a Crypto Currency.."
                        variant="outlined"
                        style={{
                            //margin on 4 sides is 30
                            margin: 30,
                            width: "100%",
                            //override left and right margin with "auto" to centralise
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <TableContainer
                        // className="tableContainer"
                        style={{
                            width: "100%",
                        }}
                    >
                        {loading ? (
                            <LinearProgress
                                style={{ backgroundColor: "var(--primary)" }}
                            />
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
                                            }}
                                            align={"right"}
                                        ></TableCell>
                                        <TableCell
                                            sx={{
                                                color: "black",
                                                fontWeight: "700",
                                                fontFamily: "Montserrat",
                                                position: "sticky",
                                                left: 0,
                                                backgroundColor:
                                                    "rgba(0, 255, 242)",
                                            }}
                                            align={"left"}
                                        >
                                            Coin
                                        </TableCell>
                                        {[
                                            "Price",
                                            "24h Change",
                                            "Market Cap",
                                        ].map((head) => (
                                            <TableCell
                                                sx={{
                                                    color: "black",
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat",
                                                }}
                                                key={head}
                                                align={"right"}
                                            >
                                                {head}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        //return us an array of the coins that match the search
                                        handleSearch(
                                            data.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                        ).map((coin) => {
                                            return (
                                                <TableRow
                                                    sx={{
                                                        "&: hover": {
                                                            backgroundColor:
                                                                "#16171a",
                                                        },
                                                    }}
                                                    className="coin-row"
                                                    key={coin.name}
                                                >
                                                    <TableCell align="center">
                                                        <Checkbox
                                                            checked={inWatchlist(
                                                                coin
                                                            )}
                                                            onChange={() =>
                                                                handleChangeBox(
                                                                    inWatchlist(
                                                                        coin
                                                                    ),
                                                                    coin
                                                                )
                                                            }
                                                        ></Checkbox>
                                                    </TableCell>
                                                    <TableCell
                                                        // specify component and scope for semantics
                                                        component="th"
                                                        scope="row"
                                                        sx={{
                                                            display: "flex",
                                                            columnGap: "15px",
                                                            position: "sticky",
                                                            left: 0,
                                                            backgroundColor:
                                                                "#121212",
                                                        }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/coins/${coin.id}`
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={coin?.image}
                                                            alt={coin.name}
                                                            height="50"
                                                            style={{
                                                                marginBottom: 10,
                                                            }}
                                                        />

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    textTransform:
                                                                        "uppercase",
                                                                    fontSize: 22,
                                                                }}
                                                            >
                                                                {coin.symbol}
                                                            </span>

                                                            <span
                                                                style={{
                                                                    color: "darkgrey",
                                                                    fontSize: 13,
                                                                }}
                                                            >
                                                                {coin.name}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell
                                                        align="right"
                                                        onClick={() =>
                                                            navigate(
                                                                `/coins/${coin.id}`
                                                            )
                                                        }
                                                    >
                                                        {symbol}{" "}
                                                        {coin.current_price.toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </TableCell>

                                                    <TableCell
                                                        align="right"
                                                        onClick={() =>
                                                            navigate(
                                                                `/coins/${coin.id}`
                                                            )
                                                        }
                                                    >
                                                        {coin.price_change_percentage_24h <
                                                        0 ? (
                                                            <span className="red">
                                                                {coin.price_change_percentage_24h.toFixed(
                                                                    2
                                                                )}
                                                                %
                                                            </span>
                                                        ) : (
                                                            <span className="green">
                                                                +
                                                                {coin.price_change_percentage_24h.toFixed(
                                                                    2
                                                                )}
                                                                %
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    <TableCell
                                                        align="right"
                                                        onClick={() =>
                                                            navigate(
                                                                `/coins/${coin.id}`
                                                            )
                                                        }
                                                    >
                                                        {symbol}{" "}
                                                        {coin.market_cap
                                                            .toLocaleString()
                                                            .slice(0, -6)}
                                                        M
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={100}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default CoinsTable;
