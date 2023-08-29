import { Box } from "@mui/material";
import { useState, useEffect } from "react";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { IconButton } from "@mui/material";

import { doc, increment, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase";

function Post(props) {
  const [info, setInfo] = useState(null);
  const [ids, setIds] = useState(null);

  const [postID, setPostID] = useState("");

  const [votes, setVotes] = useState(props.likes);
  const [userVote, setUserVote] = useState(0);
  const [responseRef, setResponseRef] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9000/demo/info")
      .then((res) => res.json())
      .then((text) => setInfo(text.result))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:9000/demo/infoIDs")
      .then((res) => res.json())
      .then((text) => setIds(text.result))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("info", info);
    console.log("ids", ids);

    if (info && ids) {
      const mergedArray = info.map((obj, index) => {
        return { ...obj, id: ids[index] };
      });
      //setMergedInfo(mergedArray);
      console.log(mergedArray);

      const pID = mergedArray.find(
        (obj) =>
          obj.title === props.title &&
          obj.user === props.user &&
          obj.text === props.text
      );

      //setPostID(pID.id);
      //console.log(postID)
      //console.log(typeof postID)
      console.log(pID.id);

      const postRef = doc(db, "forums", pID.id);
      setResponseRef(postRef);
    }
  }, [info, ids]);

  const incrementVote = async () => {
    try {
      await updateDoc(responseRef, {
        likes: increment(1),
      });
      setVotes(votes + 1);
      setUserVote(1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        color="black"
        p={2}
        m={2}
        textAlign="center"
        bgcolor="#fefae0"
        boxShadow={3}
        style={{ cursor: "pointer", minWidth: "20vw" }}
      >
        <h2>
          <strong>{props.title}</strong>
        </h2>
        <p>
          {props.user} says "{props.text}"
        </p>
        <p>{votes} likes</p>
        <IconButton
          aria-label="upvote"
          size="large"
          onClick={incrementVote}
          disabled={userVote === 1}
        >
          <ThumbUpIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </>
  );
}

export default Post;
