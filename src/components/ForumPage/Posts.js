import { AccessTime } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { ThumbUp } from "@mui/icons-material";
import AddPost from "./AddPost";

const Posts = () => {
    const [posts, setPosts] = useState([]);
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

    //Design decision to put listener inside getPostsAndSubscribe as want to make use of data(posts) that we get from backend, as setPosts is async and has delay
    const getPostsAndSubscribe = async () => {
        try {
            //no single() as ideally we want them to be able to add multiple alerts => return us a []

            const { data, error, status } = await supabase
                .from("posts")
                .select(
                    "id, title, username, content, created_by, created_at, tags"
                );

            if (error && status !== 406) {
                throw error;
            }

            //to display the posts originally without any events e.g. inserts
            setPosts(data);

            //listener
            const mySubscription = supabase
                .from("posts")
                .on("INSERT", (payload) => {
                    console.log("Change received!", payload);

                    data.push(payload.new);
                    setPosts(data);
                })
                .on("DELETE", (payload) => {
                    console.log("Change received!", payload);

                    const removedData = data.filter((post) => {
                        console.log(post.id !== payload.old.id);
                        return post.id !== payload.old.id;
                    });

                    setPosts(removedData);
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

    return (
        <Container>
            <Box className="heading" margin="1rem">
                <Box
                    className="first-row"
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography variant="h1" fontSize="3rem">
                        All Posts
                    </Typography>
                    <Button>Add Post</Button>
                </Box>
                <Typography>{posts.length} questions</Typography>
            </Box>
            <Box
                className="body"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                {posts.map((post) => (
                    <Box
                        className="forEachPost"
                        key={post.id}
                        sx={{ width: { xs: "90%", tablet: "70%", lg: "50%" } }}
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
                            <Typography
                                color="black"
                                variant="h1"
                                fontSize="2rem"
                                fontWeight={500}
                                fontFamily="Poppins"
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
                                            {post.username}
                                        </Typography>

                                        <Box
                                            className="time"
                                            display="flex"
                                            alignItems="center"
                                        >
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
                                                    (date.getTime() / 1000 -
                                                        post.created_at) /
                                                        60
                                                )}{" "}
                                                min ago
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item tablet={6} lg={5}>
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
                                            {post.tags.map((tag) => (
                                                <Grid item xs={4} key={uuid()}>
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
                                                            },
                                                        }}
                                                    >
                                                        {tag}
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Typography color="black" marginTop="1rem">
                                {post.content.toString().substring(0, 220)} ...
                            </Typography>
                            {/* <Box className="interaction" marginTop="1rem">
                                <ThumbUp sx={{ color: "black" }} />
                            </Box> */}
                        </Paper>
                    </Box>
                ))}
            </Box>
            <AddPost />
        </Container>
    );
};

export default Posts;

// import { AccessTime } from "@mui/icons-material";
// import { v4 as uuid } from "uuid";
// import {
//     alertClasses,
//     Button,
//     Container,
//     Grid,
//     Paper,
//     Typography,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import React, { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
// import { ThumbUp } from "@mui/icons-material";

// const Posts = () => {
//     const [posts, setPosts] = useState([]);
//     const [date, setDate] = useState(new Date());

//     function refreshClock() {
//         setDate(new Date());
//     }
//     useEffect(() => {
//         const timerId = setInterval(refreshClock, 1000);
//         return function cleanup() {
//             clearInterval(timerId);
//         };
//     }, []);

//     const getPosts = async () => {
//         try {
//             //no single() as ideally we want them to be able to add multiple alerts => return us a []
//             //from the id column, select the data that meet the user_id and coin_id filter

//             const { data, error, status } = await supabase
//                 .from("posts")
//                 .select(
//                     "id, title, username, content, created_by, created_at, tags"
//                 );

//             if (error && status !== 406) {
//                 throw error;
//             }
//             console.log(data);
//             setPosts(data);
//             console.log(posts);
//         } catch (error) {
//             alert(error.error_description || error.message);
//         }
//     };

//     // use effect for getting posts
//     useEffect(() => {
//         getPosts();
//     }, []);

//     //listener to databse change, initialise it on useeffect
//     useEffect(() => {
//         const mySubscription = supabase
//             .from("posts")
//             .on("INSERT", (payload) => {
//                 console.log("Change received!", payload);

//                 posts.push(payload.new);
//                 setPosts(posts);
//             })
//             .subscribe((status) => console.log(status));

//         //clean up
//         return () => {
//             supabase.removeSubscription(mySubscription);
//         };
//     }, []);

//     return (
//         <Container>
//             <Box className="heading" margin="1rem">
//                 <Box
//                     className="first-row"
//                     display="flex"
//                     justifyContent="space-between"
//                 >
//                     <Typography variant="h1" fontSize="3rem">
//                         All Posts
//                     </Typography>
//                     <Button>Add Post</Button>
//                 </Box>
//                 <Typography>{posts.length} questions</Typography>
//             </Box>
//             <Box
//                 className="body"
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="center"
//             >
//                 {posts.map((post) => (
//                     <Box
//                         className="forEachPost"
//                         key={post.id}
//                         sx={{ width: { xs: "90%", tablet: "70%", lg: "50%" } }}
//                         margin="0.5rem"
//                     >
//                         <Paper
//                             sx={{
//                                 "&.MuiPaper-root": {
//                                     backgroundColor: "rgb(240, 240, 240)",
//                                     borderRadius: "1rem",
//                                     height: {
//                                         xs: "25rem",
//                                         tablet: "17rem",
//                                         lg: "15rem",
//                                     },

//                                     padding: "1.5rem",
//                                 },
//                             }}
//                         >
//                             <Typography
//                                 color="black"
//                                 variant="h1"
//                                 fontSize="2rem"
//                                 fontWeight={500}
//                                 fontFamily="Poppins"
//                             >
//                                 {post.title}
//                             </Typography>

//                             <Grid
//                                 container
//                                 className="container-for-by-who-and-tags"
//                                 justifyContent="space-between"
//                             >
//                                 <Grid item xs={6}>
//                                     <Box className="by-who">
//                                         <Typography
//                                             fontFamily="Poppins"
//                                             color="black"
//                                             display="flex"
//                                             flexDirection="column"
//                                         >
//                                             {post.username}
//                                         </Typography>

//                                         <Box
//                                             className="time"
//                                             display="flex"
//                                             alignItems="center"
//                                         >
//                                             <AccessTime
//                                                 sx={{
//                                                     color: "black",
//                                                     width: 12.5,
//                                                 }}
//                                             />

//                                             <Typography
//                                                 color="black"
//                                                 variant="body2"
//                                                 component="p"
//                                                 marginLeft={0.5}
//                                             >
//                                                 {Math.ceil(
//                                                     //because in milliseconds
//                                                     (date.getTime() / 1000 -
//                                                         post.created_at) /
//                                                         60
//                                                 )}{" "}
//                                                 min ago
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Grid>
//                                 <Grid item tablet={6} lg={5}>
//                                     <Box
//                                         className="tags"
//                                         sx={{
//                                             display: {
//                                                 xs: "none",
//                                                 tablet: "block",
//                                             },
//                                         }}
//                                     >
//                                         <Grid
//                                             container
//                                             className="tags"
//                                             justifyContent="flex-end"
//                                         >
//                                             {post.tags.map((tag) => (
//                                                 <Grid item xs={4} key={uuid()}>
//                                                     <Paper
//                                                         sx={{
//                                                             textAlign: "center",
//                                                             "&.MuiPaper-root": {
//                                                                 backgroundColor:
//                                                                     "rgb(0, 255, 242)",
//                                                                 width: "4rem",
//                                                                 borderRadius:
//                                                                     "0.5rem",
//                                                                 margin: "0.2rem",
//                                                             },
//                                                         }}
//                                                     >
//                                                         {tag}
//                                                     </Paper>
//                                                 </Grid>
//                                             ))}
//                                         </Grid>
//                                     </Box>
//                                 </Grid>
//                             </Grid>
//                             <Typography color="black" marginTop="1rem">
//                                 {post.content.toString().substring(0, 220)} ...
//                             </Typography>
//                             {/* <Box className="interaction" marginTop="1rem">
//                                 <ThumbUp sx={{ color: "black" }} />
//                             </Box> */}
//                         </Paper>
//                     </Box>
//                 ))}
//             </Box>
//         </Container>
//     );
// };

// export default Posts;
