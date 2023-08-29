import "./ForumsPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Topics from "./Topics";
import { Button, TextField, Box, Grid, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { auth } from "../../app/firebase";

export default function ForumsPage() {
  const [info, setInfo] = useState([]);
  const [dictionary, setDictionary] = useState({});
  //const [allTopics, setAllTopics] = useState([]);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [allUsers, setAllUsers] = useState(null);
  //const [clicked, setClicked] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log(info);
    const dictionary = {};
    info.forEach((obj) => {
      const { topic, ...rest } = obj;
      if (dictionary[topic]) {
        dictionary[topic].push(rest);
      } else {
        dictionary[topic] = [rest];
      }
    });
    console.log(dictionary);
    setDictionary(dictionary);
    //setAllTopics(Object.keys(dictionary))
    //console.log(allTopics)
  }, [info]);

  useEffect(() => {
    fetch("http://localhost:9000/demo/info")
      .then((res) => res.json())
      .then((text) => setInfo(text.result))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/demo/users");
        setAllUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  /*useEffect(() => {

    axios.get()
    .then((res) => res.json())
    .then((text) => setAllUsers(text.result))
    .then((text) => console.log(text.result))
    .catch((err) => console.log(err))
  }, [])*/

  //console.log(auth.currentUser.uid)

  const handleSubmit = async (e) => {
    //alert("submitted");
    var display = "Anon";
    if (displayName !== "") {
      display = displayName;
    }
    axios
      .post("http://localhost:9000/demo/post", {
        title: title,
        text: text,
        topic: topic,
        user: display,
        likes: 0,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTopics = Object.keys(dictionary).reduce((result, topic) => {
    if (topic.toLowerCase().includes(searchTerm.toLowerCase())) {
      result[topic] = dictionary[topic];
    }
    return result;
  }, {});

  const placeHolder = () => {
    return <p>You are not logged in</p>;
  };

  useEffect(() => {
    if (!auth.currentUser) {
      placeHolder();
    } else if (auth.currentUser && allUsers) {
      console.log("inside");
      console.log(auth.currentUser.uid);
      console.log(allUsers);
      console.log(allUsers.result.uid);
      const matchUser = allUsers.result.find(
        (user) => user.uid === auth.currentUser.uid
      );
      console.log(matchUser);
      console.log(matchUser.displayName);
      setDisplayName(matchUser.displayName);
    }
  }, [allUsers]);

  return (
    <>
      <main>
        <Typography
          className="title-text"
          variant="h2"
          sx={{ marginTop: "50px", marginBottom: "50px" }}
          gutterBottom
        >
          Forums
        </Typography>
        <div className="all-elem">
          <div className="center-div">
            <Box
              overflow="auto"
              maxHeight={500}
              borderRadius={4}
              minHeight={370}
              style={{ width: "100%" }}
              p={2}
              m={2}
              bgcolor="#606c38"
              //border={10}
            >
              <h2 style={{ color: "#fefae0", fontWeight: "bold" }}>
                Browse Existing Forums
              </h2>
              <Grid
                container
                style={{
                  //marginLeft: "30px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "nowrap",
                  marginTop: "10px",
                }}
                spacing={2}
              >
                <Grid item>
                  <SearchIcon sx={{ color: "#fefae0" }}></SearchIcon>
                </Grid>
                <Grid item style={{ width: "70%", marginBottom: "10px" }}>
                  <TextField
                    placeholder="Search Topics"
                    value={searchTerm}
                    onChange={handleSearch}
                    variant="standard"
                    className="custom-textfield"
                    fullWidth
                    //color="#fefae0"
                  />
                </Grid>
              </Grid>
              {dictionary &&
                Object.entries(filteredTopics).map(([topic, data]) => (
                  <Topics topic={topic} data={data} />
                ))}
            </Box>
            <div>
              <Box
                overflow="auto"
                maxHeight={550}
                border={1}
                borderRadius={4}
                p={2}
                m={2}
                style={{ width: "100%" }}
              >
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontWeight: "bold" }}>Create Your Own</h2>
                  <TextField
                    label="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ bgcolor: "#283618" }}
                  >
                    Submit
                  </Button>
                </form>
              </Box>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
