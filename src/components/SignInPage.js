import React from "react";
import "./SignInPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const SignInPage = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { error } = await supabase.auth.signIn({ email });
            if (error) throw error;
            alert("Check your email for the login link!");
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };
    let navigate = useNavigate();
    return (
        <div className="form-login">
            <div className="container">
                {loading ? (
                    "Sending magic link..."
                ) : (
                    <form onSubmit={handleLogin}>
                        <h1>Sign In</h1>
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
                            />
                        </div>
                        <div>
                            <button className="btn-signIn">Sign in</button>
                        </div>
                        <div>
                            <button className="btn-signIn" type="submit">
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
                    </form>
                )}
            </div>
        </div>
    );
};

export default SignInPage;
