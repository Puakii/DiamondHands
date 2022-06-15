// 6.11pm version
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
    //for currency selection button
    const [currency, setCurrency] = useState("USD");
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

    //getProfile function declaration
    const getProfile = async () => {
        try {
            setProfileLoading(true);
            const user = supabase.auth.user();
            const { error2 } = await supabase.from("profiles").upsert([
                {
                    id: user.id,
                },
            ]);
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
            alert(error.message);
        } finally {
            setProfileLoading(false);
        }
    };

    //use effect for currency selection button, will be triggered when currency changes
    useEffect(() => {
        if (currency === "USD") {
            setSymbol("$");
        } else {
            setSymbol("S$");
        }
    }, [currency]);

    //use effect for user authentication
    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        setLoading(false);
    }, []);

    // use effect for getting profile
    useEffect(() => {
        if (session) {
            getProfile();
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
            }}
        >
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
};

//ORIGINAL BEFORE PUSH
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// const Crypto = createContext();

// const CryptoContext = ({ children }) => {
//     const [currency, setCurrency] = useState("USD");
//     const [symbol, setSymbol] = useState("USD");
//     const [session, setSession] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (currency === "USD") {
//             setSymbol("$");
//         } else {
//             setSymbol("S$");
//         }
//     }, [currency]);
//     //it will cal useeffect when currency change

//     useEffect(() => {
//         setSession(supabase.auth.session());

//         supabase.auth.onAuthStateChange((_event, session) => {
//             setSession(session);
//         });
//         setLoading(false);
//     }, []);

//     return (
//         <Crypto.Provider
//             value={{
//                 currency,
//                 symbol,
//                 setCurrency,
//                 session,
//                 loading,
//             }}
//         >
//             {children}
//         </Crypto.Provider>
//     );
// };

// export default CryptoContext;

// export const CryptoState = () => {
//     return useContext(Crypto);
// };
