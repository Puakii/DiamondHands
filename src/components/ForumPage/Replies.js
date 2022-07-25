import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import AddReply from "./AddReply";
import {
    Box,
    Paper,
    Typography,
    TablePagination,
    Tooltip,
    IconButton,
} from "@mui/material";
import { AccessTime, Delete } from "@mui/icons-material";
import { useCryptoState } from "../../context/CryptoContext";
import toast from "react-hot-toast";

const Replies = ({ postId }) => {
    const [replies, setReplies] = useState(null);
    const [date, setDate] = useState(new Date());
    // for pagination
    const [page, setPage] = useState(0);
    const [repliesPerPage, setRepliesPerPage] = useState(10);

    //when listener is triggered, flip the state to trigger useEffect to rerender replies
    // const [listenerTriggered, setListenerTriggered] = useState(true);

    const { username } = useCryptoState();

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

    const getRepliesAndSubscribe = async () => {
        try {
            //no single() as ideally we want them to be able to add multiple alerts => return us a []

            //use let as we want to reassign data
            let { data, error, status } = await supabase
                .from("replies")
                .select(
                    "id, post_id, content, created_at, created_by(id, username)"
                )
                .eq("post_id", postId);

            if (error && status !== 406) {
                throw error;
            }

            //to display the replies originally without any events e.g. inserts
            setReplies(data);

            //listener
            const mySubscription = supabase
                .from("replies")
                .on("INSERT", (payload) => {
                    console.log("Change received!", payload);

                    data.push(payload.new);
                    setReplies(data);
                    console.log(data);
                    // updateReplies();
                })
                .on("DELETE", (payload) => {
                    console.log("Change received!", payload);

                    const removedData = data.filter((reply) => {
                        return reply.id !== payload.old.id;
                    });
                    //need update data if not 2 consecutive delete will spoil as data is not updated
                    data = removedData;

                    setReplies(data);
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

    //for pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRepliesPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //deleting reply
    const deleteReply = async (replyId) => {
        try {
            const { error, status } = await supabase
                .from("replies")
                .delete()
                .match({ id: replyId, created_by: user.id });

            if (error && status !== 406) {
                throw error;
            }

            toast.success("Reply deleted successfully");
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    if (!replies) {
        return null;
    }

    return (
        <Box>
            <Box
                margin="1rem"
                className="first-row"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {replies.length > 0 ? (
                    <Typography variant="h5" fontFamily="Poppins">
                        {replies.length} replies
                    </Typography>
                ) : (
                    <Typography variant="h5" fontFamily="Poppins">
                        {replies.length} reply
                    </Typography>
                )}
            </Box>

            {replies
                .slice(
                    page * repliesPerPage,
                    page * repliesPerPage + repliesPerPage
                )
                .map((reply) => (
                    <Box
                        className="forEachReply"
                        key={reply.id}
                        marginBottom="0.5rem"
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
                            <Box
                                className="by-who"
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography
                                    fontFamily="Poppins"
                                    color="black"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    {reply.created_by.username || username}
                                </Typography>

                                {/* [ {created_by: object},  {created_by: object},  {created_by: object}, {created_by: uuid}]
                                The created_by is an object when selected at the start but when listener push into it, the created_by is an uuid so we need a || condition */}

                                <Tooltip title="Delete alert">
                                    <IconButton
                                        sx={{
                                            display:
                                                reply.created_by.id ===
                                                    user.id ||
                                                reply.created_by === user.id
                                                    ? "block"
                                                    : "none",
                                            color: "black",
                                        }}
                                        onClick={() => deleteReply(reply.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Box
                                className="time"
                                display="flex"
                                alignItems="center"
                            >
                                {Math.ceil(
                                    //because in milliseconds
                                    (date.getTime() -
                                        new Date(reply.created_at).getTime()) /
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

                            <Box>
                                <Typography
                                    color="black"
                                    marginTop="1rem"
                                    style={{ wordWrap: "break-word" }}
                                >
                                    {reply.content.toString()}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                ))}
            <TablePagination
                component="div"
                count={replies.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={repliesPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <AddReply postId={postId} />
        </Box>
    );
};

export default Replies;
