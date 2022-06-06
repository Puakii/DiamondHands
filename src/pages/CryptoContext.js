import React, { createContext, useContext, useEffect, useState } from "react";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
    const [currency, setCurrency] = useState("USD");
    const [symbol, setSymbol] = useState("USD");

    useEffect(() => {
        if (currency === "USD") {
            setSymbol("$");
        } else {
            setSymbol("S$");
        }
    }, [currency]);
    //it will cal useeffect when currency change

    return (
        <Crypto.Provider value={{ currency, symbol, setCurrency }}>
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
};
