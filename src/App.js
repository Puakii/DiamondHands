import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Error from "./pages/Error";
import SignIn from "./pages/SignIn";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signin" element={<SignIn session={session} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
}

export default App;
