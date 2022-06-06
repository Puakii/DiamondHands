import React from "react";
import CryptoNavbar from "../components/CryptoCurrencies/CryptoNavbar";
import Banner from "../components/CryptoCurrencies/Banner";
import CoinsTable from "../components/CryptoCurrencies/CoinsTable";

const CryptoPage = () => {
    return (
        <>
            {/* <CryptoNavbar /> */}
            <Banner />
            <CoinsTable />
        </>
    );
};

export default CryptoPage;
