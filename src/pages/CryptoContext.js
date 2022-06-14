//original 3.10pm
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
            value={{
                currency,
                symbol,
                setCurrency,
                session,
                loading,
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

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// const Crypto = createContext();

// const CryptoContext = ({ children }) => {
//     const [currency, setCurrency] = useState("USD");
//     const [symbol, setSymbol] = useState("USD");
//     const [session, setSession] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const [username, setUsername] = useState(null);
//     const [website, setWebsite] = useState(null);
//     const [avatar_url, setAvatarUrl] = useState(null);
//     const [profileLoading, setProfileLoading] = useState(true);

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

//     useEffect(() => {
//         if (session) {
//             getProfile();
//         }
//     }, [session]);

//     const getProfile = async () => {
//         try {
//             setProfileLoading(true);
//             const user = supabase.auth.user();
//             const { error2 } = await supabase.from("profiles").upsert([
//                 {
//                     id: user.id,
//                 },
//             ]);
//             if (error2) throw error2;
//             let { data, error, status } = await supabase
//                 .from("profiles")
//                 .select("username, website, avatar_url")
//                 .eq("id", user.id)
//                 .single();
//             if (error && status !== 406) {
//                 throw error;
//             }
//             if (data) {
//                 setUsername(data.username);
//                 setWebsite(data.website);
//                 setAvatarUrl(data.avatar_url);
//             }
//         } catch (error) {
//             alert(error.message);
//         } finally {
//             setProfileLoading(false);
//         }
//     };

//     return (
//         <Crypto.Provider
//             value={{
//                 currency,
//                 symbol,
//                 setCurrency,
//                 session,
//                 loading,
//                 username,
//                 setUsername,
//                 website,
//                 setWebsite,
//                 avatar_url,
//                 setAvatarUrl,
//                 profileLoading,
//                 setProfileLoading,
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
