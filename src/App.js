import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import AccountPage from "./pages/AccountPage";
import ErrorPage from "./pages/ErrorPage";
import SignInPage from "./pages/SignInPage";
import CryptoPage from "./pages/CryptoPage";
import ForumPage from "./pages/ForumPage";

import { createTheme, ThemeProvider } from "@mui/material";
import { useCryptoState } from "./context/CryptoContext";

import WatchlistPage from "./pages/WatchlistPage";
import NewsPage from "./pages/NewsPage";
import MultiMarketPage from "./pages/MultiMarketPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";

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
            tablet: 768,
            md: 900,
            lg: 1250,
            xl: 1536,
        },
    },
});

function App() {
    const { loading } = useCryptoState();
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
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route
                        path="/coins/:coinId"
                        element={<MultiMarketPage />}
                    />
                    <Route
                        path="/resetpassword"
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path="/updatepassword"
                        element={<UpdatePasswordPage />}
                    />
                    <Route path="/forum/posts" element={<ForumPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
