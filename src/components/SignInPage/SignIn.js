import React from "react";
import "./SignIn.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { CryptoState } from "../../pages/CryptoContext";
import toast, { Toaster } from "react-hot-toast";
import { Box } from "@mui/system";

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { session } = CryptoState();

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
                        "https://crypto-universe-orbital.vercel.app/watchlist",
                }
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

        let gotError = false;

        try {
            if (password) {
                const { error } = await supabase.auth.signIn({
                    email: email,
                    password: password,
                });
                if (error) throw error;
                // toast.success("hi");

                navigate("/watchlist");
            }
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
        return <Navigate to="/watchlist" />;
    }

    return (
        <>
            <Toaster />
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
                                <Box
                                    width="100%"
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <label>Password</label>
                                    <button
                                        className="forgetPasswordBtn"
                                        onClick={() =>
                                            navigate("/resetpassword")
                                        }
                                    >
                                        Forgot Password?
                                    </button>
                                </Box>
                                <input
                                    type={"Password"}
                                    placeholder={"Enter your password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                        <div className="backToHome">
                            <button
                                className="btn-3"
                                type="button"
                                onClick={() => navigate("/")}
                            >
                                Back To Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SignIn;
