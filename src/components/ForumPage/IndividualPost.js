import {
    Avatar,
    Box,
    Container,
    Divider,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { AccessTime, Delete } from "@mui/icons-material";
import Replies from "./Replies";
import { useNavigate } from "react-router-dom";

const IndividualPost = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [postAvatar, setPostAvatar] = useState(null);
    const [postProfile, setPostProfile] = useState(null);
    const [date, setDate] = useState(new Date());

    const navigate = useNavigate();

    const user = supabase.auth.user();

    function refreshClock() {
        setDate(new Date());
    }
    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    const getPost = async () => {
        try {
            const { data, error, status } = await supabase
                .from("posts")
                .select("*")
                .eq("id", postId)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            //to display the posts originally without any events e.g. inserts
            setPost(data);
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    //deleting post
    const deletePost = async () => {
        try {
            const { data, error, status } = await supabase
                .from("posts")
                .delete()
                .match({ id: postId, created_by: user.id });

            if (error && status !== 406) {
                throw error;
            }

            toast.success("Post deleted successfully");
            navigate("/forum");
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    //get profile information and avatar
    const getAvatar = async () => {
        try {
            const { data, error, status } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", post.created_by)
                .single();

            if (error && status !== 406) {
                throw error;
            }
            if (data) {
                setPostProfile(data);
                if (data.avatar_url) {
                    downloadImage(data.avatar_url);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const downloadImage = async (path) => {
        try {
            const { data, status, error } = await supabase.storage
                .from("avatars")
                .download(path);
            if (error && status !== 400) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            setPostAvatar(url);
        } catch (error) {
            console.log("Error downloading image: ", error.message);
        }
    };

    // use effect for getting post
    useEffect(() => {
        getPost();
    }, []);

    useEffect(() => {
        if (post) {
            getAvatar();
        }
    }, [post]);

    if (!post || !postProfile) {
        return null;
    }

    return (
        <Container>
            <Box marginBottom="2%" marginTop="2%">
                <Paper
                    sx={{
                        "&.MuiPaper-root": {
                            backgroundColor: "white",
                            borderRadius: "1rem",
                        },
                        marginBottom: "2rem",

                        padding: "0.5rem",
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "1rem",
                            justifyContent: "space-between",
                        }}
                        padding="1%"
                    >
                        <Typography
                            sx={{ fontSize: { xs: "2.2rem", tablet: "3rem" } }}
                            color="black"
                            variant="h1"
                            fontFamily="Poppins"
                            style={{ wordWrap: "break-word" }}
                            width="100%"
                        >
                            {post.title}
                        </Typography>
                        <Tooltip title="Delete post">
                            <IconButton
                                sx={{
                                    display:
                                        post.created_by === user.id
                                            ? "block"
                                            : "none",
                                    color: "black",
                                }}
                                onClick={() => deletePost()}
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                        }}
                        padding="1%"
                    >
                        <Typography
                            variant="h6"
                            color="black"
                            fontWeight={800}
                            fontSize="0.8rem"
                            fontFamily="Montserrat"
                            width="100%"
                            style={{ wordWrap: "break-word" }}
                        >
                            {post.content}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            backgroundColor: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: "1rem",
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "left",
                                borderRadius: "1rem",
                                width: "50%",
                            }}
                            padding="2%"
                        >
                            {Math.ceil(
                                //because in milliseconds
                                (date.getTime() -
                                    new Date(post.created_at).getTime()) /
                                    60000
                            ) < 60 ? (
                                <>
                                    <AccessTime
                                        sx={{
                                            color: "black",
                                            width: 12.5,
                                        }}
                                    />

                                    <Typography
                                        variant="subtitle2"
                                        color="black"
                                        fontWeight={800}
                                        fontSize="0.8rem"
                                        fontFamily="Montserrat"
                                        marginLeft={0.5}
                                    >
                                        {Math.ceil(
                                            //because in milliseconds
                                            (date.getTime() -
                                                new Date(
                                                    post.created_at
                                                ).getTime()) /
                                                60000
                                        )}{" "}
                                        min ago
                                    </Typography>
                                </>
                            ) : Math.ceil(
                                  //because in milliseconds
                                  (date.getTime() -
                                      new Date(post.created_at).getTime()) /
                                      3600000
                              ) < 24 ? (
                                <>
                                    <AccessTime
                                        sx={{
                                            color: "black",
                                            width: 12.5,
                                        }}
                                    />

                                    <Typography
                                        variant="subtitle2"
                                        color="black"
                                        fontWeight={800}
                                        fontSize="0.8rem"
                                        fontFamily="Montserrat"
                                        marginLeft={0.5}
                                    >
                                        {Math.ceil(
                                            //because in milliseconds
                                            (date.getTime() -
                                                new Date(
                                                    post.created_at
                                                ).getTime()) /
                                                3600000
                                        )}{" "}
                                        hours ago
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <AccessTime
                                        sx={{
                                            color: "black",
                                            width: 12.5,
                                        }}
                                    />

                                    <Typography
                                        variant="subtitle2"
                                        color="black"
                                        fontWeight={800}
                                        fontSize="0.8rem"
                                        fontFamily="Montserrat"
                                        marginLeft={0.5}
                                    >
                                        {Math.ceil(
                                            //because in milliseconds
                                            (date.getTime() -
                                                new Date(
                                                    post.created_at
                                                ).getTime()) /
                                                86400000
                                        )}{" "}
                                        days ago
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "right",
                                borderRadius: "1rem",
                            }}
                            paddingX="2%"
                            width="100%"
                        >
                            <Avatar
                                sx={{ width: 40, height: 40 }}
                                alt={"avatar"}
                                src={postAvatar}
                            />

                            <Box
                                sx={{
                                    backgroundColor: "white",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                padding="2%"
                            >
                                <Typography
                                    variant="subtitle2"
                                    color="black"
                                    fontSize="0.8rem"
                                    fontWeight={800}
                                    fontFamily="Montserrat"
                                >
                                    {"Created by " + postProfile.username}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
                <Replies postId={postId} />
            </Box>
        </Container>
    );
};

export default IndividualPost;
