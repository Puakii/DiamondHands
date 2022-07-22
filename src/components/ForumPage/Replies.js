import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import AddReply from "./AddReply";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

const Replies = ({ postId }) => {
    const [replies, setReplies] = useState(null);
    const [date, setDate] = useState(new Date());

    function refreshClock() {
        setDate(new Date());
    }
    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    const getRepliesAndSubscribe = async () => {
        try {
            //no single() as ideally we want them to be able to add multiple alerts => return us a []

            const { data, error, status } = await supabase
                .from("replies")
                .select("*")
                .eq("post_id", postId);

            if (error && status !== 406) {
                throw error;
            }

            //to display the posts originally without any events e.g. inserts
            setReplies(data);

            //listener
            const mySubscription = supabase
                .from("replies")
                .on("INSERT", (payload) => {
                    console.log("Change received!", payload);

                    data.push(payload.new);
                    setReplies(data);
                })
                .on("DELETE", (payload) => {
                    console.log("Change received!", payload);

                    const removedData = data.filter((post) => {
                        console.log(post.id !== payload.old.id);
                        return post.id !== payload.old.id;
                    });

                    setReplies(removedData);
                })
                .subscribe((status) => console.log(status));

            //clean up
            return () => {
                supabase.removeSubscription(mySubscription);
            };
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    useEffect(() => {
        getRepliesAndSubscribe();
    }, []);

    if (!replies) {
        return null;
    }
    return (
        <>
            {replies.map((reply) => (
                <Box
                    className="forEachReply"
                    key={reply.id}
                    // sx={{ width: { xs: "90%", tablet: "70%", lg: "50%" } }}
                    margin="0.5rem"
                >
                    <Paper
                        sx={{
                            "&.MuiPaper-root": {
                                backgroundColor: "rgb(240, 240, 240)",
                                borderRadius: "1rem",

                                padding: "1.5rem",
                            },
                        }}
                    >
                        <Grid
                            container
                            className="container-for-by-who"
                            justifyContent="space-between"
                        >
                            <Grid item xs={6}>
                                <Box className="by-who">
                                    <Typography
                                        fontFamily="Poppins"
                                        color="black"
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        {reply.username}
                                    </Typography>

                                    <Box
                                        className="time"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        {Math.ceil(
                                            //because in milliseconds
                                            (date.getTime() -
                                                new Date(
                                                    reply.created_at
                                                ).getTime()) /
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
                                                    color="black"
                                                    variant="body2"
                                                    component="p"
                                                    marginLeft={0.5}
                                                >
                                                    {Math.ceil(
                                                        //because in milliseconds
                                                        (date.getTime() -
                                                            new Date(
                                                                reply.created_at
                                                            ).getTime()) /
                                                            60000
                                                    )}{" "}
                                                    min ago
                                                </Typography>
                                            </>
                                        ) : Math.ceil(
                                              //because in milliseconds
                                              (date.getTime() -
                                                  new Date(
                                                      reply.created_at
                                                  ).getTime()) /
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
                                                    color="black"
                                                    variant="body2"
                                                    component="p"
                                                    marginLeft={0.5}
                                                >
                                                    {Math.ceil(
                                                        //because in milliseconds
                                                        (date.getTime() -
                                                            new Date(
                                                                reply.created_at
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
                                                    color="black"
                                                    variant="body2"
                                                    component="p"
                                                    marginLeft={0.5}
                                                >
                                                    {Math.ceil(
                                                        //because in milliseconds
                                                        (date.getTime() -
                                                            new Date(
                                                                reply.created_at
                                                            ).getTime()) /
                                                            86400000
                                                    )}{" "}
                                                    days ago
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box>
                            <Typography
                                color="black"
                                marginTop="1rem"
                                style={{ wordWrap: "break-word" }}
                            >
                                {reply.content.toString()}
                            </Typography>
                        </Box>
                        {/* <Box className="interaction" marginTop="1rem">
                        <ThumbUp sx={{ color: "black" }} />
                    </Box> */}
                    </Paper>
                </Box>
            ))}

            <AddReply postId={postId} />
        </>
    );
};

export default Replies;
