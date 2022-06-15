import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import AccountPage from "./pages/AccountPage";
import ErrorPage from "./pages/ErrorPage";
import SignInPage from "./pages/SignInPage";
import CryptoPage from "./pages/CryptoPage";

import { createTheme, ThemeProvider } from "@mui/material";
import { CryptoState } from "./pages/CryptoContext";

import WatchlistPage from "./pages/WatchlistPage";


const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#fff",
        },

        mode: "dark",
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1250,
            xl: 1536,
        },
    },
});

function App() {

    const { loading } = CryptoState();
    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route
                        path="/account"
                        element={!loading && <AccountPage />}
                    />
                    <Route path="/cryptocurrencies" element={<CryptoPage />} />
                     <Route path="/watchlist" element={<WatchlistPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Router>
        </ThemeProvider>

    );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import SignUpPage from "./pages/SignUpPage";
// import AccountPage from "./pages/AccountPage";
// import ErrorPage from "./pages/ErrorPage";
// import SignInPage from "./pages/SignInPage";
// import { useState, useEffect } from "react";
// import { supabase } from "./supabaseClient";

// function App() {
//     const [session, setSession] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         setSession(supabase.auth.session());

//         supabase.auth.onAuthStateChange((_event, session) => {
//             setSession(session);
//         });
//         setLoading(false);
//     }, []);

//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/home" element={<HomePage />} />
//                 <Route
//                     path="/signin"
//                     element={<SignInPage session={session} />}
//                 />
//                 <Route path="/signup" element={<SignUpPage />} />
//                 <Route
//                     path="/account"
//                     element={!loading && <AccountPage session={session} />}
//                 />
//                 <Route path="*" element={<ErrorPage />} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;
