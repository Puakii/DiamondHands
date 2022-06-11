import React from "react";
import Account from "../components/Account";
import { CryptoState } from "./CryptoContext";

const AccountPage = () => {
    const { loading } = CryptoState();
    return <>{!loading && <Account />}</>;
};

export default AccountPage;
