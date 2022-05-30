import React from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
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
            navigate("/account");
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

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
            </div>
        </div>
    );
};

export default SignUp;
