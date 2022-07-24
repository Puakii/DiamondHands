import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useCryptoState } from "../../context/CryptoContext";
import { useAlertState } from "../../context/PriceAlertContext";
import "./Navbar.css";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Tooltip,
    Switch,
    Stack,
    Typography,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Navbar = () => {
    //for the hamburger
    const [click, setClick] = useState(false);
    const handleClick = () => {
        setHideAddButton(!hideAddButton);
        setClick(!click);
    };

    const [navBarAvatar, setNavBarAvatar] = useState(null);
    const { session, avatar_url, hideAddButton, setHideAddButton } =
        useCryptoState();
    const {
        usdPriceReached,
        sgdPriceReached,
        setUsdPriceReached,
        setSgdPriceReached,
        isAlert,
    } = useAlertState();
    let navigate = useNavigate();

    //for profile
    const [anchorEl, setAnchorEl] = useState(null);

    //convert into a boolean
    const open = Boolean(anchorEl);

    const handleProfileClick = (event) => {
        //currentTarget refer to the element to which the event handler triggered the event
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // for alert
    const [alertAnchorEl, setAlertAnchorEl] = useState(null);
    const openAlert = Boolean(alertAnchorEl);

    const handleAlertClick = (event) => {
        //currentTarget refer to the element to which the event handler triggered the event
        if (isAlert) {
            setAlertAnchorEl(event.currentTarget);
        } else {
            toast("There are currently no alert!");
        }
    };
    const handleAlertClose = () => {
        setAlertAnchorEl(null);
    };

    //toggle between currencies, default is sgd
    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    //product is the array of alerts for either usd or sgd, alert is the particular alert
    const removePriceAlert = async (rowId) => {
        //just in case
        if (!session) {
            return;
        }
        try {
            const user = supabase.auth.user();

            //no single() as ideally we want them to be able to add multiple alerts => return us a []
            //from the id column, select the data that meet the user_id and coin_id filter

            const { error, status } = await supabase
                .from("price_alert")
                .delete()
                .match({ id: rowId, user_id: user.id });

            if (error && status !== 406) {
                throw error;
            }
        } catch (error) {
            toast.error(error.error_description || error.message);
        }
    };

    const renderAlertMenu = (product) => {
        const items = product.map((p) => {
            return (
                <MenuItem
                    key={product.id}
                    sx={{
                        width: {
                            xs: "100%",
                            lg: "auto",
                        },
                    }}
                >
                    <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography
                            onClick={() => navigate(`/coins/${p.coin_id}`)}
                            sx={{ fontSize: { xs: 10, tablet: 14, lg: 14 } }}
                        >
                            {p.equality_sign === "higher" ? (
                                <>
                                    {p.coin_name +
                                        " is trading above " +
                                        p.currency +
                                        " " +
                                        p.price +
                                        " now!"}
                                </>
                            ) : (
                                <>
                                    {p.coin_name +
                                        " is trading below " +
                                        p.currency +
                                        " " +
                                        p.price +
                                        " now!"}
                                </>
                            )}
                        </Typography>

                        <Tooltip title="Clear Alert">
                            <IconButton onClick={() => removePriceAlert(p.id)}>
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </MenuItem>
            );
        });
        return [items];
    };
    //for downloading avatar image
    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage
                .from("avatars")
                .download(path);
            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            setNavBarAvatar(url);
        } catch (error) {
            console.log("Error downloading image: ", error.message);
        }
    };

    useEffect(() => {
        if (avatar_url) downloadImage(avatar_url);
    }, [avatar_url]);

    useEffect(() => {
        if (!isAlert) {
            setAlertAnchorEl(null);
        }
    }, [isAlert]);

    return (
        <div className="header">
            <div className="container">
                <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    Crypto<span className="primary">Universe</span>
                </h1>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    {/* Note: anchortag will not maintain the contextAPI - our currency state will reset if we use anchortag */}
                    <li
                        onClick={() => navigate("/home")}
                        style={{ cursor: "pointer" }}
                    >
                        Home
                    </li>
                    <li
                        onClick={() => navigate("/cryptocurrencies")}
                        style={{ cursor: "pointer" }}
                    >
                        Cryptocurrencies
                    </li>
                    <li
                        onClick={() => navigate("/watchlist")}
                        style={{ cursor: "pointer" }}
                    >
                        Watchlist
                    </li>
                    <li
                        onClick={() => navigate("/news")}
                        style={{ cursor: "pointer" }}
                    >
                        News
                    </li>
                    <li
                        onClick={() => navigate("/forum")}
                        style={{ cursor: "pointer" }}
                    >
                        Forum
                    </li>
                    {session ? (
                        <div className="btn-group2">
                            <Box
                                sx={{
                                    display: { xs: "none", lg: "block" },
                                }}
                            >
                                <Tooltip title="Alerts">
                                    <IconButton
                                        onClick={handleAlertClick}
                                        size="small"
                                        aria-controls={
                                            !isAlert
                                                ? undefined
                                                : openAlert
                                                ? "alert-menu"
                                                : undefined
                                        }
                                        aria-haspopup={isAlert}
                                        aria-expanded={
                                            !isAlert
                                                ? undefined
                                                : openAlert
                                                ? "true"
                                                : undefined
                                        }
                                    >
                                        {isAlert ? (
                                            <NotificationsActiveIcon />
                                        ) : (
                                            <NotificationsNoneIcon />
                                        )}
                                    </IconButton>
                                </Tooltip>
                                {isAlert ? (
                                    <Menu
                                        anchorEl={alertAnchorEl}
                                        id="alert-menu"
                                        //if open is true, the component is shown
                                        open={openAlert}
                                        //i think when u close the menu when calling outside
                                        onClose={handleAlertClose}
                                        //close the menu when u click the menu
                                        // onClick={handleAlertClose}
                                        PaperProps={{
                                            //specify the amount of elevation
                                            elevation: 0,

                                            sx: {
                                                maxHeight: {
                                                    xs: "35%",
                                                    tablet: "50%",
                                                    lg: "30%",
                                                },
                                                width: {
                                                    xs: "100%",
                                                    lg: "30%",
                                                },
                                                overflowY: "scroll",

                                                //filter for the paper background
                                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                                //space between the menu and the iconButton
                                                mt: 1.5,

                                                //add before PaperProps
                                                "&:before": {
                                                    content: '""',
                                                    display: "block",
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,

                                                    bgcolor: "background.paper",
                                                    //transform the before thing
                                                    transform:
                                                        "translateY(-50%) rotate(45deg)",
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{
                                            horizontal: "right",
                                            vertical: "top",
                                        }}
                                        anchorOrigin={{
                                            horizontal: "right",
                                            vertical: "bottom",
                                        }}
                                    >
                                        <MenuItem>
                                            <Box
                                                className="toggle-switch-container"
                                                width="100%"
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Tooltip title="Close">
                                                    <IconButton
                                                        onClick={
                                                            handleAlertClose
                                                        }
                                                    >
                                                        <ArrowBackIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    justifyContent="right"
                                                    marginRight="20px"
                                                >
                                                    USD
                                                    <Switch
                                                        checked={checked}
                                                        onChange={handleChange}
                                                        inputProps={{
                                                            "aria-label":
                                                                "controlled",
                                                        }}
                                                    />
                                                    SGD
                                                </Stack>
                                            </Box>
                                        </MenuItem>

                                        {checked
                                            ? renderAlertMenu(sgdPriceReached)
                                            : renderAlertMenu(usdPriceReached)}
                                    </Menu>
                                ) : (
                                    <></>
                                )}

                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleProfileClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={
                                            open ? "account-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                            open ? "true" : undefined
                                        }
                                    >
                                        <Avatar
                                            sx={{ width: 40, height: 40 }}
                                            alt={"avatar"}
                                            src={navBarAvatar}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    //if open is true, the component is shown
                                    open={open}
                                    //i think when u close the menu when calling outside
                                    onClose={handleClose}
                                    //close the menu when u click the menu
                                    onClick={handleClose}
                                    PaperProps={{
                                        //specify the amount of elevation
                                        elevation: 0,
                                        sx: {
                                            overflow: "visible",
                                            //filter for the paper background
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                            //space between the menu and the iconButton
                                            mt: 1.5,
                                            "& .MuiAvatar-root": {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },

                                            //add before PaperProps
                                            "&:before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,

                                                bgcolor: "background.paper",
                                                //transform the before thing
                                                transform:
                                                    "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                    }}
                                    anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            navigate("/account");
                                        }}
                                    >
                                        <Avatar
                                            alt={"avatar"}
                                            src={navBarAvatar}
                                        />
                                        Profile
                                    </MenuItem>
                                    <Divider />

                                    <MenuItem
                                        onClick={() => {
                                            supabase.auth.signOut();
                                            toast.success(
                                                "You have successfully signed out!"
                                            );
                                            navigate("/home");
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Sign Out
                                    </MenuItem>
                                </Menu>
                            </Box>

                            <Box
                                sx={{
                                    display: { xs: "block", lg: "none" },
                                }}
                            >
                                <button
                                    className="btn"
                                    onClick={handleAlertClick}
                                >
                                    Alerts
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => navigate("/account")}
                                >
                                    Profile
                                </button>

                                <button
                                    className="btn"
                                    onClick={() => {
                                        supabase.auth.signOut();

                                        toast.success(
                                            "You have successfully signed out!"
                                        );
                                        navigate("/home");
                                    }}
                                >
                                    Sign Out
                                </button>
                            </Box>
                        </div>
                    ) : (
                        <>
                            <div className="btn-group">
                                <button
                                    className="btn"
                                    onClick={() => navigate("/signin")}
                                >
                                    Login
                                </button>

                                <button
                                    className="btn"
                                    onClick={() => navigate("/signup")}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </>
                    )}
                </ul>

                <div className="hamburger" onClick={handleClick}>
                    {click ? (
                        <FaTimes size={20} style={{ color: "#fff" }} />
                    ) : (
                        <FaBars size={20} style={{ color: "#fff" }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
