import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";
import { CryptoState } from "../pages/CryptoContext";
import { Box, Typography, TextField } from "@mui/material";
import AccountAvatar from "./AccountAvatar";
import { useState } from "react";

const Account = () => {
    //for keeping track if a profile is done being retrieved
    const [profileRetrieving, setProfileRetrieving] = useState(false);

    const {
        session,
        username,
        //we are using this to update the username in the account form
        setUsername,
        //no need website actually
        website,
        avatar_url,

        setAvatarUrl,
    } = CryptoState();

    const updateProfile = async (e) => {
        e.preventDefault();

        try {
            setProfileRetrieving(true);
            const user = supabase.auth.user();

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            };

            let { error } = await supabase.from("profiles").upsert(updates, {
                returning: "minimal", // Don't return the value after inserting
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setProfileRetrieving(false);
        }
    };

    if (!session) {
        return <Navigate to="/signin" />;
    }

    return (
        <div aria-live="polite">
            {profileRetrieving ? (
                "Fetching data ..."
            ) : (
                <Box
                    margin="5%"
                    border="1px solid"
                    borderColor="gray"
                    marginLeft="auto"
                    marginRight="auto"
                    sx={{
                        maxWidth: {
                            xs: "98%",
                            lg: "50%",
                        },
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        fontWeight="700"
                        borderBottom="1px solid"
                        borderColor="gray"
                        height="5rem"
                        paddingTop="1.5rem"
                        paddingLeft="1.3rem"
                        sx={{ fontSize: { xs: "1.3rem", lg: "1.5" } }}
                    >
                        Account Settings
                    </Typography>

                    <Typography
                        variant="h6"
                        component="h6"
                        fontSize="0.9rem"
                        fontWeight="700"
                        paddingTop="1rem"
                        paddingLeft="1.3rem"
                    >
                        Avatar
                    </Typography>
                    <AccountAvatar
                        url={avatar_url}
                        username={username}
                        onUpload={(url) => {
                            setAvatarUrl(url);
                            updateProfile({
                                username,
                                //no need website actually
                                // website,
                                avatar_url: url,
                            });
                        }}
                    />

                    <form
                        onSubmit={updateProfile}
                        style={{ paddingLeft: "1.3rem", paddingTop: "1.5rem" }}
                    >
                        {/* wrapperbox for username */}
                        <Box marginBottom="0.8rem">
                            <Typography
                                variant="h6"
                                component="h6"
                                fontSize="0.9rem"
                                fontWeight="700"
                            >
                                Username
                            </Typography>
                            <TextField
                                size="small"
                                id="username"
                                type="text"
                                value={username || ""}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{
                                    width: { xs: "95%", lg: "30%" },
                                    paddingTop: "10px",
                                }}
                            />
                        </Box>

                        {/* wrapper box for email */}
                        <Box marginBottom="0.8rem">
                            <Typography
                                variant="h6"
                                component="h6"
                                fontSize="0.9rem"
                                fontWeight="700"
                            >
                                Email Address
                            </Typography>
                            <TextField
                                disabled
                                size="small"
                                id="email-address"
                                type="text"
                                value={session.user.email}
                                sx={{
                                    width: { xs: "95%", lg: "30%" },
                                    paddingTop: "10px",
                                }}
                            />
                        </Box>

                        <button
                            className="btn"
                            type="submit"
                            style={{
                                margin: "2rem 0",
                                height: "35px",
                                width: "90px",
                                borderRadius: "10px",
                                padding: "0",
                                fontSize: "1rem",
                            }}
                        >
                            Save
                        </button>
                    </form>
                </Box>
            )}
        </div>
    );
};

export default Account;

//original before push
// import { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import { Navigate } from "react-router-dom";
// import { CryptoState } from "../pages/CryptoContext";
// import { Box, Typography, Avatar, TextField } from "@mui/material";

// const Account = () => {
//     const [loading, setLoading] = useState(true);
//     const [username, setUsername] = useState(null);
//     const [website, setWebsite] = useState(null);
//     const [avatar_url, setAvatarUrl] = useState(null);
//     const { session } = CryptoState();

//     useEffect(() => {
//         if (session) {
//             getProfile();
//         }
//     }, [session]);

//     const getProfile = async () => {
//         try {
//             setLoading(true);
//             const user = supabase.auth.user();
//             const { error2 } = await supabase.from("profiles").upsert([
//                 {
//                     id: user.id,
//                 },
//             ]);
//             if (error2) throw error2;
//             let { data, error, status } = await supabase
//                 .from("profiles")
//                 .select("username, website, avatar_url")
//                 .eq("id", user.id)
//                 .single();
//             if (error && status !== 406) {
//                 throw error;
//             }
//             if (data) {
//                 setUsername(data.username);
//                 setWebsite(data.website);
//                 setAvatarUrl(data.avatar_url);
//             }
//         } catch (error) {
//             alert(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateProfile = async (e) => {
//         e.preventDefault();

//         try {
//             setLoading(true);
//             const user = supabase.auth.user();

//             const updates = {
//                 id: user.id,
//                 username,
//                 website,
//                 avatar_url,
//                 updated_at: new Date(),
//             };

//             let { error } = await supabase.from("profiles").upsert(updates, {
//                 returning: "minimal", // Don't return the value after inserting
//             });

//             if (error) {
//                 throw error;
//             }
//         } catch (error) {
//             alert(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!session) {
//         return <Navigate to="/signin" />;
//     }

//     return (
//         <div aria-live="polite">
//             {loading ? (
//                 "Fetching data ..."
//             ) : (
//                 <Box
//                     margin="5%"
//                     border="1px solid"
//                     borderColor="gray"
//                     marginLeft="auto"
//                     marginRight="auto"
//                     sx={{
//                         maxWidth: {
//                             xs: "98%",
//                             lg: "50%",
//                         },
//                     }}
//                 >
//                     <Typography
//                         variant="h1"
//                         component="h1"
//                         fontWeight="700"
//                         borderBottom="1px solid"
//                         borderColor="gray"
//                         height="5rem"
//                         paddingTop="1.5rem"
//                         paddingLeft="1.3rem"
//                         sx={{ fontSize: { xs: "1.3rem", lg: "1.5" } }}
//                     >
//                         Account Settings
//                     </Typography>

//                     <Typography
//                         variant="h6"
//                         component="h6"
//                         fontSize="0.9rem"
//                         fontWeight="700"
//                         paddingTop="1rem"
//                         paddingLeft="1.3rem"
//                     >
//                         Avatar
//                     </Typography>
//                     <Box
//                         display="flex"
//                         paddingTop="0.7rem"
//                         paddingLeft="1.3rem"
//                         alignItems="center"
//                     >
//                         <Avatar
//                             alt={"avatar"}
//                             src={avatar_url}
//                             sx={{
//                                 marginRight: "1rem",
//                                 height: "50px",
//                                 width: "50px",
//                             }}
//                         >
//                             {username.toUpperCase().charAt(0)}
//                         </Avatar>

//                         <button
//                             className="btn"
//                             style={{
//                                 height: "40px",
//                                 width: "110px",
//                                 borderRadius: "10px",
//                                 padding: "0",
//                                 fontSize: "1rem",
//                             }}
//                         >
//                             Edit Avatar
//                         </button>
//                     </Box>

//                     <br></br>

//                     <form
//                         onSubmit={updateProfile}
//                         style={{ paddingLeft: "1.3rem" }}
//                     >
//                         {/* wrapperbox for username */}
//                         <Box marginBottom="0.8rem">
//                             <Typography
//                                 variant="h6"
//                                 component="h6"
//                                 fontSize="0.9rem"
//                                 fontWeight="700"
//                             >
//                                 Username
//                             </Typography>
//                             <TextField
//                                 size="small"
//                                 id="username"
//                                 type="text"
//                                 value={username || ""}
//                                 onChange={(e) => setUsername(e.target.value)}
//                                 sx={{
//                                     width: { xs: "95%", lg: "30%" },
//                                     paddingTop: "10px",
//                                 }}
//                             />
//                         </Box>

//                         {/* wrapper box for email */}
//                         <Box marginBottom="0.8rem">
//                             <Typography
//                                 variant="h6"
//                                 component="h6"
//                                 fontSize="0.9rem"
//                                 fontWeight="700"
//                             >
//                                 Email Address
//                             </Typography>
//                             <TextField
//                                 disabled
//                                 size="small"
//                                 id="email-address"
//                                 type="text"
//                                 value={session.user.email}
//                                 sx={{
//                                     width: { xs: "95%", lg: "30%" },
//                                     paddingTop: "10px",
//                                 }}
//                             />
//                         </Box>

//                         <button
//                             className="btn"
//                             style={{
//                                 margin: "2rem 0",
//                                 height: "35px",
//                                 width: "90px",
//                                 borderRadius: "10px",
//                                 padding: "0",
//                                 fontSize: "1rem",
//                             }}
//                         >
//                             Save
//                         </button>
//                     </form>
//                 </Box>
//             )}
//         </div>
//     );
// };

// export default Account;
