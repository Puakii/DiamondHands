import React from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="col col-1">
          <h1>
            Crypto<span className="primary">Universe</span>
          </h1>
        </div>
        <div className="col">
          <h5>About Us</h5>
          <span className="bar"></span>
          <a href="/">About</a>
          <a href="/">Contact Us</a>
          <a href="/">Legal</a>
          <a href="/">Privacy</a>
        </div>
        <div className="col">
          <h5>Creators</h5>
          <span className="bar"> </span>
          <a href="/">Yi Teng</a>
          <a href="/">Desmond</a>
        </div>
        <div className="col">
          <h5>Follow Us</h5>
          <span className="bar"> </span>
          <a href="/">
            <FaFacebook className="icon" />
            Facebook
          </a>
          <a href="/">
            <FaTwitter className="icon" />
            Twitter
          </a>
          <a href="/">
            <FaLinkedin className="icon" />
            LinkedIn
          </a>
          <a href="/">
            <FaGithub className="icon" />
            Github
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
