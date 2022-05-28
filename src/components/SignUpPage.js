import React from "react";
import "./SignUpPage.css";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    let navigate = useNavigate();
    return (
        <div className="form-signup">
            <div className="container">
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
                    <button className="btn-signUp">Join</button>
                </div>
                <div className="signUp">
                    <h2>Already on CryptoUniverse?</h2>
                    <button
                        className="btn-2"
                        onClick={() => navigate("/signin")}
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
