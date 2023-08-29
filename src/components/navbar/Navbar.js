import "./Navbar.css";
// firebase stuff
import { auth } from "../../app/firebase";
// navigation
import { RouteLocations } from "../../app/RouteLocations";
import { Route, useNavigate } from "react-router-dom";
// assets
import DefaultProfile from "../../assets/DefaultProfile.svg";
import thumbsup from "../../assets/thumbsup.svg";
import spotify from "../../assets/spotify.svg";
// react
import { useState, useEffect } from "react";
// mui
import {
  IconButton,
  MenuIcon,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function Navbar() {
  const navigate = useNavigate();
  const signOut = () => {
    auth.signOut().then(() => {
      navigate(RouteLocations.login);
    });
  };

  const signIn = () => {
    navigate(RouteLocations.login);
  };

  // get the auth tokewn from the user
  const getToken = async () => {
    const token = await auth.currentUser.getIdToken(true);
    console.log(token);
  };

  // when the user exists and the user's photoURL exists, then set the profile pic to the user's photoURL
  // const [profilePic, setProfilePic] = useState("");
  // useEffect(() => {
  //   if (auth.currentUser && auth.currentUser.photoURL) {
  //     setProfilePic(auth.currentUser.photoURL);
  //   }
  // }, [auth.currentUser]);

  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const [profilePic, setProfilePic] = useState("");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setProfilePic(user.photoURL);
      } else {
        setProfilePic(DefaultProfile);
      }
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          src={spotify}
          className="navbar-left-logo"
          onClick={() => {
            navigate(RouteLocations.discovery);
          }}
        />
        <p
          className="navbar-left-title"
          onClick={() => {
            navigate(RouteLocations.discovery);
          }}
        >
          {" "}
          Spotify Connect{" "}
        </p>
      </div>
      <div className="navbar-right">
        {window.location
          .toString()
          .startsWith("http://localhost:3000" + RouteLocations.profile) && (
          <>
            <p
              className="navbar-right-text"
              onClick={() => {
                navigate(RouteLocations.likedSongs);
              }}
              style={
                window.location.toString().includes("liked-songs")
                  ? { opacity: 1 }
                  : { opacity: 0.5 }
              }
            >
              Liked Songs
            </p>
            <p
              className="navbar-right-text"
              onClick={() => {
                navigate(RouteLocations.topSongs);
              }}
              style={
                window.location.toString().includes("topSongs")
                  ? { opacity: 1 }
                  : { opacity: 0.5 }
              }
            >
              Top Songs
            </p>
            <p
              className="navbar-right-text"
              onClick={() => {
                navigate(RouteLocations.topArtists);
              }}
              style={
                window.location.toString().includes("topArtists")
                  ? { opacity: 1 }
                  : { opacity: 0.5 }
              }
            >
              Top Artists
            </p>
          </>
        )}
        <p
          className="navbar-right-text"
          onClick={() => {
            navigate(RouteLocations.forums);
          }}
          style={
            window.location.toString().includes("forums")
              ? { opacity: 1 }
              : { opacity: 0.5 }
          }
        >
          Forums
        </p>
        <img
          className="navbar-profile-picture"
          src={profilePic}
          onClick={() => {
            auth.currentUser
              ? navigate(RouteLocations.profile)
              : navigate(RouteLocations.login);
          }}
        />

        {auth.currentUser ? (
          <svg
            onClick={signOut}
            className="navbar-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14 20H6C4.89543 20 4 19.1046 4 18L4 6C4 4.89543 4.89543 4 6 4H14M10 12H21M21 12L18 15M21 12L18 9"
              stroke="#FEFAE0"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            onClick={signIn}
            className="navbar-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M11 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4H11M3 12H14M14 12L11 15M14 12L11 9"
              stroke="#FEFAE0"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
      </div>
      <div className="navbar-mobile">
        <div
          className="navbar-mobile-hamburgerWrapper"
          onClick={() => {
            setMenuOpen(!isMenuOpen);
          }}
          style={isMenuOpen ? { transform: "rotate(90deg)" } : {}}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        {auth.currentUser && (
          <Drawer anchor="left" open={isMenuOpen} onClose={handleMenuClose}>
            <List>
              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.profile);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Account Details" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.likedSongs);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Liked Songs" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.topSongs);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Top Songs" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.topArtists);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Top Artists" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.forums);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Forums" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.discovery);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Discovery" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  signOut();
                }}
              >
                <ListItemText primary="Log out" />
              </ListItem>
            </List>
          </Drawer>
        )}
        {!auth.currentUser && (
          <Drawer anchor="left" open={isMenuOpen} onClose={handleMenuClose}>
            <List>
              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.login);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Log in" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate(RouteLocations.discovery);
                  handleMenuClose();
                }}
              >
                <ListItemText primary="Discovery" />
              </ListItem>
            </List>
          </Drawer>
        )}
      </div>
    </div>
  );
}
