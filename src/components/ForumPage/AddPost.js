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
import { Box, createTheme, ThemeProvider } from "@mui/system";
import { useCryptoState } from "../../context/CryptoContext";
import { supabase } from "../../supabaseClient";

const StyledModal = styled(Modal)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

const AddPost = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //for avatar pic
    const [navBarAvatar, setNavBarAvatar] = useState(null);

    //get from contextAPI
    const { session, avatar_url, username } = useCryptoState();

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

    return (
        <>
            <Tooltip
                onClick={
                    session
                        ? (e) => handleOpen()
                        : () => toast.error("Please sign in to post")
                }
                title="Add Post"
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
                    height={280}
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
                        Create post
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
                            width: "100%",

                            "& .MuiInput-input": {
                                color: "gray",
                                fontWeight: "bold",
                            },

                            "& .MuiInput-underline: before": {
                                borderColor: "black",
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
                    >
                        Add Post
                    </Button>
                </Box>
            </StyledModal>
        </>
    );
};

export default AddPost;
