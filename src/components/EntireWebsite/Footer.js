import React from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="col-1">
                    <h1>
                        Crypto<span className="primary">Universe</span>
                    </h1>
                </div>
                <div className="col">
                    <h5>About Us</h5>
                    <span className="bar"></span>
                    <a
                        href="https://github.com/Puakii/DiamondHands"
                        data-testid="testing"
                    >
                        About
                    </a>
                    <a href="https://github.com/Puakii/DiamondHands">
                        Contact Us
                    </a>
                    <a href="https://github.com/Puakii/DiamondHands">Legal</a>
                    <a href="https://github.com/Puakii/DiamondHands">Privacy</a>
                </div>
                <div className="col">
                    <h5>Creators</h5>
                    <span className="bar"> </span>
                    <a href="https://github.com/Puakii">Yi Teng</a>
                    <a href="https://github.com/desmondyst">Desmond</a>
                </div>
                <div className="col">
                    <h5>Follow Us</h5>
                    <span className="bar"> </span>
                    <a href="https://github.com/Puakii/DiamondHands">
                        <FaFacebook className="icon" />
                        Facebook
                    </a>
                    <a href="https://github.com/Puakii/DiamondHands">
                        <FaTwitter className="icon" />
                        Twitter
                    </a>
                    <a href="https://github.com/Puakii/DiamondHands">
                        <FaLinkedin className="icon" />
                        LinkedIn
                    </a>
                    <a href="https://github.com/Puakii/DiamondHands">
                        <FaGithub className="icon" />
                        Github
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
