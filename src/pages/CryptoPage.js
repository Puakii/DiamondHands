import React from "react";
import Banner from "../components/CryptoCurrencies/Banner";
import CoinsTable from "../components/CryptoCurrencies/CoinsTable";
import Navbar from "../components/Navbar";

const CryptoPage = () => {
    return (
        <>
            <Navbar />
            <Banner />
            <CoinsTable />
        </>
    );
};

export default CryptoPage;
