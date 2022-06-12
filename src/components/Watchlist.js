import React, { useState, useEffect } from "react";
import axios from "axios";
import { CoinList } from "../config/api";
import { CryptoState } from "../pages/CryptoContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
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

const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#fff",
        },

        mode: "dark",
    },
});

const Watchlist = () => {
    const [coins, setCoins] = useState(null);
    const [loading, setLoading] = useState(false);
    //default state for search should be "" instead of null .includes will
    //return true for "" but false for null
    const [search, setSearch] = useState("");
    const [watchlist, setWatchlist] = useState([]);

    // for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { currency, symbol, session } = CryptoState();

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get(CoinList(currency))
            .then((response) => {
                setCoins(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }, [currency]);

    useEffect(() => {
        if (session && coins) {
            getWatchlist();
        }
    }, [session, coins]);

    if (!coins) return null;

    console.log(coins);

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
                setWatchlist(data.watchlist);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

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

    if (!session) {
        navigate("/signin");
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="crypto-prices-all">
                <div className="pricesContainer">
                    <h3>Your Watchlist</h3>

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
                                            coins.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                        ).map((coin) => {
                                            if (watchlist.includes(coin.id)) {
                                                return (
                                                    <TableRow
                                                        sx={{
                                                            "&: hover": {
                                                                backgroundColor:
                                                                    "#16171a",
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/coins/${coin.id}`
                                                            )
                                                        }
                                                        className="coin-row"
                                                        key={coin.name}
                                                    >
                                                        <TableCell
                                                            // specify component and scope for semantics
                                                            component="th"
                                                            scope="row"
                                                            sx={{
                                                                display: "flex",
                                                                columnGap:
                                                                    "15px",
                                                                position:
                                                                    "sticky",
                                                                left: 0,
                                                                backgroundColor:
                                                                    "#121212",
                                                            }}
                                                        >
                                                            <img
                                                                src={
                                                                    coin?.image
                                                                }
                                                                alt={coin.name}
                                                                height="50"
                                                                style={{
                                                                    marginBottom: 10,
                                                                }}
                                                            />

                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
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
                                                                    {
                                                                        coin.symbol
                                                                    }
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

                                                        <TableCell align="right">
                                                            {symbol}{" "}
                                                            {coin.current_price.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </TableCell>

                                                        <TableCell align="right">
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

                                                        <TableCell align="right">
                                                            {symbol}{" "}
                                                            {coin.market_cap
                                                                .toLocaleString()
                                                                .slice(0, -6)}
                                                            M
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            } else {
                                                return <></>;
                                            }
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

export default Watchlist;