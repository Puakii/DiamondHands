import React from "react";
import "./SignIn.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const SignIn = ({ session }) => {
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
                {
                    redirectTo:
                        "https://diamond-hands-forked.vercel.app/account",
                    // https://diamond-hands-forked.vercel.app/signin,
                }
            );

            if (error) throw error;
            alert("Check your email for the login link!");
        } catch (error) {
            // alert(error.message !== "" ? error.message : errorForEmptyPassword);
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();

        let gotError = false;

        try {
            const { error } = await supabase.auth.signIn({
                email: email,
                password: password,
            });
            if (error) throw error;
            navigate("/account");
        } catch (error) {
            gotError = true;
            alert(error.error_description || error.message);
        } finally {
            if (!gotError && password === "") {
                alert("Please key in your password");
            }
        }
    };

    const navigate = useNavigate();

    if (session) {
        return <Navigate to="/account" />;
    }

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
                            <button
                                className="btn-signIn"
                                type="submit"
                                // onClick={handlePasswordLogin}
                            >
                                Sign in
                            </button>
                        </div>
                        {/* position 1 */}
                        {/* </form> */}
                        <div>
                            <button
                                className="btn-signIn"
                                type="button"
                                onClick={handleMagicLogin}
                            >
                                Sign in with magic link
                            </button>
                        </div>
                        {/* positon 2 */}
                    </form>
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
