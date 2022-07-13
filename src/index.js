import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App";
import CryptoContext from "./pages/CryptoContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <CryptoContext>
            <Toaster toastOptions={{ duration: 3000 }} />
            <App />
        </CryptoContext>
    </React.StrictMode>
);
