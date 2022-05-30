import React from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleMagicLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { error } = await supabase.auth.signIn(
                {
                    email: email,
                },
                { redirectTo: "http://localhost:3001/account" }
            );

            if (error) throw error;
            alert("Check your email for the login link!");
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();

        try {
            if (password === "") {
                alert("Key in your password");
            } else {
                const { error } = await supabase.auth.signIn({
                    email: email,
                    password: password,
                });
                if (error) throw error;
                navigate("/account");
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    const navigate = useNavigate();
    return (
        <div className="form-login">
            {loading ? (
                <div className="sending-magic">Sending magic link...</div>
            ) : (
                <div className="container">
                    <form onSubmit={handlePasswordLogin}>
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button className="btn-signIn" type="submit">
                                Sign in
                            </button>
                        </div>
                    </form>
                    <div>
                        <button
                            className="btn-signIn"
                            type="button"
                            onClick={handleMagicLogin}
                        >
                            Sign in with magic link
                        </button>
                    </div>
                    <div className="signUp">
                        <h2>New to CryptoUniverse?</h2>
                        <button
                            className="btn-2"
                            type="button"
                            onClick={() => navigate("/signup")}
                        >
                            Join now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignIn;