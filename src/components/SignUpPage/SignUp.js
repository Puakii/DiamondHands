import React from "react";
import "./SignUp.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useCryptoState } from "../../pages/CryptoContext";
import toast from "react-hot-toast";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { session } = useCryptoState();

    const handleSignUp = async (e) => {
        e.preventDefault();

        let gotError = false;
        try {
            if (name.length >= 3) {
                const { user, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
                if (error) throw error;
                const { error2 } = await supabase.from("profiles").insert([
                    {
                        id: user.id,
                        username: name,
                        website: "",
                        avatar_url: "",
                    },
                ]);
                if (error2) throw error2;
                navigate("/watchlist");
            }
        } catch (error) {
            gotError = true;
            if (email === "" && password === "") {
                toast.error("Please emter your email and password");
            } else {
                toast.error(error.error_description || error.message);
            }
        } finally {
            if (name === "" && email === "" && password === "") {
                toast.error("Please enter your name, email and password");
            } else if (!gotError && name === "") {
                toast.error("Please enter your name");
            } else if (!gotError && name.length < 3) {
                toast.error("Please enter a name with more than 3 characters");
            }
        }
    };

    if (session) {
        return <Navigate to="/watchlist" />;
    }

    return (
        <div className="form-signup">
            <div className="container">
                <form onSubmit={handleSignUp}>
                    <div className="row">
                        <label>Name</label>
                        <input
                            type={"text"}
                            placeholder={"Enter your name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
        </div>
    );
};

export default SignUp;
