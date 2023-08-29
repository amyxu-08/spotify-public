import "./DiscoveryPage.css";
import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Container,
  TextField,
  Popover,
  CardHeader,
} from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CommentIcon from "@mui/icons-material/Comment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../app/firebase";
// navigation
import { useNavigate } from "react-router-dom";
import { RouteLocations } from "../../app/RouteLocations";
// firestore
import {
  getDocs,
  collection, 
  addDoc, 
  doc,
} from 'firebase/firestore';
import { db } from "../../app/firebase";

export default function DiscoveryPage() {
  const [info, setInfo] = useState();
  const [search, setSearch] = useState("");
  const [filteredInfo, setFilteredInfo] = useState();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

  // navigation
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/userInfo")
      .then((res) => res.json())
      .then((text) => {
        const filteredData = text.result.filter((data) => !data.isPrivate);
        setInfo(filteredData);
        console.log(filteredData);
        setFilteredInfo(filteredData);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleSearch(event) {
    setSearch(event.target.value);
    setFilteredInfo(
      info.filter((data) =>
        data.displayName
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
  }

  function handleViewProfileButtonClick(event, index) {
    setPopoverAnchorEl(index);
    setPopoverOpen(true);
  }

  function handlePopoverClose() {
    setPopoverOpen(false);
  }

  const createNewChatIfNecessary = async (otherPerson) => {
    // get all of the chats
    const chats = await getDocs(collection(db, "chats"));
    // for each chat, check if the chat has both the current user and the person they want to chat with
    const chatData = chats.docs.map((doc) => doc.data());
    const chatExists = chatData.some((chat) => {
      return (
        chat.people.includes(auth.currentUser.displayName) &&
        chat.people.includes(otherPerson)
      );
    }
    );
    // if the chat exists, then navigate them
    if (chatExists) {
      navigate(RouteLocations.chat + `/${otherPerson}`);
    } else {
      // if the chat doesn't exist, create a new chat
      const newChat = await addDoc(collection(db, "chats"), {
        people: [auth.currentUser.displayName, otherPerson],
        conversation: [],
      });
      // navigate them to the new chat
      navigate(RouteLocations.chat + `/${otherPerson}`);
    }
  }

  function renderCard(data, index) {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Card
          className="discoveryCard"
          style={{ backgroundColor: "var(--light-green)" }}
        >
          <div className="cardMediaContainer">
            <CardMedia className="cardMedia" image={data.spotifyProfilePic} />
          </div>
          <Card
            className="cardContentContainer"
            style={{ backgroundColor: "var(--dark-green)" }}
          >
            <CardContent style={{ paddingTop: "16px", paddingBottom: "0px" }}>
              <Typography
                className="textColor"
                gutterBottom
                variant="h5"
                component="div"
              >
                {data.displayName}
              </Typography>
              <Typography
                className="textColor"
                variant="body2"
                color="text.secondary"
              >
                {data.spotifyUsername}
              </Typography>
            </CardContent>

            <CardActions>
              <Button
                size="medium"
                onClick={(event) => handleViewProfileButtonClick(event, index)}
              >
                <AccountBoxIcon
                  fontSize="large"
                  style={{ color: "var(--cream)" }}
                />
              </Button>
              <Popover
                open={popoverOpen && popoverAnchorEl === index}
                onClose={handlePopoverClose}
                anchorReference="anchorPosition"
                anchorPosition={{
                  top: window.innerHeight / 2,
                  left: window.innerWidth / 2,
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
              >
                <Container
                  maxWidth="fullWidth"
                  style={{
                    backgroundColor: "var(--light-green)",
                    padding: "0px",
                  }}
                >
                  <CardContent align="center">
                    <Grid container spacing={2} direction="column">
                      <Grid item>
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <CardMedia
                              className="profileImage"
                              image={data.spotifyProfilePic}
                              style={{
                                width: 100,
                                height: 100,
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <Typography
                              className="textColor"
                              variant="subtitle1"
                            >
                              {data.displayName}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          className="infoContainer"
                          direction="column"
                          spacing={1}
                        >
                          <Grid
                            className="infoItem"
                            item
                            container
                            justifyContent="space-between"
                          >
                            <Grid item>
                              <Typography
                                className="infoTextColor"
                                variant="body2"
                              >
                                User
                              </Typography>
                            </Grid>
                            <Grid item style={{ marginLeft: "auto" }}>
                              <Typography
                                className="infoTextColor"
                                variant="body2"
                              >
                                {data.spotifyUsername}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            className="infoItem"
                            item
                            container
                            justifyContent="space-between"
                          >
                            <Grid item>
                              <Typography
                                className="infoTextColor"
                                variant="body2"
                              >
                                Followers
                              </Typography>
                            </Grid>
                            <Grid item style={{ marginLeft: "auto" }}>
                              <Typography
                                className="infoTextColor"
                                variant="body2"
                              >
                                {data.spotifyFollowers}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            className="infoItem"
                            item
                            container
                            justifyContent="space-between"
                          >
                            <Grid item>
                              <Typography
                                className="infoTextColor"
                                variant="body2"
                              >
                                Region
                              </Typography>
                            </Grid>
                            <Grid item style={{ marginLeft: "auto" }}>
                              <Typography
                                className="infoTextColor"
                                variant="body2"
                              >
                                {data.spotifyCountry}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Grid item xs={6}>
                            <Card
                              className="infoCard"
                              style={{ backgroundColor: "var(--dark-green)" }}
                            >
                              <CardHeader
                                title={
                                  <Typography
                                    className="headerTextColor"
                                    variant="subtitle2"
                                    style={{
                                      backgroundColor: "var(--cream)",
                                      padding: "8px",
                                    }}
                                  >
                                    Top Artists
                                  </Typography>
                                }
                              />
                              <CardContent
                                style={{
                                  paddingTop: "0px",
                                  flex: "1",
                                }}
                              >
                                {data && data.spotifyTopArtists && (
                                  <Grid
                                    container
                                    direction="column"
                                    spacing={1}
                                  >
                                    {data.spotifyTopArtists
                                      .slice(0, 5)
                                      .map((artist) => (
                                        <Grid item key={artist}>
                                          <Typography
                                            variant="subtitle2"
                                            className="textColor"
                                          >
                                            {artist}
                                          </Typography>
                                        </Grid>
                                      ))}
                                  </Grid>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={6}>
                            <Card
                              className="infoCard"
                              style={{ backgroundColor: "var(--dark-green)" }}
                            >
                              <CardHeader
                                title={
                                  <Typography
                                    className="headerTextColor"
                                    variant="subtitle2"
                                    style={{
                                      backgroundColor: "var(--cream)",
                                      padding: "8px",
                                    }}
                                  >
                                    Top Songs
                                  </Typography>
                                }
                              />
                              <CardContent
                                style={{
                                  paddingTop: "0px",
                                  flex: "1",
                                }}
                              >
                                {data && data.spotifyTopSongs && (
                                  <Grid
                                    container
                                    direction="column"
                                    spacing={1}
                                  >
                                    {data.spotifyTopSongs
                                      .slice(0, 5)
                                      .map((song) => (
                                        <Grid item key={song}>
                                          <Typography
                                            variant="subtitle2"
                                            className="textColor"
                                          >
                                            {song.name} - {song.artist}
                                          </Typography>
                                        </Grid>
                                      ))}
                                  </Grid>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Container>
              </Popover>
              {auth.currentUser  && auth.currentUser.displayName !== data.displayName && (
                // <Link to={"/discovery/chat/" + data.displayName}>
                  <Button size="medium" onClick={() => { 
                    createNewChatIfNecessary(data.displayName);
              
                  }}>
                    <CommentIcon
                      fontSize="large"
                      style={{ color: "var(--cream)" }}
                    />
                  </Button>
                // </Link>
              )}
            </CardActions>
          </Card>
        </Card>
      </Grid>
    );
  }

  return (
    <>
      <main>
        <div className="discoveryPage">
          <Typography className="headerColor" variant="h2" gutterBottom>
            Discovery page
          </Typography>
        </div>
        <Grid
          container
          style={{
            marginLeft: "20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "nowrap",
          }}
          spacing={2}
        >
          <Grid item>
            <SearchIcon></SearchIcon>
          </Grid>
          <Grid item>
            <TextField
              value={search}
              placeholder="Find user"
              onChange={(event) => handleSearch(event)}
            ></TextField>
          </Grid>
        </Grid>
        <Container maxWidth="fullWidth">
          <Grid container className="cardGrid" spacing={3}>
            {search === ""
              ? info && info.map((data, index) => renderCard(data, index))
              : filteredInfo.map((data, index) => renderCard(data, index))}
          </Grid>
        </Container>
      </main>
    </>
  );
}
