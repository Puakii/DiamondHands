import {
    Box,
    Button,
    createTheme,
    MenuItem,
    Modal,
    Select,
    TextField,
    ThemeProvider,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Close,
    AddAlert,
    Clear,
    ChevronRight,
    ChevronLeft,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import { useCryptoState } from "../../context/CryptoContext";
import styled from "@emotion/styled";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { useAlertState } from "../../context/PriceAlertContext";

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const StyledModal = styled(Modal)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

const Alert = ({ coinId, apiData }) => {
    const [price, setPrice] = useState("");

    //for pop up
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //for tab within pop up
    const [addAlert, setAddAlert] = useState(true);

    //to retrieve the alerts from backend
    const [alerts, setAlerts] = useState([]);

    //get from contextAPI
    const { currency, setCurrency, session } = useCryptoState();
    const { usdAlert, sgdAlert } = useAlertState();

    //for choosing higher or lower for price target
    const [equality, setEquality] = useState("higher");

    const handlePriceAlert = async () => {
        if (!session) {
            toast.error("Please sign in to access this feature!");
            return;
        }

        if (price === "") {
            toast.error("Please key in a price target");
            return;
        }

        //parse the string into a float
        const alertPrice = parseFloat(price).toFixed(5);

        if (alertPrice < 0) {
            toast.error("Please key in a valid price target");
            return;
        }

        try {
            const user = supabase.auth.user();

            //no single() as ideally we want them to be able to add multiple alerts => return us a []
            //from the id column, select the data that meet the user_id and coin_id filter

            const { data, error, status } = await supabase
                .from("price_alert")
                .select("id")
                .eq("user_id", user.id)
                .eq("coin_id", coinId)
                .eq("currency", currency);

            if (error && status !== 406) {
                throw error;
            }

            if (data.length >= 5) {
                toast.error(
                    "You can only have up to 5 alerts for this coin in each currency!"
                );
            } else {
                const { error2 } = await supabase.from("price_alert").insert([
                    {
                        user_id: user.id,
                        coin_name: apiData[0].name,
                        coin_id: coinId,
                        currency: currency,
                        equality_sign: equality,
                        price: alertPrice,
                    },
                ]);

                if (error2) throw error2;

                toast.success("Successfully added to your price alert!");
                setPrice("");

                if (equality === "higher") {
                    //we check alerts.length != 0 if not the first alert will have two toast, one from where and one in price alert context when alert become true
                    if (
                        apiData[0].current_price > alertPrice &&
                        alerts.length !== 0
                    ) {
                        toast("You have new price target reached!");
                    }
                } else {
                    if (
                        apiData[0].current_price < alertPrice &&
                        alerts.length !== 0
                    ) {
                        toast("You have new price target reached!");
                    }
                }
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    const removePriceAlert = async (rowId) => {
        //just in case
        if (!session) {
            return;
        }

        try {
            const user = supabase.auth.user();

            const newAlertsArray = alerts.filter((alert) => alert.id !== rowId);

            //no single() as ideally we want them to be able to add multiple alerts => return us a []
            //from the id column, select the data that meet the user_id and coin_id filter

            const { error, status } = await supabase
                .from("price_alert")
                .delete()
                .match({ id: rowId, user_id: user.id });

            if (error && status !== 406) {
                throw error;
            }
            setAlerts(newAlertsArray);
        } catch (error) {
            toast.error(error.error_description || error.message);
        }
    };

    const getPriceAlerts = () => {
        if (currency === "USD") {
            setAlerts(usdAlert);
        } else {
            setAlerts(sgdAlert);
        }
    };

    // use effect for getting alerts
    useEffect(() => {
        getPriceAlerts();
    }, [currency, usdAlert, sgdAlert]);

    // console.log(alerts);
    // console.log("rerender");

    return (
        <>
            <Tooltip title="Add Alert">
                <AddAlert
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                        marginTop: "0.4rem",
                        marginLeft: "1.8rem",
                    }}
                    onClick={handleOpen}
                />
            </Tooltip>
            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    className="container"
                    backgroundColor="whitesmoke"
                    borderRadius="1rem"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    padding="2rem"
                    paddingTop="0"
                    sx={{ height: "450px", width: "400px" }}
                >
                    <Close
                        sx={{
                            color: "black",
                            marginLeft: "100%",
                            marginTop: "2%",
                            height: "1.5rem",
                            width: "1.5rem",
                            "&:hover": {
                                cursor: "pointer",
                            },
                        }}
                        onClick={() => handleClose()}
                    />
                    <Box className="title" display="flex" alignItems="center">
                        <Typography
                            color="black"
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                        >
                            {apiData[0].symbol.toUpperCase()} / {currency}
                        </Typography>

                        <Select
                            variant="outlined"
                            sx={{
                                width: 80,
                                height: 30,

                                "& .MuiSvgIcon-root": {
                                    color: "black",
                                },

                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "black",
                                },

                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "black",
                                },

                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: "black",
                                    },

                                "& .MuiInputBase-input": {
                                    color: "black",
                                },

                                marginLeft: "1rem",
                            }}
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value={"USD"}>USD</MenuItem>
                            <MenuItem value={"SGD"}>SGD</MenuItem>
                        </Select>
                    </Box>
                    <Box
                        className="price-and-change"
                        display="flex"
                        marginTop="1rem"
                    >
                        <Typography
                            color="black"
                            fontFamily="Poppins"
                            variant="h5"
                            fontSize="3rem"
                            fontWeight="400"
                            marginRight="1rem"
                        >
                            {apiData[0].current_price.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </Typography>
                        {apiData[0].price_change_percentage_24h < 0 ? (
                            <span
                                style={{
                                    color: "red",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <FiArrowDown />
                                {apiData[0].price_change_percentage_24h.toFixed(
                                    2
                                )}
                                %
                            </span>
                        ) : (
                            <span
                                style={{
                                    color: "green",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <FiArrowUp />
                                {apiData[0].price_change_percentage_24h.toFixed(
                                    2
                                )}
                                %
                            </span>
                        )}
                    </Box>
                    <Box className="buttons" width="100%" marginTop="2rem">
                        <Button
                            variant="contained"
                            sx={{
                                "&.MuiButton-root": {
                                    width: "50%",
                                    backgroundColor: !addAlert
                                        ? "rgb(0, 255, 242)"
                                        : "transparent",
                                },
                                fontWeight: 700,
                            }}
                            onClick={
                                session
                                    ? () => {
                                          getPriceAlerts();
                                          setAddAlert(false);
                                      }
                                    : () =>
                                          toast.error(
                                              "Please sign in to view your alerts"
                                          )
                            }
                        >
                            View Alerts
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                "&.MuiButton-root": {
                                    width: "50%",
                                    backgroundColor: addAlert
                                        ? "rgb(0, 255, 242)"
                                        : "transparent",
                                },
                                fontWeight: 700,
                            }}
                            onClick={() => setAddAlert(true)}
                        >
                            Set Price Alert
                        </Button>
                    </Box>

                    <Box
                        className="add-or-view-container"
                        width="90%"
                        marginTop="1rem"
                    >
                        {addAlert ? (
                            <Box
                                className="create-alert-wrapper-box"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                            >
                                <ThemeProvider theme={lightTheme}>
                                    <Box
                                        className="enter-price-row"
                                        width="100%"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        {equality === "higher" ? (
                                            <Tooltip title="Higher than">
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        paddingTop: "25px",
                                                        paddingLeft: "0px",
                                                        paddingRight: "0px",
                                                    }}
                                                    onClick={() =>
                                                        setEquality("lower")
                                                    }
                                                >
                                                    <ChevronRight
                                                        sx={{
                                                            width: "2rem",
                                                            height: "2rem",
                                                        }}
                                                    />
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Lower than">
                                                <Button
                                                    variant="text"
                                                    sx={{ paddingTop: "25px" }}
                                                    onClick={() =>
                                                        setEquality("higher")
                                                    }
                                                >
                                                    <ChevronLeft
                                                        sx={{
                                                            width: "2rem",
                                                            height: "2rem",
                                                        }}
                                                    />
                                                </Button>
                                            </Tooltip>
                                        )}

                                        <TextField
                                            type="number"
                                            id="standard-basic"
                                            label="Enter price"
                                            variant="standard"
                                            value={price}
                                            sx={{
                                                width: "100%",
                                                input: { textAlign: "center" },
                                            }}
                                            onChange={(event) =>
                                                setPrice(event.target.value)
                                            }
                                        />
                                    </Box>

                                    <Button
                                        variant="contained"
                                        sx={{
                                            color: "black",
                                            width: "100%",
                                            marginTop: "2rem",
                                            "&.MuiButton-root": {
                                                backgroundColor:
                                                    "rgb(0, 255, 242)",
                                            },
                                        }}
                                        onClick={() => handlePriceAlert()}
                                    >
                                        Create alert
                                    </Button>
                                </ThemeProvider>
                            </Box>
                        ) : (
                            <Box>
                                {alerts.length === 0 ? (
                                    <Typography color="black">
                                        No outstanding alerts!
                                    </Typography>
                                ) : (
                                    <Box className="container-for-alerts">
                                        <Box className="heading" display="flex">
                                            <Typography
                                                color="black"
                                                fontWeight="bold"
                                                sx={{
                                                    marginLeft: "1.4rem",
                                                    marginRight: "7.5rem",
                                                }}
                                            >
                                                Name
                                            </Typography>
                                            <Typography
                                                color="black"
                                                fontWeight="bold"
                                            >
                                                Price
                                            </Typography>
                                        </Box>
                                        {alerts.map((alert) => (
                                            <Box
                                                className="body"
                                                display="flex"
                                                key={alert.id}
                                            >
                                                <Tooltip title="Remove alert">
                                                    <Clear
                                                        sx={{
                                                            color: "black",
                                                            "&:hover": {
                                                                cursor: "pointer",
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            removePriceAlert(
                                                                alert.id
                                                            )
                                                        }
                                                    />
                                                </Tooltip>
                                                <Typography
                                                    color="black"
                                                    sx={{
                                                        width: "50%",
                                                        marginRight: "0.6rem",
                                                    }}
                                                >
                                                    {apiData[0].symbol.toUpperCase()}{" "}
                                                    / {alert.currency}
                                                </Typography>
                                                <Typography
                                                    color="black"
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    {alert.equality_sign ===
                                                    "higher" ? (
                                                        <ChevronRight
                                                            sx={{
                                                                width: "1.3rem",
                                                                height: "1.3rem",
                                                            }}
                                                        />
                                                    ) : (
                                                        <ChevronLeft
                                                            sx={{
                                                                width: "1.3rem",
                                                                height: "1.3rem",
                                                            }}
                                                        />
                                                    )}

                                                    {alert.price}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </StyledModal>
        </>
    );
};

export default Alert;
