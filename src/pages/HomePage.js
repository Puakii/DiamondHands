import React from "react";
import Navbar from "../components/EntireWebsite/Navbar";
import Footer from "../components/EntireWebsite/Footer";
import CryptoAPI from "../components/HomePage/CryptoAPI";
import Highlight from "../components/HomePage/Highlight";
import { Box } from "@mui/material";

const HomePage = () => {
    return (
        <>
            <Navbar />
            <Highlight />
            <CryptoAPI />
            <Footer />
        </>
    );
};

export default HomePage;
