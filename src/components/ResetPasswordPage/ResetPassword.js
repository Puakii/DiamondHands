import { CircularProgress, Typography } from "@mui/material";
import "./ResetPassword.css";
import { Box } from "@mui/system";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCryptoState } from "../../pages/CryptoContext";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { supabase } from "../../supabaseClient";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [checkEmail, setCheckEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const { session } = useCryptoState();

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { error } = await supabase.auth.api.resetPasswordForEmail(
                email,
                {
                    redirectTo: "http://localhost:3000/updatepassword",
                }
            );
            if (error) throw error;
            setLoading(false);
            setCheckEmail(true);
        } catch (error) {
            toast.error(error.error_description || error.message);
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    if (session) {
        return <Navigate to="/watchlist" />;
    }

    return (
        <>
            <div className="pageContainer">
                {loading ? (
                    <CircularProgress color="success" />
                ) : checkEmail ? (
                    <Box
                        className="checkEmailContainer"
                        height="350px"
                        width="550px"
                        borderRadius="10px"
                        backgroundColor="rgb(217, 234, 236)"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        padding="2%"
                    >
                        <MarkEmailReadIcon
                            sx={{
                                color: "green",
                                marginTop: "4%",
                                height: "10%",
                                width: "10%",
                            }}
                        />
                        <Typography
                            variant="h1"
                            color="black"
                            fontWeight="medium"
                            fontFamily="Open Sans"
                            fontSize="1.8rem"
                            marginTop="3%"
                        >
                            Check your email
                        </Typography>
                        <Typography
                            variant="h6"
                            textAlign="center"
                            color="black"
                            fontWeight="bold"
                            fontSize="1rem"
                            marginTop="2%"
                        >
                            An email has been sent to {email} with instructions
                            to reset your password.
                        </Typography>
                        <Typography
                            variant="h6"
                            textAlign="center"
                            color="black"
                            fontWeight="bold"
                            fontSize="0.8rem"
                            marginTop="5%"
                        >
                            {" "}
                            * If the email doesn't show up soon, check your spam
                            folder or make sure you enter the email you used for
                            registration
                        </Typography>
                        <button
                            className="return-to-login-btn"
                            onClick={() => navigate("/signin")}
                        >
                            Return to login
                        </button>
                    </Box>
                ) : (
                    <Box
                        className="resetPasswordContainer"
                        height="350px"
                        width="550px"
                        borderRadius="10px"
                        // sx={{
                        //     border: { xs: "0px solid", tablet: "1px solid" },
                        // }}
                        backgroundColor="rgb(217, 234, 236)"
                    >
                        <ArrowBackIcon
                            sx={{
                                height: "15%",
                                width: "15%",
                                padding: "3%",
                                paddingBottom: "0%",
                                color: "black",
                                "&:hover": {
                                    cursor: "pointer",
                                },
                            }}
                            onClick={() => navigate("/signin")}
                        />
                        <form
                            style={{ paddingLeft: "3%", paddingRight: "3%" }}
                            onSubmit={handlePasswordReset}
                        >
                            <Typography
                                variant="h1"
                                fontSize="2rem"
                                fontFamily="Open Sans, sans-serif"
                                marginBottom="2%"
                                color="black"
                                sx={{
                                    textAlign: { xs: "center", tablet: "left" },
                                }}
                            >
                                Forgot password?
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
                                Enter your email below, you will receive an
                                email with instructions on how to reset your
                                password in a few minutes.{" "}
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
                                    Email Address
                                </Typography>
                                <input
                                    type={"text"}
                                    placeholder={"Enter your email"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Box>
                            <Box
                                className="buttonContainer"
                                display="flex"
                                justifyContent="center"
                            >
                                <button
                                    className="reset-password-btn"
                                    type="submit"
                                >
                                    Send Instructions
                                </button>
                            </Box>
                        </form>
                    </Box>
                )}
            </div>
        </>
    );
};

export default ResetPassword;
