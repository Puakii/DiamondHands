import React from "react";
import Banner from "../components/CryptoCurrenciesPage/Banner";
import CoinsTable from "../components/CryptoCurrenciesPage/CoinsTable";
import Navbar from "../components/EntireWebsite/Navbar";
import Footer from "../components/EntireWebsite/Footer";

const CryptoPage = () => {
    return (
        <>
            <Navbar />
            <Banner />
            <CoinsTable />
            <Footer />
        </>
    );
};

export default CryptoPage;
