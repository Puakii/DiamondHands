import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { CryptoState } from "../pages/CryptoContext";
import "./Navbar.css";

const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const { session } = CryptoState();
    let navigate = useNavigate();

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
                        <a href="/watchlist">Watchlist</a>
                    </li>
                    <li>
                        <a href="/">News</a>
                    </li>
                    <li>
                        <a href="/">Forum</a>
                    </li>
                    {session ? (
                        <div className="btn-group2">
                            <button
                                className="btn"
                                onClick={() => navigate("/account")}
                            >
                                Profile
                            </button>
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
                            </div>

                            <div className="btn-group">
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
