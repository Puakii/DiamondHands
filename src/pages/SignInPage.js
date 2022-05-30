import React from "react";
import SignIn from "../components/SignIn";

const SignInPage = (props) => {
    return (
        <>
            <SignIn session={props.session} />
        </>
    );
};

export default SignInPage;
