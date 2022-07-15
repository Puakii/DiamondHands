import React, { createContext } from "react";

const Alert = createContext();

const PriceAlertContext = ({ children }) => {
    return <Alert.Provider>{children}</Alert.Provider>;
};

export default PriceAlertContext;
