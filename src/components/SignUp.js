import React from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase.auth.signUp(
                {
                    email: email,
                    password: password,
                },
                { redirectTo: "http://localhost:3001/signin" }
            );
            if (error) throw error;
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    let navigate = useNavigate();
    return (
        <div className="form-signup">
            <div className="container">
                <form onSubmit={handleSignUp}>
                    <div className="row">
                        <label>Email</label>
                        <input
                            type={"text"}
                            placeholder={"Enter your email"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <label>Password</label>
                        <input
                            type={"Password"}
                            placeholder={"Enter your password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className="btn-signUp" type="submit">
                            Join
                        </button>
                    </div>
                </form>

                <div className="signUp">
                    <h2>Already on CryptoUniverse?</h2>
                    <button
                        className="btn-2"
                        type="button"
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
