import { CircularProgress, LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useCryptoState } from "../../pages/CryptoContext";
import { Navigate, useNavigate } from "react-router-dom";
import "./UpdatePassword.css";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

const UpdatePassword = () => {
    const { session, loading } = useCryptoState();
    const [updating, setUpdating] = useState(false);

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);

            const { error } = await supabase.auth.update({
                password: password,
            });
            if (error) throw error;
            toast.success("Updated successfully");
            navigate("/watchlist");
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    if (loading) {
        return <LinearProgress sx={{ backgroundColor: "var(--primary)" }} />;
    }

    if (!session) {
        return <Navigate to="/signin" />;
    }

    return (
        <>
            <div className="pageContainer-update-password">
                {updating ? (
                    <CircularProgress color="success" />
                ) : (
                    <Box
                        className="updatePasswordContainer"
                        height="300px"
                        width="550px"
                        borderRadius="10px"
                        backgroundColor="rgb(217, 234, 236)"
                    >
                        <form
                            style={{ paddingLeft: "3%", paddingRight: "3%" }}
                            onSubmit={handlePasswordUpdate}
                        >
                            <Typography
                                variant="h1"
                                fontSize="2rem"
                                fontFamily="Open Sans, sans-serif"
                                marginTop="3%"
                                marginBottom="2%"
                                color="black"
                                sx={{
                                    textAlign: { xs: "center", tablet: "left" },
                                }}
                            >
                                Update your password
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontSize: { xs: "0.8rem", tablet: "1rem" },
                                    textAlign: { xs: "center", tablet: "left" },
                                }}
                                color="black"
                                fontWeight="700"
                            >
                                To ensure that account is well protected,
                                password should be at least 6 characters
                            </Typography>
                            <Box
                                sx={{
                                    paddingLeft: { xs: "5.5%", tablet: "0%" },
                                    paddingRight: { xs: "5.5%", tablet: "0%" },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    marginTop="5%"
                                    color="black"
                                    sx={{
                                        fontSize: {
                                            xs: "0.8rem",
                                            tablet: "1rem",
                                        },
                                    }}
                                    fontWeight="700"
                                >
                                    New password
                                </Typography>
                                <input
                                    type="password"
                                    placeholder="Enter your new password..."
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Box>
                            <Box
                                className="buttonContainer"
                                display="flex"
                                justifyContent="center"
                            >
                                <button
                                    className="update-password-btn"
                                    type="submit"
                                >
                                    Update password
                                </button>
                            </Box>
                        </form>
                    </Box>
                )}
            </div>
        </>
    );
};

export default UpdatePassword;
