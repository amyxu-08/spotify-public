var express = require("express");
var router = express.Router();
const axios = require("axios");
const queryString = require("node:querystring");
const client_id = "22434a4bb0854f749a0dae3b32e29b30";
const redirect = "http://localhost:9000/users/account";
let token = "";
/**
 * For liked songs:
 * market: country code
 * limit: maximum number of items to return, 0 to 50
 * offset: index of the first item
 */

/**
 * For top artists/tracks
 * type: type of entity to return (artists or tracks)
 * time range: time frame to look for (short_term/medium_term/long_term)
 * limit: maximum number of items to return, 0 to 50
 * offset: index of the first item
 */

// Prompt in login page for spotify
router.get("/", (req, res) => {
  // change scope if 403 comes up
  const scope =
    "user-top-read user-library-read user-read-private user-read-email playlist-modify-private";
  const queryParams = queryString.stringify({
    client_id: client_id,
    response_type: "code",
    redirect_uri: redirect,
    scope: scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// respond to whether the user's token is set or not.
router.get("/isTokenSet", (req, res) => {
  res.send(token !== "");
});

router.get("/account", async (req, res) => {
  const spotifyResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    queryString.stringify({
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: redirect,
    }),
    {
      headers: {
        // clientid:clientsecret in base 64 format, Basic xxx ...
        Authorization:
          "Basic MjI0MzRhNGJiMDg1NGY3NDlhMGRhZTNiMzJlMjliMzA6NDAxNTI1M2NhMmFjNDJmNjg0OTYyNjYxYjZiNWQxYzM=",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  res.redirect("http://localhost:3000/profile");
  // res.send("Token set");
  token = spotifyResponse.data.access_token;
});

router.get("/topArtists/:term", async (req, res) => {
  const data = req.params["term"];
  await axios
    .get(
      // Change here to get different user information
      `https://api.spotify.com/v1/me/top/artists?limit=20&time_range=${data}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/topSongs/:term", async (req, res) => {
  const data = req.params["term"];
  await axios
    .get(
      // Change here to get different user information
      `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${data}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/likedSongs", async (req, res) => {
  await axios
    .get(
      // Change here to get different user information
      `https://api.spotify.com/v1/me/tracks?market=UM&limit=50`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/secondLikedSongs", async (req, res) => {
  await axios
    .get(
      // Change here to get different user information
      `https://api.spotify.com/v1/me/tracks?market=UM&limit=50&offset=50`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/profileInfo", async (req, res) => {
  await axios
    .get(
      // Change here to get different user information
      `https://api.spotify.com/v1/me`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/newRelease", async (req, res) => {
  // Get 20 new release
  await axios
    .get(`https://api.spotify.com/v1/browse/new-releases`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
