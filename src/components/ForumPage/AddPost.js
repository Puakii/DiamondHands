import {
    Avatar,
    Button,
    Checkbox,
    Fab,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Modal,
    OutlinedInput,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { Add, SystemSecurityUpdateWarningOutlined } from "@mui/icons-material";
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

//Styling for selecting tags(menu)
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddPost = ({ data }) => {
    //for modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //for avatar pic
    const [navBarAvatar, setNavBarAvatar] = useState(null);

    //get from contextAPI
    const { session, avatar_url, username } = useCryptoState();

    //for post
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [tags, setTags] = useState([]);

    // console.log(data);

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

    //updating backend when inserting post
    const handleAddPost = async () => {
        try {
            const user = supabase.auth.user();
            const { error, status } = await supabase.from("posts").insert([
                {
                    title: postTitle,
                    content: postContent,
                    created_by: user.id,
                    tags: tags,
                },
            ]);

            if (error && status !== 406) {
                throw error;
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    //To handle tag change
    const handleTagChange = (event) => {
        const {
            target: { value },
        } = event;
        setTags(
            // On autofill we get a stringified value. hmm maybe in this case no need?idk
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <>
            <Tooltip
                onClick={
                    session
                        ? (e) => handleOpen()
                        : () => toast.error("Please sign in to post")
                }
                title="Add Post"
                sx={{
                    position: "fixed",
                    bottom: 20,
                    left: { xs: "calc(50% - 25px)", md: "24%" },
                }}
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
                    bgcolor={"whiteSmoke"}
                    p={3}
                    borderRadius={5}
                >
                    <Box
                        className="title-and-select-tags"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography
                            variant="h6"
                            color="gray"
                            fontWeight="bold"
                            textAlign={"center"}
                        >
                            Create post
                        </Typography>
                        <FormControl
                            //styling for label
                            sx={{
                                m: 1,
                                width: 150,
                                marginLeft: "3rem",
                                "& .MuiFormLabel-root": {
                                    color: "black",
                                    fontWeight: "bold",
                                },
                                "&.Mui-focused .MuiFormLabel-root": {
                                    color: "black",
                                    fontWeight: "bold",
                                },
                            }}
                        >
                            <InputLabel id="input-label">Tags</InputLabel>
                            <Select
                                variant="filled"
                                id="select-button-for-tags"
                                multiple
                                value={tags}
                                onChange={handleTagChange}
                                //i think without default is filled input
                                input={<OutlinedInput label="Tags" />}
                                //rendered in the box
                                renderValue={(selected) => selected.join(", ")}
                                MenuProps={MenuProps}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        color: "black",
                                        fontWeight: "bold",
                                    },

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgb(0, 255, 242)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "rgb(0, 255, 242)",
                                        },

                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        { borderColor: "rgb(0, 255, 242)" },

                                    "& .MuiSvgIcon-root": {
                                        color: "rgb(0, 255, 242)",
                                    },
                                }}
                            >
                                {data ? (
                                    data.map((coin) => (
                                        <MenuItem
                                            key={coin.symbol}
                                            value={coin.symbol.toUpperCase()}
                                        >
                                            <Checkbox
                                                checked={
                                                    tags.indexOf(
                                                        coin.symbol.toUpperCase()
                                                    ) > -1
                                                }
                                            />
                                            <ListItemText
                                                primary={coin.symbol.toUpperCase()}
                                            />
                                        </MenuItem>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box
                        display="flex"
                        gap="10px"
                        alignItems="center"
                        paddingBottom="15px"
                    >
                        <Avatar alt={username} src={navBarAvatar} />
                        <Typography
                            fontWeight={500}
                            variant="span"
                            color="gray"
                        >
                            {username}
                        </Typography>
                    </Box>
                    <TextField
                        inputProps={{ maxLength: 20 }}
                        sx={{
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
                        id="standard"
                        placeholder="Title"
                        variant="standard"
                        onChange={(e) => setPostTitle(e.target.value)}
                    />
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
                        onChange={(e) => setPostContent(e.target.value)}
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
                            postContent.length === 0 || postTitle.length === 0
                                ? () =>
                                      toast.error(
                                          "Please ensure that title and content is not empty"
                                      )
                                : () => {
                                      handleAddPost();
                                      toast.success("Post added successfully");
                                      handleClose();
                                  }
                        }
                    >
                        Add Post
                    </Button>
                </Box>
            </StyledModal>
        </>
    );
};

export default AddPost;
