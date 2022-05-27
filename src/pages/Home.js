import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CryptoAPI from "../components/CryptoAPI";
import Highlight from "../components/Highlight";

const Home = () => {
    return (
        <>
            <Navbar />
            <Highlight />
            <CryptoAPI />
            <Footer />
        </>
    );
};

export default Home;
