import "./ProfilePage.css";
// axios
import axios from "axios";
import { Typography } from "@material-ui/core";
// auth
import { auth } from "../../app/firebase";
// navigation
import { Navigate, useNavigate } from "react-router-dom";
import { RouteLocations } from "../../app/RouteLocations";
// assets
import DefaultProfile from "../../assets/DefaultProfile.svg";
import thumbsup from "../../assets/thumbsup.svg";
import uparrow from "../../assets/uparrow.svg";
import music from "../../assets/music.svg";
import chat from "../../assets/chat.svg";
// components
import ProfileBox from "../../components/profileBox/ProfileBox";
import { useEffect, useState } from "react";
// firebruh
import {
  collection,
  query,
  where,
  updateDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "../../app/firebase";
// mui dropdown selector
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getAccountVisibility();
        console.log("User is logged in");
        // Perform your API calls and state updates here
        const fetchData = async () => {
          try {
            const tokenResponse = await axios.get(
              "http://localhost:9000/users/isTokenSet"
            );
            setIsTokenValid(tokenResponse.data);
            console.log("the token is: " + tokenResponse.data);

            const userDataResponse = await axios.get(
              "http://localhost:9000/users/profileInfo"
            );
            const topArtists = await axios.get(
              "http://localhost:9000/users/topArtists/short_term"
            );
            const artists = [];
            topArtists.data.items.forEach((artist) => {
              artists.push(artist.name);
            });
            const topSongs = await axios.get(
              "http://localhost:9000/users/topSongs/short_term"
            );
            const songs = [];
            topSongs.data.items.forEach((song) => {
              songs.push({
                name: song.name,
                artist: song.artists[0].name,
                album: song.album.name,
                image: song.album.images[0].url,
              });
            });

            setUserData(userDataResponse.data);
            // setAccountVisibility(userDataResponse.data.isPrivate);
            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", auth.currentUser.uid));

            const querySnapshot = await getDocs(q);
            const doc = querySnapshot.docs[0];

            if (doc) {
              await updateDoc(doc.ref, {
                spotifyUsername: userDataResponse.data.display_name,
                spotifyFollowers: userDataResponse.data.followers.total,
                spotifyCountry: userDataResponse.data.country,
                spotifyUserType: userDataResponse.data.product,
                spotifyTopArtists: artists,
                spotifyTopSongs: songs,
                spotifyProfilePic: userDataResponse.data.images[0].url,
              });
            }
          } catch (error) {
            // Handle any errors that occur during API calls
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false); // Set loading state to false when finished
          }
        };

        fetchData();
      } else {
        console.log("User is logged out");
        setIsLoading(false); // Set loading state to false when user is logged out
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // if (isLoading) {
  //   return <p>Loading...</p>; // Display a loading message while waiting for data
  // }
  const [accountVisibility, setAccountVisibility] = useState(false);

  const getAccountVisibility = async () => {
    if (auth.currentUser) {
      const userRef = collection(db, "users");
      const q = query(userRef, where("uid", "==", auth.currentUser.uid));

      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      if (doc) {
        setAccountVisibility(doc.data().isPrivate);
      }
    }
  };

  const handleUpdateAccountVisibility = async (event) => {
    setAccountVisibility(event.target.value);
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];

    if (doc) {
      await updateDoc(doc.ref, {
        isPrivate: event.target.value,
      });
    } else {
      console.log("no doc found");
    }
  };
  if (!auth.currentUser) {
    return <p>User is logged out</p>; // Handle the case when the user is logged out
  }

  // };

  function handleVerification() {
    window.location.href = "http://localhost:9000/users";
  }

  return (
    <div className="profilePage">
      <section className="profilePage-left">
        <div className="profilePage-left-image">
          {auth.currentUser ? (
            <img
              src={auth.currentUser.photoURL}
              className="profilePage-left-image-img"
            />
          ) : (
            <img src={DefaultProfile} className="profilePage-left-image-img" />
          )}
        </div>
        <div className="profilePage-left-info">
          <p className="profilePage-left-info-name">
            {auth.currentUser ? auth.currentUser.displayName : "Not logged in"}
          </p>
          <p className="profilePage-left-info-email">
            {auth.currentUser ? auth.currentUser.email : "Not logged in"}
          </p>
        </div>
        <div className="profilePage-left-buttons">
          {/* liked songs, top artists, top songs */}
          <ProfileBox
            text="Account Details"
            imageSrc={DefaultProfile}
            halfOpacity={false}
          />
          <ProfileBox
            text="Liked Songs"
            imageSrc={thumbsup}
            halfOpacity={true}
            onClick={() => navigate(RouteLocations.likedSongs)}
          />
          <ProfileBox
            text="Top Songs"
            imageSrc={music}
            halfOpacity={true}
            onClick={() => navigate(RouteLocations.topSongs)}
          />
          <ProfileBox
            text="Top Artists"
            imageSrc={uparrow}
            halfOpacity={true}
            onClick={() => navigate(RouteLocations.topArtists)}
          />

          <ProfileBox
            text="Forums"
            imageSrc={chat}
            halfOpacity={true}
            onClick={() => navigate(RouteLocations.forums)}
          />
        </div>
      </section>
      <section className="profilePage-right">
        <div className="profilePage-right-header">
          <h1 className="profilePage-right-header-title">
            Spotify Account Details
          </h1>
          <div className="profilePage-right-header-subtitleWrapper">
            <h2
              className="profilePage-right-header-subtitle"
              onClick={() =>
                window.open(userData.external_urls.spotify, "_blank")
              }
            >
              Profile
            </h2>
            {/* <img src={isTokenValid ? userData.images[0].url : ""} className="profilePage-right-header-subtitle-image" /> */}
          </div>
        </div>
        <div className="profilePage-right-body">
          <div className="profilePage-right-body-item">
            <p className="profilePage-right-body-item-title">Username</p>
            <p className="profilePage-right-body-item-text">
              {userData !== null ? userData.display_name : "No spotify auth!"}
            </p>
          </div>
          <div className="profilePage-right-body-item">
            <p className="profilePage-right-body-item-title">Followers</p>
            <p className="profilePage-right-body-item-text">
              {userData !== null
                ? userData.followers.total
                : "No spotify auth!"}
            </p>
          </div>
          <div className="profilePage-right-body-item">
            <p className="profilePage-right-body-item-title">Email</p>
            <p className="profilePage-right-body-item-text">
              {userData !== null ? userData.email : "No spotify auth!"}
            </p>
          </div>
          <div className="profilePage-right-body-item">
            <p className="profilePage-right-body-item-title">
              Country or Region
            </p>
            <p className="profilePage-right-body-item-text">
              {userData !== null ? userData.country : "No spotify auth!"}
            </p>
          </div>
          <div className="profilePage-right-body-item">
            <p className="profilePage-right-body-item-title">User type</p>
            <p className="profilePage-right-body-item-text">
              {userData !== null ? userData.product : "No spotify auth!"}
            </p>
          </div>
          <div className="profilePage-right-body-item">
            <p className="profilePage-right-body-item-title">
              Account Visibility {accountVisibility ? "(Private)" : "(Public)"}
            </p>
            {/* 
              add an mui dropdown. The default state is the current visibility
            */}
            <div className="profilePage-right-body-item-visibilityWrapper">
              <FormControl
                variant="outlined"
                className="profilePage-right-body-item-text"
                style={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  {accountVisibility ? "Private" : "Public"}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={accountVisibility}
                  onChange={(e) => {
                    handleUpdateAccountVisibility(e);
                  }}
                  label={accountVisibility ? "Private" : "Public"}
                >
                  <MenuItem value={false}>Public</MenuItem>
                  <MenuItem value={true}>Private</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        {isTokenValid && userData !== null ? (
          <button
            className="profilePage-right-button profilePage-right-button-verified"
            onClick={() => ""}
          >
            You're Spotify Verified!
          </button>
        ) : (
          <button
            className="profilePage-right-button"
            onClick={handleVerification}
          >
            Verify Spotify
          </button>
        )}
      </section>
    </div>
  );
}
