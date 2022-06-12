import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
    const [currency, setCurrency] = useState("USD");
    const [symbol, setSymbol] = useState("USD");
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currency === "USD") {
            setSymbol("$");
        } else {
            setSymbol("S$");
        }
    }, [currency]);
    //it will cal useeffect when currency change

    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        setLoading(false);
    }, []);

    return (
        <Crypto.Provider
            value={{ currency, symbol, setCurrency, session, loading }}
        >
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
};
