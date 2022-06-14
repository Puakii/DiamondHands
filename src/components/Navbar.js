//6.15pm version
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { CryptoState } from "../pages/CryptoContext";
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
} from "@mui/material";
import { Settings, Logout } from "@mui/icons-material";
import { supabase } from "../supabaseClient";

const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    const [navBarAvatar, setNavBarAvatar] = useState(null);
    const { session, username, avatar_url } = CryptoState();
    let navigate = useNavigate();

    //for profile
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleProfileClick = (event) => {
        //currentTarget refer to the element to which the event handler triggered the event
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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

    return (
        <div className="header">
            <div className="container">
                <h1>
                    Crypto<span className="primary">Universe</span>
                </h1>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/cryptocurrencies">Cryptocurrencies</a>
                    </li>
                    <li>
                        <a href="/">Watchlist</a>
                    </li>
                    <li>
                        <a href="/">News</a>
                    </li>
                    <li>
                        <a href="/">Forum</a>
                    </li>
                    {session ? (
                        <div className="btn-group2">
                            <Box
                                sx={{
                                    display: { xs: "none", lg: "block" },
                                }}
                            >
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
                                        >
                                            {username.toUpperCase().charAt(0)}
                                        </Avatar>
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
                                    <MenuItem>
                                        <Avatar /> Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            navigate("/account");
                                        }}
                                    >
                                        <Avatar /> My account
                                    </MenuItem>
                                    <Divider />

                                    <MenuItem>
                                        <ListItemIcon>
                                            <Settings fontSize="small" />
                                        </ListItemIcon>
                                        Settings
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => {
                                            supabase.auth.signOut();
                                            alert(
                                                "You have successfully signed out!"
                                            );
                                            navigate("/home");
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
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
                                    onClick={() => navigate("/account")}
                                >
                                    Profile
                                </button>

                                <button
                                    className="btn"
                                    onClick={() => {
                                        supabase.auth.signOut();
                                        alert(
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

//original beforer push

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { CryptoState } from "../pages/CryptoContext";
// import "./Navbar.css";
// import {
//     Avatar,
//     Box,
//     Divider,
//     IconButton,
//     ListItemIcon,
//     Menu,
//     MenuItem,
//     Tooltip,
// } from "@mui/material";
// import { Settings, Logout } from "@mui/icons-material";
// import { supabase } from "../supabaseClient";

// const Navbar = () => {
//     const [click, setClick] = useState(false);
//     const handleClick = () => setClick(!click);

//     //change here
//     const { session } = CryptoState();
//     let navigate = useNavigate();

//     //for profile
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const open = Boolean(anchorEl);
//     const handleProfileClick = (event) => {
//         //currentTarget refer to the element to which the event handler triggered the event
//         console.log(event.currentTarget);
//         setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     return (
//         <div className="header">
//             <div className="container">
//                 <h1>
//                     Crypto<span className="primary">Universe</span>
//                 </h1>
//                 <ul className={click ? "nav-menu active" : "nav-menu"}>
//                     <li>
//                         <a href="/">Home</a>
//                     </li>
//                     <li>
//                         <a href="/cryptocurrencies">Cryptocurrencies</a>
//                     </li>
//                     <li>
//                         <a href="/">Watchlist</a>
//                     </li>
//                     <li>
//                         <a href="/">News</a>
//                     </li>
//                     <li>
//                         <a href="/">Forum</a>
//                     </li>
//                     {session ? (
//                         <div className="btn-group2">
//                             <Box
//                                 sx={{
//                                     display: { xs: "none", lg: "block" },
//                                 }}
//                             >
//                                 <Tooltip title="Account settings">
//                                     <IconButton
//                                         onClick={handleProfileClick}
//                                         size="small"
//                                         sx={{ ml: 2 }}
//                                         aria-controls={
//                                             open ? "account-menu" : undefined
//                                         }
//                                         aria-haspopup="true"
//                                         aria-expanded={
//                                             open ? "true" : undefined
//                                         }
//                                     >
//                                         <Avatar sx={{ width: 40, height: 40 }}>
//                                             M
//                                         </Avatar>
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Menu
//                                     anchorEl={anchorEl}
//                                     id="account-menu"
//                                     //if open is true, the component is shown
//                                     open={open}
//                                     //i think when u close the menu when calling outside
//                                     onClose={handleClose}
//                                     //close the menu when u click the menu
//                                     onClick={handleClose}
//                                     PaperProps={{
//                                         //specify the amount of elevation
//                                         elevation: 0,
//                                         sx: {
//                                             overflow: "visible",
//                                             //filter for the paper background
//                                             filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//                                             //space between the menu and the iconButton
//                                             mt: 1.5,
//                                             "& .MuiAvatar-root": {
//                                                 width: 32,
//                                                 height: 32,
//                                                 ml: -0.5,
//                                                 mr: 1,
//                                             },

//                                             //add before PaperProps
//                                             "&:before": {
//                                                 content: '""',
//                                                 display: "block",
//                                                 position: "absolute",
//                                                 top: 0,
//                                                 right: 14,
//                                                 width: 10,
//                                                 height: 10,

//                                                 bgcolor: "background.paper",
//                                                 //transform the before thing
//                                                 transform:
//                                                     "translateY(-50%) rotate(45deg)",
//                                                 zIndex: 0,
//                                             },
//                                         },
//                                     }}
//                                     transformOrigin={{
//                                         horizontal: "right",
//                                         vertical: "top",
//                                     }}
//                                     anchorOrigin={{
//                                         horizontal: "right",
//                                         vertical: "bottom",
//                                     }}
//                                 >
//                                     <MenuItem>
//                                         <Avatar /> Profile
//                                     </MenuItem>
//                                     <MenuItem
//                                         onClick={() => {
//                                             navigate("/account");
//                                         }}
//                                     >
//                                         <Avatar /> My account
//                                     </MenuItem>
//                                     <Divider />

//                                     <MenuItem>
//                                         <ListItemIcon>
//                                             <Settings fontSize="small" />
//                                         </ListItemIcon>
//                                         Settings
//                                     </MenuItem>

//                                     <MenuItem
//                                         onClick={() => {
//                                             supabase.auth.signOut();
//                                             alert(
//                                                 "You have successfully signed out!"
//                                             );
//                                             navigate("/home");
//                                         }}
//                                     >
//                                         <ListItemIcon>
//                                             <Logout fontSize="small" />
//                                         </ListItemIcon>
//                                         Logout
//                                     </MenuItem>
//                                 </Menu>
//                             </Box>

//                             <Box
//                                 sx={{
//                                     display: { xs: "block", lg: "none" },
//                                 }}
//                             >
//                                 <button
//                                     className="btn"
//                                     onClick={() => navigate("/account")}
//                                 >
//                                     Profile
//                                 </button>

//                                 <button
//                                     className="btn"
//                                     onClick={() => {
//                                         supabase.auth.signOut();
//                                         alert(
//                                             "You have successfully signed out!"
//                                         );
//                                         navigate("/home");
//                                     }}
//                                 >
//                                     Sign Out
//                                 </button>
//                             </Box>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="btn-group">
//                                 <button
//                                     className="btn"
//                                     onClick={() => navigate("/signin")}
//                                 >
//                                     Login
//                                 </button>

//                                 <button
//                                     className="btn"
//                                     onClick={() => navigate("/signup")}
//                                 >
//                                     Sign Up
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </ul>

//                 <div className="hamburger" onClick={handleClick}>
//                     {click ? (
//                         <FaTimes size={20} style={{ color: "#fff" }} />
//                     ) : (
//                         <FaBars size={20} style={{ color: "#fff" }} />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Navbar;
