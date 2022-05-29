import React from "react";
import Account from "../components/Account";

const AccountPage = (props) => {
    return (
        <>
            <Account session={props.session} />
        </>
    );
};

export default AccountPage;
