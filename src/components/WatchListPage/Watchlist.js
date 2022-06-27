import React, { useState, useEffect } from "react";
import axios from "axios";
import { CoinList } from "../../config/api";
import { CryptoState } from "../../pages/CryptoContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
    Box,
    IconButton,
    LinearProgress,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
    //To keep track of number of results after filter to be used for pagination
    const [numOfResult, setNumberOfResult] = useState(0);

    const { currency, symbol, session, setCurrency } = CryptoState();

    const navigate = useNavigate();

    const getWatchlist = async () => {
        try {
            setLoading(true);
            const user = supabase.auth.user();

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
            } else {
                const { error2 } = await supabase.from("profiles").upsert([
                    {
                        id: user.id,
                        website: user.email,
                    },
                ]);
                if (error2) throw error2;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    function refreshPrices(currency) {
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
    }
    useEffect(() => {
        refreshPrices(currency);
        if (session) {
            getWatchlist();
        }

        const timerId = setInterval(() => refreshPrices(currency), 5000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, [currency, session]);

    //no need this anymore
    // useEffect(() => {}, [watchlist]);

    if (!coins) return null;

    const removeFromWatchlist = async (coin) => {
        const newWatchlist = watchlist.filter((wish) => wish !== coin.id);
        try {
            const user = supabase.auth.user();
            const { error } = await supabase
                .from("profiles")
                .update({
                    watchlist: newWatchlist,
                })
                .match({ id: user.id });
            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setWatchlist(newWatchlist);
        }
    };

    const handleSearch = (inputData) => {
        const filteredData = inputData.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
        );

        //if condition is required if not will result in continous rendering because it will keep setting number of result, we only want to setNumberOfResult when there is something being filtered, and after filtered we want it to stop
        if (numOfResult !== filteredData.length) {
            setNumberOfResult(filteredData.length);
        }

        return filteredData;
    };

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
        setPage(0);
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

    return session ? (
        <div className="crypto-prices-all">
            <div className="pricesContainer">
                <Box
                    className="with-currency-change"
                    justifyContent="center"
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", tablet: "row" },
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <h3>Your Watchlist</h3>
                    <Select
                        variant="outlined"
                        style={{
                            width: 110,
                            height: 40,
                        }}
                        sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgb(0, 255, 242)",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "rgb(0, 255, 242)",
                            },
                            marginLeft: {
                                xs: "12px",
                                tablet: "20px",
                                md: "20px",
                            },
                            marginTop: {
                                xs: "12px",
                                tablet: "0px",
                            },
                        }}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value={"USD"}>USD</MenuItem>
                        <MenuItem value={"SGD"}>SGD</MenuItem>
                    </Select>
                </Box>
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
                    onChange={handleChangeSearch}
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
                                    {["Price", "24h Change", "Market Cap"].map(
                                        (head) => (
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
                                        )
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    //return us an array of the coins that match the search
                                    handleSearch(
                                        coins.filter((wish) =>
                                            watchlist.includes(wish.id)
                                        )
                                    )
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((coin) => {
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
                                                        <Tooltip title="Remove From Watchlist">
                                                            <IconButton
                                                                onClick={() =>
                                                                    removeFromWatchlist(
                                                                        coin
                                                                    )
                                                                }
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
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
                                                            backgroundColor: {
                                                                xs: "#121212",
                                                                lg: "transparent",
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/coins/${coin.id}`
                                                            )
                                                        }
                                                    >
                                                        <Tooltip
                                                            title="View coin"
                                                            placement="bottom"
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
                                                        </Tooltip>

                                                        <Tooltip
                                                            title="View coin"
                                                            placement="bottom"
                                                        >
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
                                                        </Tooltip>
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
                    count={numOfResult}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    ) : (
        <></>
    );
};

export default Watchlist;
