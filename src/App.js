import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import CryptoAPI from "./components/CryptoAPI";

function App() {
    return (
        <>
            <Navbar />
            <Hero />
            <CryptoAPI />
            <Footer />
        </>
    );
}

export default App;
