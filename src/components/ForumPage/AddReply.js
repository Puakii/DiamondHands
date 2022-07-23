import {
    Avatar,
    Button,
    Fab,
    Modal,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Box } from "@mui/system";
import { useCryptoState } from "../../context/CryptoContext";
import { supabase } from "../../supabaseClient";

const StyledModal = styled(Modal)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

const AddReply = ({ postId }) => {
    //for modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //for avatar pic
    const [navBarAvatar, setNavBarAvatar] = useState(null);

    //get from contextAPI
    const { session, avatar_url, username } = useCryptoState();

    //for post
    const [replyContent, setReplyContent] = useState("");

    //for downloading avatar image
    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage
                .from("avatars")
                .download(path);
            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            setNavBarAvatar(url);
        } catch (error) {
            console.log("Error downloading image: ", error.message);
        }
    };

    useEffect(() => {
        if (avatar_url) downloadImage(avatar_url);
    }, [avatar_url]);

    const handleAddReply = async () => {
        try {
            const user = supabase.auth.user();
            const { error, status } = await supabase.from("replies").insert([
                {
                    post_id: postId,
                    content: replyContent,
                    created_by: user.id,
                    username: username,
                },
            ]);

            if (error && status !== 406) {
                throw error;
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    return (
        <>
            <Tooltip
                onClick={
                    session
                        ? (e) => handleOpen()
                        : () => toast.error("Please sign in to reply")
                }
                title="Reply to Post"
            >
                <Fab size="medium" color="white" aria-label="add">
                    <Add />
                </Fab>
            </Tooltip>
            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    width={400}
                    height={350}
                    bgcolor={"white"}
                    p={3}
                    borderRadius={5}
                >
                    <Typography
                        variant="h6"
                        color="gray"
                        fontWeight="bold"
                        textAlign={"center"}
                    >
                        Reply to Post
                    </Typography>
                    <Box
                        display="flex"
                        gap="10px"
                        alignItems="center"
                        paddingBottom="15px"
                    >
                        <Avatar alt="Remy Sharp" src={navBarAvatar} />
                        <Typography
                            fontWeight={500}
                            variant="span"
                            color="gray"
                        >
                            {username}
                        </Typography>
                    </Box>
                    <TextField
                        sx={{
                            marginTop: "1rem",
                            width: "100%",

                            "& .MuiInput-input": {
                                color: "gray",
                                fontWeight: "bold",
                            },

                            "& .MuiInput-underline: before": {
                                borderColor: "gray",
                            },
                            "&:hover .MuiInput-underline: before": {
                                borderColor: "rgb(0, 255, 242)",
                            },
                            "& .MuiInput-underline: after": {
                                borderColor: "rgb(0, 255, 242)",
                            },
                        }}
                        id="standard-multiline-static"
                        multiline
                        rows={3}
                        placeholder="What's on your mind?"
                        variant="standard"
                        onChange={(e) => setReplyContent(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            marginTop: "1rem",
                            "&.MuiButton-root": {
                                backgroundColor: "var(--primary)",
                            },
                        }}
                        onClick={
                            replyContent.length === 0
                                ? () =>
                                      toast.error(
                                          "Please ensure that your reply is not empty!"
                                      )
                                : () => {
                                      handleAddReply();
                                      toast.success(
                                          "Replied to post successfully!"
                                      );
                                      handleClose();
                                  }
                        }
                    >
                        Add Reply
                    </Button>
                </Box>
            </StyledModal>
        </>
    );
};

export default AddReply;
