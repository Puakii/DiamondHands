import { AccessTime } from "@mui/icons-material";
import { v4 as uuid } from "uuid";

import {
    Container,
    Grid,
    Paper,
    TablePagination,
    TextField,
    Typography,
} from "@mui/material";

import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import axios from "axios";
import AddPost from "./AddPost";
import { CoinList } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useCryptoState } from "../../context/CryptoContext";

const Posts = () => {
    const navigate = useNavigate();

    //for posts
    const [posts, setPosts] = useState([]);

    //for cryptodata from api
    const [data, setData] = useState(null);

    //For timing of post
    const [date, setDate] = useState(new Date());

    //default state for search should be "" instead of null .includes will
    //return true for "" but false for null
    const [search, setSearch] = useState("");

    // for pagination
    const [page, setPage] = useState(0);
    const [postsPerPage, setPostsPerPage] = useState(10);
    //To keep track of number of results after filter to be used for pagination
    const [numOfResult, setNumberOfResult] = useState(0);

    const { username } = useCryptoState();

    function refreshClock() {
        setDate(new Date());
    }
    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    //custom sort post by time, earliest first
    function customPostSorter(inputArray) {
        return inputArray.sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }

    //Design decision to put listener inside getPostsAndSubscribe as want to make use of data(posts) that we get from backend, as setPosts is async and has delay
    const getPostsAndSubscribe = async () => {
        try {
            //no single() as ideally we want them to be able to add multiple alerts => return us a []
            //created_by(username) foreign table query(profile table)
            //use let as we want to reassign data
            let { data, error, status } = await supabase
                .from("posts")
                .select(
                    "id, title, content, created_by(username), created_at, tags"
                );

            if (error && status !== 406) {
                throw error;
            }

            //sort the data, then display the posts originally without any events e.g. inserts
            setPosts(customPostSorter(data));

            //listener
            const mySubscription = supabase
                .from("posts")
                .on("INSERT", (payload) => {
                    console.log("Change received!", payload);

                    data.push(payload.new);
                    setPosts(customPostSorter(data));
                })
                .on("DELETE", (payload) => {
                    console.log("Change received!", payload);

                    const removedData = data.filter((post) => {
                        return post.id !== payload.old.id;
                    });
                    //data need to be reassigned if not 2 subsequent delete will fail as
                    //
                    data = removedData;

                    setPosts(customPostSorter(data));
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

    // use effect for getting posts
    useEffect(() => {
        getPostsAndSubscribe();
    }, []);

    function refreshPrices(currency) {
        axios
            .get(CoinList(currency))
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        //currency doesnt matter, we just want the data for the select tagging button
        refreshPrices("USD");

        const timerId = setInterval(() => refreshPrices("USD"), 5000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    //for search function
    const handleSearch = (inputData) => {
        const filteredData = inputData.filter(
            (post) =>
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.tags.includes(search.toUpperCase())
        );

        // //if condition is required if not will result in continous rendering because it will keep setting number of result, we only want to setNumberOfResult when there is something being filtered, and after filtered we want it to stop
        if (numOfResult !== filteredData.length) {
            setNumberOfResult(filteredData.length);
        }

        return filteredData;
    };

    //For search function
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    //for pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPostsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    console.log(posts);
    return (
        <Container>
            <Box className="heading" margin="1rem">
                <Box
                    className="first-row"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Typography
                        variant="h1"
                        fontWeight="bold"
                        fontSize="3rem"
                        fontFamily="Poppins"
                    >
                        All Posts
                    </Typography>

                    {posts.length > 0 ? (
                        <Typography fontFamily="Poppins">
                            {posts.length} posts
                        </Typography>
                    ) : (
                        <Typography fontFamily="Poppins">
                            {posts.length} post
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box
                className="body"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <TextField
                    label="Search For a Post by Title or Tag.."
                    variant="standard"
                    sx={{
                        marginBottom: "1rem",

                        width: { xs: "90%", tablet: "70%", lg: "50%" },
                    }}
                    onChange={handleChangeSearch}
                />

                {handleSearch(posts)
                    .slice(
                        page * postsPerPage,
                        page * postsPerPage + postsPerPage
                    )
                    .map((post) => (
                        <Box
                            className="forEachPost"
                            key={post.id}
                            sx={{
                                width: { xs: "90%", tablet: "70%", lg: "50%" },
                                cursor: "pointer",
                            }}
                            margin="0.5rem"
                            onClick={() => navigate(`/forum/posts/${post.id}`)}
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
                                <Typography
                                    color="black"
                                    variant="h1"
                                    fontSize="2rem"
                                    fontWeight={500}
                                    fontFamily="Poppins"
                                    marginBottom={0.5}
                                    style={{ wordWrap: "break-word" }}
                                >
                                    {post.title}
                                </Typography>

                                <Grid
                                    container
                                    className="container-for-by-who-and-tags"
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
                                                {post.created_by.username ||
                                                    username}
                                            </Typography>

                                            <Box
                                                className="time"
                                                display="flex"
                                                alignItems="center"
                                            >
                                                {Math.ceil(
                                                    (date.getTime() -
                                                        new Date(
                                                            post.created_at
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
                                                      (date.getTime() -
                                                          new Date(
                                                              post.created_at
                                                          )) /
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
                                                            color="black"
                                                            variant="body2"
                                                            component="p"
                                                            marginLeft={0.5}
                                                        >
                                                            {Math.ceil(
                                                                (date.getTime() -
                                                                    new Date(
                                                                        post.created_at
                                                                    )) /
                                                                    86400000
                                                            )}{" "}
                                                            days ago
                                                        </Typography>
                                                    </>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item tablet={6} lg={6}>
                                        <Box
                                            className="tags"
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    tablet: "block",
                                                },
                                            }}
                                        >
                                            <Grid
                                                container
                                                className="tags"
                                                justifyContent="flex-end"
                                            >
                                                {post.tags
                                                    .slice(0, 3)
                                                    .map((tag) => (
                                                        <Grid
                                                            item
                                                            xs={3}
                                                            key={uuid()}
                                                        >
                                                            <Paper
                                                                sx={{
                                                                    textAlign:
                                                                        "center",
                                                                    "&.MuiPaper-root":
                                                                        {
                                                                            backgroundColor:
                                                                                "rgb(0, 255, 242)",
                                                                            width: "4rem",
                                                                            borderRadius:
                                                                                "0.5rem",
                                                                            margin: "0.2rem",
                                                                            color: "black",
                                                                        },
                                                                }}
                                                            >
                                                                {tag}
                                                            </Paper>
                                                        </Grid>
                                                    ))}

                                                {post.tags.length > 3 ? (
                                                    <Paper
                                                        sx={{
                                                            textAlign: "center",
                                                            "&.MuiPaper-root": {
                                                                backgroundColor:
                                                                    "rgb(0, 255, 242)",
                                                                width: "4rem",
                                                                borderRadius:
                                                                    "0.5rem",
                                                                margin: "0.2rem",
                                                                color: "black",
                                                            },
                                                        }}
                                                    >
                                                        +{post.tags.length - 3}
                                                    </Paper>
                                                ) : (
                                                    <></>
                                                )}
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box>
                                    {post.content.toString().length <= 200 ? (
                                        <Typography
                                            color="black"
                                            marginTop="1rem"
                                            style={{ wordWrap: "break-word" }}
                                        >
                                            {post.content.toString()}
                                        </Typography>
                                    ) : (
                                        <Typography
                                            color="black"
                                            marginTop="1rem"
                                            style={{ wordWrap: "break-word" }}
                                        >
                                            {post.content
                                                .toString()
                                                .substring(0, 220)}{" "}
                                            ...
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    ))}
            </Box>
            <TablePagination
                component="div"
                count={numOfResult}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={postsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <AddPost data={data} />
        </Container>
    );
};

export default Posts;
