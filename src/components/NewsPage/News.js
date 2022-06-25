import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Paper, Box, Typography, Container, Button } from "@mui/material";

import { AccessTime } from "@mui/icons-material";

import { FetchNews } from "../../config/api";

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
                //get the news that is before the timing(news[news.length - 1] is the earliest news of the first 50)
                .get(FetchNews(news[news.length - 1].published_on))
                .then((response) => {
                    setNews(news.concat(response.data.Data));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setClick(false);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [click]);

    console.log(news);

    if (!news) return null;

    return (
        <>
            <Container>
                <Box
                    sx={{
                        backgroundColor: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    marginBottom="2%"
                    marginTop="2%"
                >
                    <Typography
                        variant="h2"
                        color="black"
                        fontWeight={800}
                        fontFamily="Montserrat"
                    >
                        Latest News
                    </Typography>
                </Box>
                <Grid container spacing={5}>
                    {news.map((article) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={article.id}>
                                <Paper
                                    elevation={3}
                                    style={{
                                        backgroundColor: "white",
                                        height: "650px",
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
                                                alt={article.source}
                                                style={{
                                                    width: "100%",
                                                    height: "50%",
                                                }}
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
                                                >
                                                    By{" "}
                                                    {article.source_info.name}
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
                                                            sx={{
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
                                                            sx={{
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
};

export default News;
