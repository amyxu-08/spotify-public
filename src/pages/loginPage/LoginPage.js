import "./LoginPage.css";
// mui textfield imports
import { TextField } from "@mui/material";
import { provider, auth, db, githubProvider } from "../../app/firebase";
// assets
import googleLogo from "../../assets/google_logo.png";
import githubLogo from "../../assets/github_logo.png";
import githubLogoWhite from "../../assets/github_logo_white.png";
// react
import { useEffect, useState } from "react";
// routing
import { useNavigate } from "react-router-dom";
import { RouteLocations } from "../../app/RouteLocations";
// firebase sign in
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// firebase firestore
import {
  addDoc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";
import Navbar from "../../components/navbar/Navbar";

export default function LoginPage() {
  const [hoveringGithub, setHoveringGithub] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Instantiate GoogleAuthProvider
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user); // Check the value of the result object

      // Handle successful sign-in

      // Check if the user already exists in the "users" collection
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("uid", "==", result.user.uid));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        // Create a new document in the "users" collection
        const payload = {
          displayName: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
          profilePicture: result.user.photoURL,
          isPrivate: true,
        };
        try {
          await addDoc(usersRef, payload);
          console.log("User added to the database");
        } catch (error) {
          alert("Error adding user to the database");
        }
      } else {
        console.log("User already exists");
      }
      // navigate to the profile page
      navigate(RouteLocations.profile);
    } catch (error) {
      // Handle sign-in error
      console.log(error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      // Handle successful sign-in
      console.log("logged in with github");
    } catch (error) {
      // Handle sign-in error
      console.log(error);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginPage-center">
        <h1 className="loginPage-center-header">Welcome back!</h1>

        <div className="loginPage-center-main">
          <div>
            <p className="loginPage-center-main-buttonWrapper-text">
              Welcome back to Spotify App!
            </p>
            <p className="loginPage-center-main-buttonWrapper-text">
              Please login to continue
            </p>
          </div>
          <div
            className="loginPage-center-main-buttonWrapper"
            onClick={handleGoogleLogin}
          >
            <img
              src={googleLogo}
              className="loginPage-center-main-buttonWrapper-img"
            />
            <p className="loginPage-center-main-buttonWrapper-text">
              Continue with Google
            </p>
          </div>
          {/* <div
            className="loginPage-center-main-buttonWrapper"
            onMouseOver={() => {
              setHoveringGithub(true);
            }}
            onMouseLeave={() => {
              setHoveringGithub(false);
            }}
            onClick={handleGithubLogin}
          >
            {hoveringGithub ? (
              <img
                src={githubLogoWhite}
                className="loginPage-center-main-buttonWrapper-img"
              />
            ) : (
              <img
                src={githubLogo}
                className="loginPage-center-main-buttonWrapper-img"
              />
            )}
            <p className="loginPage-center-main-buttonWrapper-text">
              Continue with GitHub
            </p>
          </div> */}
        </div>
        <div className="loginPage-center-bottom">
          <p
            className="loginPage-center-bottom-text"
            onClick={() => {
              navigate(RouteLocations.createAccount);
            }}
          >
            Create an account
          </p>
          <p className="loginPage-center-bottom-bar">|</p>
          <p
            className="loginPage-center-bottom-text"
            onClick={() => {
              navigate(RouteLocations.discovery);
            }}
          >
            Go home
          </p>
        </div>
      </div>
    </div>
  );
}
