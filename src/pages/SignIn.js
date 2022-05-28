import React from "react";
import SignInPage from "../components/SignInPage";
import Account from "../Account";

const SignIn = (props) => {
    return (
        <>
            {!props.session ? (
                <SignInPage />
            ) : (
                <Account key={props.session.user.id} session={props.session} />
            )}
        </>
    );
};

export default SignIn;
