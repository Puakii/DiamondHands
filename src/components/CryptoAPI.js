import React from "react";
import "./CryptoAPI.css";
import { FiArrowUpRight, FiArrowDown } from "react-icons/fi";

const CryptoAPI = () => {
    return (
        <div className="CryptoAPI">
            <div className="container">
                {/* left */}
                <div className="left">
                    <h2>Check Out Latest Prices Of Cryptocurrencies Here</h2>
                    <button className="btn">Explore More Coins</button>
                </div>

                {/* right */}
                <div className="right">
                    <div className="top"></div>

                    <div>
                        <h5>Bitcoin</h5>
                        <p>$49, 000</p>
                    </div>
                    <div>FiArrowUpRight</div>
                </div>
            </div>
        </div>
    );
};

export default CryptoAPI;
