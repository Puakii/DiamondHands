import React, { useState, useEffect } from "react";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import { CoinList } from "../../config/api";
import { useCryptoState } from "../../context/CryptoContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
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
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import "./CoinsTable.css";

const CoinsTable = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    //default state for search should be "" instead of null .includes will return true for "" but false for null
    const [search, setSearch] = useState("");
    const [watchlist, setWatchlist] = useState([]);

    // for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    //To keep track of number of results after filter to be used for pagination
    const [numOfResult, setNumberOfResult] = useState(0);

    //get from contextAPI
    const { currency, symbol, setCurrency, session } = useCryptoState();

    const navigate = useNavigate();

    function refreshPrices(currency) {
        setLoading(true);
        axios
            .get(CoinList(currency))
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }
    useEffect(() => {
        setLoading(true);
        //first time u get watchlist from supabase
        if (session) {
            getWatchlist();
        }

        refreshPrices(currency);
        setLoading(false);
        const timerId = setInterval(() => refreshPrices(currency), 5000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, [currency, session]);

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
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // use if statement to hide error
    if (!data) return null;

    //value refer to whether it is checked
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
        const newWatchlist = [...watchlist, coin.id];
        try {
            const user = supabase.auth.user();
            const { error } = await supabase
                .from("profiles")
                .update({
                    watchlist: newWatchlist,
                })
                .match({ id: user.id });

            if (error) throw error;
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setWatchlist(newWatchlist);
        }
    };

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
            if (error) throw error;
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

    const inWatchlist = (coin) => watchlist.includes(coin.id);

    return (
        <div className="crypto-prices-all">
            <div className="pricesContainer">
                <div className="with-currency">
                    <h3>CryptoCurrencies Prices By Market Cap</h3>

                    <Select
                        variant="outlined"
                        style={{
                            width: 120,
                            height: 45,
                        }}
                        sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgb(0, 255, 242)",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "rgb(0, 255, 242)",
                            },
                            marginLeft: { xs: "0px", md: "20px" },
                            marginTop: { xs: "20px", md: "0px" },
                        }}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value={"USD"}>USD</MenuItem>
                        <MenuItem value={"SGD"}>SGD</MenuItem>
                    </Select>
                </div>

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
                                    handleSearch(data)
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
                                                        {!inWatchlist(coin) ? (
                                                            <Tooltip title="Add To Watchlist">
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
                                                                    icon={
                                                                        <StarBorderIcon />
                                                                    }
                                                                    checkedIcon={
                                                                        <StarIcon />
                                                                    }
                                                                ></Checkbox>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Remove From Watchlist">
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
                                                                    icon={
                                                                        <StarBorderIcon />
                                                                    }
                                                                    checkedIcon={
                                                                        <StarIcon />
                                                                    }
                                                                ></Checkbox>
                                                            </Tooltip>
                                                        )}
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
                    //we want to set the count to numOfResult after we filtered using search
                    count={numOfResult}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
};

export default CoinsTable;
