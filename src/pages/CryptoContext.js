import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const Crypto = createContext();

const getCurrency = () => {
    const items = JSON.parse(localStorage.getItem("currency"));
    if (items) {
        return items;
    } else {
        return "USD";
    }
};

const CryptoContext = ({ children }) => {
    //for currency selection button
    const [currency, setCurrency] = useState(getCurrency());
    const [symbol, setSymbol] = useState("USD");

    //for keeping track if someone is logged in
    const [session, setSession] = useState(null);

    //for keeping track if an account is done being authenticated
    const [loading, setLoading] = useState(true);

    //for keeping track if a profile is done being retrieved
    const [profileLoading, setProfileLoading] = useState(false);

    //for tracking of the information of the account being signed in
    const [username, setUsername] = useState("");
    const [website, setWebsite] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);

    //for tracking if the multicurrency page should display graph or market info
    //true for graph false for market
    const [graphOrMarket, setGraphOrMarket] = useState(true);

    //getProfile function declaration

    const getProfile = async () => {
        try {
            setProfileLoading(true);
            const user = supabase.auth.user();
            const { error2 } = await supabase.from("profiles").upsert(
                [
                    {
                        id: user.id,
                        username: user.email,
                    },
                ],
                { ignoreDuplicates: true }
            );
            if (error2) throw error2;
            let { data, error, status } = await supabase
                .from("profiles")
                .select("username, website, avatar_url")
                .eq("id", user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }
            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setProfileLoading(false);
        }
    };

    //use effect for currency selection button, will be triggered when currency changes
    useEffect(() => {
        localStorage.setItem("currency", JSON.stringify(currency));
        if (currency === "USD") {
            setSymbol("$");
        } else {
            setSymbol("S$");
        }
    }, [currency]);

    // use effect for user authentication

    useEffect(() => {
        setSession(supabase.auth.session());

        setTimeout(() => setLoading(false), 500);

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });
    }, []);

    // use effect for getting profile
    useEffect(() => {
        if (session) {
            getProfile();
        } else {
            setUsername("");
            setWebsite(null);
            setAvatarUrl(null);
        }
    }, [session]);

    return (
        <Crypto.Provider
            value={{
                currency,
                symbol,
                setCurrency,
                session,
                loading,
                username,
                setUsername,
                website,
                setWebsite,
                avatar_url,
                setAvatarUrl,
                profileLoading,
                setProfileLoading,
                graphOrMarket,
                setGraphOrMarket,
            }}
        >
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;

export const useCryptoState = () => {
    return useContext(Crypto);
};
