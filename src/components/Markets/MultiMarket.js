import React, { useState, useEffect } from "react";
import axios from "axios";
import { MultiMarketCoins } from "../../config/api";
import Navbar from "../Navbar";
import { v4 as uuid } from "uuid";
import {
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import CoinSummary from "./CoinSummary";

const MultiMarket = () => {
    const [data, setData] = useState(null);
    const [loadingData, setLoading] = useState(true);

    //for best market to buy and sell
    const [bestToBuy, setBestToBuy] = useState([]);
    const [bestToSell, setBestToSell] = useState([]);

    // for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    //keep track of number of results returned by API call
    const [numOfResult, setNumberOfResult] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(MultiMarketCoins("ethereum"))
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
    }, []);

    if (!loadingData && data !== null) {
        // console.log(data);
        // console.log(bestToBuy);
        // console.log(bestToSell);
    }

    return (
        <Box>
            <Navbar />
            <CoinSummary
                coinId={"ethereum"}
                bestToBuy={bestToBuy}
                bestToSell={bestToSell}
            />
            <TableContainer
                sx={{
                    marginTop: "3%",
                    width: "85%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                {loadingData || data === null ? (
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
                                        backgroundColor: "rgba(0, 255, 242)",
                                    }}
                                    align={"left"}
                                >
                                    Source
                                </TableCell>
                                {[
                                    "Price",
                                    "Pairs",
                                    "+2% Depth",
                                    "-2% Depth",
                                    "Volume",
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
                            {data
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((perMarket) => {
                                    return (
                                        <TableRow key={uuid()}>
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
                                                <Box
                                                    display={"flex"}
                                                    alignItems="center"
                                                >
                                                    <img
                                                        style={{
                                                            paddingRight: "10%",
                                                        }}
                                                        src={
                                                            perMarket.market
                                                                .logo
                                                        }
                                                        alt={
                                                            perMarket.market
                                                                .name
                                                        }
                                                    />
                                                    {perMarket.market.name.toUpperCase()}
                                                </Box>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat",
                                                }}
                                                align={"right"}
                                            >
                                                {"$"}{" "}
                                                {perMarket.converted_last.usd.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat",
                                                }}
                                                align={"right"}
                                            >
                                                {perMarket.base}
                                                {" /"}
                                                {perMarket.target}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat",
                                                }}
                                                align={"right"}
                                            >
                                                {"$"}{" "}
                                                {perMarket.cost_to_move_up_usd.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat",
                                                }}
                                                align={"right"}
                                            >
                                                {"$"}{" "}
                                                {perMarket.cost_to_move_down_usd.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat",
                                                }}
                                                align={"right"}
                                            >
                                                {"$"}{" "}
                                                {perMarket.converted_volume.usd.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    }
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
        </Box>
    );
};

export default MultiMarket;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { MultiMarketCoins } from "../../config/api";
// import Navbar from "../Navbar";
// import { v4 as uuid } from "uuid";
// import {
//     LinearProgress,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TablePagination,
//     TableRow,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import CoinSummary from "./CoinSummary";

// const MultiMarket = () => {
//     const [data, setData] = useState(null);
//     const [loadingData, setLoading] = useState(true);

//     //for best market to buy and sell
//     const [bestToBuy, setBestToBuy] = useState([]);
//     const [bestToSell, setBestToSell] = useState([]);

//     // for pagination
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     //keep track of number of results returned by API call
//     const [numOfResult, setNumberOfResult] = useState(0);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     useEffect(() => {
//         setLoading(true);
//         axios
//             .get(MultiMarketCoins("bitcoin"))
//             .then((response) => {
//                 setData(response.data.tickers);
//                 setNumberOfResult(response.data.tickers.length);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//         setLoading(false);

//         if (data !== null) {
//             console.log(data);
//         }
//     }, []);

//     // if (!loadingData && data !== null) {
//     //     console.log(data);
//     // }

//     return (
//         <Box sx={{ width: "85%", marginLeft: "auto", marginRight: "auto" }}>
//             <Navbar />
//             <CoinSummary coinId={"bitcoin"} />
//             <TableContainer
//                 sx={{
//                     marginTop: "20%",
//                 }}
//             >
//                 {loadingData || data === null ? (
//                     <LinearProgress
//                         style={{ backgroundColor: "var(--primary)" }}
//                     />
//                 ) : (
//                     <Table>
//                         <TableHead
//                             style={{
//                                 backgroundColor: "var(--primary)",
//                             }}
//                         >
//                             <TableRow>
//                                 <TableCell
//                                     sx={{
//                                         color: "black",
//                                         fontWeight: "700",
//                                         fontFamily: "Montserrat",
//                                         position: "sticky",
//                                         left: 0,
//                                         backgroundColor: "rgba(0, 255, 242)",
//                                     }}
//                                     align={"left"}
//                                 >
//                                     Source
//                                 </TableCell>
//                                 {[
//                                     "Price",
//                                     "Pairs",
//                                     "+2% Depth",
//                                     "-2% Depth",
//                                     "Volume",
//                                 ].map((head) => (
//                                     <TableCell
//                                         sx={{
//                                             color: "black",
//                                             fontWeight: "700",
//                                             fontFamily: "Montserrat",
//                                         }}
//                                         key={head}
//                                         align={"right"}
//                                     >
//                                         {head}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {data
//                                 .slice(
//                                     page * rowsPerPage,
//                                     page * rowsPerPage + rowsPerPage
//                                 )
//                                 .map((perMarket) => {
//                                     return (
//                                         <TableRow key={uuid()}>
//                                             <TableCell
//                                                 // specify component and scope for semantics
//                                                 component="th"
//                                                 scope="row"
//                                                 sx={{
//                                                     display: "flex",
//                                                     columnGap: "15px",
//                                                     position: "sticky",
//                                                     left: 0,
//                                                     backgroundColor: "#121212",
//                                                 }}
//                                             >
//                                                 <Box
//                                                     display={"flex"}
//                                                     alignItems="center"
//                                                 >
//                                                     <img
//                                                         style={{
//                                                             paddingRight: "10%",
//                                                         }}
//                                                         src={
//                                                             perMarket.market
//                                                                 .logo
//                                                         }
//                                                         alt={
//                                                             perMarket.market
//                                                                 .name
//                                                         }
//                                                     />
//                                                     {perMarket.market.name.toUpperCase()}
//                                                 </Box>
//                                             </TableCell>
//                                             <TableCell
//                                                 sx={{
//                                                     fontWeight: "700",
//                                                     fontFamily: "Montserrat",
//                                                 }}
//                                                 align={"right"}
//                                             >
//                                                 {"$"}{" "}
//                                                 {perMarket.converted_last.usd.toLocaleString(
//                                                     undefined,
//                                                     {
//                                                         minimumFractionDigits: 2,
//                                                         maximumFractionDigits: 2,
//                                                     }
//                                                 )}
//                                             </TableCell>
//                                             <TableCell
//                                                 sx={{
//                                                     fontWeight: "700",
//                                                     fontFamily: "Montserrat",
//                                                 }}
//                                                 align={"right"}
//                                             >
//                                                 {perMarket.base}
//                                                 {" /"}
//                                                 {perMarket.target}
//                                             </TableCell>

//                                             <TableCell
//                                                 sx={{
//                                                     fontWeight: "700",
//                                                     fontFamily: "Montserrat",
//                                                 }}
//                                                 align={"right"}
//                                             >
//                                                 {"$"}{" "}
//                                                 {perMarket.cost_to_move_up_usd.toLocaleString(
//                                                     undefined,
//                                                     {
//                                                         minimumFractionDigits: 2,
//                                                         maximumFractionDigits: 2,
//                                                     }
//                                                 )}
//                                             </TableCell>
//                                             <TableCell
//                                                 sx={{
//                                                     fontWeight: "700",
//                                                     fontFamily: "Montserrat",
//                                                 }}
//                                                 align={"right"}
//                                             >
//                                                 {"$"}{" "}
//                                                 {perMarket.cost_to_move_down_usd.toLocaleString(
//                                                     undefined,
//                                                     {
//                                                         minimumFractionDigits: 2,
//                                                         maximumFractionDigits: 2,
//                                                     }
//                                                 )}
//                                             </TableCell>
//                                             <TableCell
//                                                 sx={{
//                                                     fontWeight: "700",
//                                                     fontFamily: "Montserrat",
//                                                 }}
//                                                 align={"right"}
//                                             >
//                                                 {"$"}{" "}
//                                                 {perMarket.converted_volume.usd.toLocaleString(
//                                                     undefined,
//                                                     {
//                                                         minimumFractionDigits: 0,
//                                                         maximumFractionDigits: 0,
//                                                     }
//                                                 )}
//                                             </TableCell>
//                                         </TableRow>
//                                     );
//                                 })}
//                         </TableBody>
//                     </Table>
//                 )}
//             </TableContainer>
//             <TablePagination
//                 component="div"
//                 count={numOfResult}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//         </Box>
//     );
// };

// export default MultiMarket;
