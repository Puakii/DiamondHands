import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./CryptoNavbar.css";
import { MenuItem, Select, ThemeProvider, createTheme } from "@mui/material";
import { CryptoState } from "../../pages/CryptoContext";

const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#fff",
        },

        mode: "dark",
    },
});

const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    //use the setCurrency from contextAPI to change
    const { currency, setCurrency } = CryptoState();

    let navigate = useNavigate();

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="crypto-header">
                <div className="container">
                    <h1>
                        Crypto<span className="primary">Universe</span>
                    </h1>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/">Cryptocurrencies</a>
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
                    </ul>

                    <Select
                        variant="outlined"
                        style={{
                            width: 100,
                            height: 40,
                            marginLeft: 0,
                        }}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value={"USD"}>USD</MenuItem>
                        <MenuItem value={"SGD"}>SGD</MenuItem>
                    </Select>

                    <div className="btn-group">
                        <button
                            className="btn"
                            onClick={() => navigate("/signin")}
                        >
                            Profile
                        </button>
                    </div>

                    <div className="hamburger" onClick={handleClick}>
                        {click ? (
                            <FaTimes size={20} style={{ color: "#fff" }} />
                        ) : (
                            <FaBars size={20} style={{ color: "#fff" }} />
                        )}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Navbar;
