import "./App.css";
// React Router Imports
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
// Page Imports
import ErrorPage from "../pages/errorPage/ErrorPage";
import LoginPage from "../pages/loginPage/LoginPage";
import CreateAccountPage from "../pages/createAccountPage/CreateAccountPage";
import DiscoveryPage from "../pages/discoveryPage/DiscoveryPage";
import ForumsPage from "../pages/forumsPage/ForumsPage";
import LikedSongsPage from "../pages/likedSongsPage/LikedSongsPage";
import ProfilePage from "../pages/profilePage/ProfilePage";
import TopArtistsPage from "../pages/topArtistsPage/TopArtistsPage";
import TopSongsPage from "../pages/topSongsPage/TopSongsPage";
import BasicOutline from "../components/basicOutline/BasicOutline";
import { RouteLocations } from "./RouteLocations";
import { useEffect } from "react";
// do other imports here
import { auth } from "./firebase";
import ChatPage from "../pages/chatPage/ChatPage";

// Perform other imports here

export default function App() {
  // When you add/remove/update routes, ensure that you update RouteLocations.js
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in");
      } else {
        console.log("User is logged out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<BasicOutline />}>
        <Route
          path="/"
          index
          element={<Navigate to={RouteLocations.discovery} />}
        />
        <Route path="discovery">
          <Route index element={<DiscoveryPage />} />
          <Route path="chat">
            <Route path=":name" element={<ChatPage />} />
          </Route>
        </Route>
        {/* make a forum with an id */}
        <Route path="forums" element={<ForumsPage />} />

        <Route path="profile">
          <Route index element={<ProfilePage />} />
          <Route path=":token" element={<ProfilePage />} />
          <Route path="topArtists" element={<TopArtistsPage />} />
          <Route path="topSongs" element={<TopSongsPage />} />
          <Route path="liked-songs" element={<LikedSongsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>

        <Route path="login" element={<LoginPage />} />
        <Route path="createAccount" element={<CreateAccountPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
