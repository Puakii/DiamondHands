import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid,
    Paper,
    Box,
    ThemeProvider,
    Typography,
    Container,
    Button,
} from "@mui/material";
import "./News.css";
import { AccessTime } from "@mui/icons-material";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { FetchNews } from "../config/api";

let theme = createTheme();
theme = responsiveFontSizes(theme);

const News = () => {
    const [news, setNews] = useState(null);
    const [date, setDate] = useState(new Date());
    const [click, setClick] = useState(false);

    function refreshClock() {
        setDate(new Date());
    }
    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    useEffect(() => {
        if (!news) {
            axios
                .get(FetchNews(""))
                .then((response) => {
                    setNews(response.data.Data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        if (click) {
            axios
                .get(FetchNews(news[news.length - 1].published_on))
                .then((response) => {
                    setNews(news.concat(response.data.Data));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setClick(false);
    }, [click, news]);
    console.log(news);

    if (!news) return null;

    return (
        <>
            <Container>
                <Box
                    border={1}
                    borderColor="black"
                    sx={{
                        backgroundColor: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    marginBottom={1}
                >
                    <Typography variant="h2" color="black" fontWeight={800}>
                        Latest News
                    </Typography>
                </Box>
                <Grid container spacing={5}>
                    <ThemeProvider theme={theme}>
                        {news.map((article) => {
                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={article.id}
                                >
                                    <Paper
                                        elevation={3}
                                        style={{
                                            backgroundColor: "white",
                                            height: "650px",
                                            display: "flex",
                                        }}
                                    >
                                        <a href={article.url}>
                                            <Container
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                                style={{
                                                    padding: 0,
                                                }}
                                            >
                                                <img
                                                    src={article.imageurl}
                                                    alt=""
                                                    className="img"
                                                />
                                                <Box
                                                    sx={{
                                                        paddingX: 1,
                                                    }}
                                                    marginTop={1}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        component="h2"
                                                        sx={{
                                                            fontWeight: 800,
                                                            fontSize: 19,
                                                        }}
                                                    >
                                                        {article.title}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        paddingX: 1,
                                                    }}
                                                    marginTop={2}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        component="p"
                                                    >
                                                        {article.body.substring(
                                                            0,
                                                            125
                                                        )}
                                                        ...
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        paddingX: 1,
                                                        marginTop: "auto",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        component="h2"
                                                        style={{
                                                            alignItems: "right",
                                                        }}
                                                    >
                                                        By{" "}
                                                        {
                                                            article.source_info
                                                                .name
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        paddingX: 1,
                                                        paddingBottom: 1,

                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {Math.ceil(
                                                        (date.getTime() / 1000 -
                                                            article.published_on) /
                                                            60
                                                    ) < 60 ? (
                                                        <>
                                                            <AccessTime
                                                                style={{
                                                                    width: 12.5,
                                                                }}
                                                            />

                                                            <Typography
                                                                variant="body2"
                                                                component="p"
                                                                marginLeft={0.5}
                                                            >
                                                                {Math.ceil(
                                                                    (date.getTime() /
                                                                        1000 -
                                                                        article.published_on) /
                                                                        60
                                                                )}{" "}
                                                                min ago
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AccessTime
                                                                style={{
                                                                    width: 12.5,
                                                                }}
                                                            />

                                                            <Typography
                                                                variant="body2"
                                                                component="p"
                                                                marginLeft={0.5}
                                                            >
                                                                {Math.ceil(
                                                                    (date.getTime() /
                                                                        1000 -
                                                                        article.published_on) /
                                                                        3600
                                                                )}{" "}
                                                                hours ago
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>
                                            </Container>
                                        </a>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </ThemeProvider>
                </Grid>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        sx={{
                            backgroundColor: "var(--primary)",
                            width: "50%",
                            marginY: 2,
                        }}
                        onClick={() => setClick(true)}
                    >
                        <Typography
                            variant="body1"
                            color="black"
                            fontWeight={800}
                        >
                            Load more articles
                        </Typography>
                    </Button>
                </Box>
            </Container>
        </>
    );
    // <TableContainer
    //     // className="tableContainer"
    //     style={{
    //         width: "100%",
    //     }}
    // >
    //     {loading ? (
    //         <LinearProgress style={{ backgroundColor: "var(--primary)" }} />
    //     ) : (
    //         <Table>
    //             <TableHead
    //                 style={{
    //                     backgroundColor: "var(--primary)",
    //                 }}
    //             >
    //                 <TableRow>
    //                     <TableCell
    //                         sx={{
    //                             color: "black",
    //                             fontWeight: "700",
    //                             fontFamily: "Montserrat",
    //                         }}
    //                         align={"center"}
    //                     >
    //                         Current News
    //                     </TableCell>
    //                 </TableRow>
    //             </TableHead>

    //             <TableBody>
    //                 {news.Data.map((article) => {
    //                     return (
    //                         <TableRow
    //                             sx={{
    //                                 "&: hover": {
    //                                     backgroundColor: "#16171a",
    //                                 },
    //                             }}
    //                             className="coin-row"
    //                             key={article.title}
    //                         >
    //                             <TableCell
    //                                 // specify component and scope for semantics
    //                                 component="th"
    //                                 scope="row"
    //                                 sx={{
    //                                     display: "flex",
    //                                     columnGap: "15px",
    //                                     position: "sticky",
    //                                     left: 0,
    //                                     backgroundColor: "#121212",
    //                                 }}
    //                             >
    //                                 <a href={article.url}>
    //                                     <img
    //                                         src={article?.imageurl}
    //                                         alt={article.source_info.name}
    //                                         height="50"
    //                                         style={{
    //                                             marginBottom: 10,
    //                                         }}
    //                                     />

    //                                     <div
    //                                         style={{
    //                                             display: "flex",
    //                                             flexDirection: "column",
    //                                         }}
    //                                     >
    //                                         <span
    //                                             style={{
    //                                                 textTransform:
    //                                                     "uppercase",
    //                                                 fontSize: 22,
    //                                             }}
    //                                         >
    //                                             {article.title}
    //                                         </span>

    //                                         <span
    //                                             style={{
    //                                                 color: "darkgrey",
    //                                                 fontSize: 13,
    //                                             }}
    //                                         >
    //                                             {article.body}
    //                                         </span>
    //                                     </div>
    //                                 </a>
    //                             </TableCell>
    //                         </TableRow>
    //                     );
    //                 })}
    //             </TableBody>
    //         </Table>
    //     )}
    // </TableContainer>
};

export default News;
