import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import {
    Button,
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

import { useCryptoState } from "../../context/CryptoContext";

const MultiMarketTable = ({ tableData, numOfResult, loadingData }) => {
    // for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //use context api to keep track of what to display
    const { setGraphOrMarket } = useCryptoState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                    variant="outlined"
                    sx={{ marginRight: "1%" }}
                    onClick={() => setGraphOrMarket(true)}
                >
                    Overview
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        "&.MuiButton-root": {
                            backgroundColor: "rgb(0, 255, 242)",
                        },
                        fontWeight: 700,
                    }}
                >
                    Market
                </Button>
            </Box>
            <TableContainer
                sx={{
                    marginTop: "3%",
                    width: "85%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                {loadingData || tableData === null ? (
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
                                    "Price (In USD)",
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
                            {tableData
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

export default MultiMarketTable;
