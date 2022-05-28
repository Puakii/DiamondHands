import React from "react";
import "./SignInPage.css";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
    let navigate = useNavigate();
    return (
        <div className="form-login">
            <div className="container">
                <h1>Sign In</h1>
                <div className="row">
                    <label>Email</label>
                    <input type={"text"} placeholder={"Enter your email"} />
                </div>
                <div className="row">
                    <label>Password</label>
                    <input
                        type={"Password"}
                        placeholder={"Enter your password"}
                    />
                </div>
                <div>
                    <button className="btn-signIn">Sign in</button>
                </div>
                <div>
                    <button className="btn-signIn">
                        Sign in with magic link
                    </button>
                </div>
                <div className="signUp">
                    <h2>New to CryptoUniverse?</h2>
                    <button
                        className="btn-2"
                        onClick={() => navigate("/signup")}
                    >
                        Join now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
