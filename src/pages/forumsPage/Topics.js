import { Box, Dialog, Modal, DialogTitle, DialogContent } from "@mui/material";
import { useState } from "react";
import Post from "./Post";
import "./Topics.css";

function Topics(props) {
  console.log(props.data);

  const buttonClick = () => {
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "#283618",
    //boxShadow: 24,
    overflow: "auto",
    maxHeight: 550,
    p: 4,
  };

  return (
    <>
      <Box
        onClick={buttonClick}
        color="#fefae0"
        p={2}
        m={2}
        textAlign="center"
        bgcolor="#283618"
        //boxShadow={3}
        style={{ cursor: "pointer", minWidth: "25vw" }}
      >
        <h2>{props.topic}</h2>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        //width={400}
        //className="custom-dialog"
      >
        {/*<DialogTitle>{props.topic}</DialogTitle>*/}
        {/*<DialogContent className="custom-dialog">*/}
        <Box sx={style}>
          {props.data === null ? (
            <p>Loading</p>
          ) : (
            props.data.map((item) => (
              <Post
                title={item.title}
                text={item.text}
                user={item.user}
                likes={item.likes}
              />
            ))
          )}
        </Box>
        {/*</DialogContent>*/}
      </Modal>
    </>
  );
}

export default Topics;
