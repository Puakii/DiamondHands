import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/EntireWebsite/Navbar";
import IndividualPost from "../components/ForumPage/IndividualPost";

const IndivForumPage = () => {
    const { postId } = useParams();

    return (
        <>
            <Navbar />
            <IndividualPost postId={postId} />
        </>
    );
};

export default IndivForumPage;
