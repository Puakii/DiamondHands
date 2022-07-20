import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App";
import CryptoContext from "./context/CryptoContext";
import PriceAlertContext from "./context/PriceAlertContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <CryptoContext>
        <PriceAlertContext>
            <Toaster toastOptions={{ duration: 3000 }} />
            <App />
        </PriceAlertContext>
    </CryptoContext>
    // </React.StrictMode>
);
