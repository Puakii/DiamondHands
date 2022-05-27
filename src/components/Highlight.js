import React from "react";
import "./Highlight.css";
import Crypto from "../assets/crypto.png";
import { useNavigate } from "react-router-dom";

const Highlight = () => {
    let navigate = useNavigate();
    return (
        <div className="hero">
            <div className="container">
                {/* left side */}
                <div className="left">
                    <h1>A Brand New Crypto Experience</h1>
                    <h2>
                        Find the{" "}
                        <span className="colorChange">best prices</span> for
                        your crypto
                    </h2>
                    <p>
                        See the prices of 250+ cryptocurrencies from all major
                        crypto exchanges
                    </p>
                    <div className="input-container">
                        <button
                            className="btn"
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* right side */}
                <div className="right">
                    <div className="img-container">
                        <img src={Crypto} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Highlight;
