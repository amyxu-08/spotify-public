From a previously private repository

# Spotify Connect

Welcome to the central repository for Spotify Connect.

## About

This project is a web application that allows users to communicate, interact, and chat with each other, built upon Spotify verification. Users can verify their accounts using Spotify's verification in our backend to then connect to the Spotify API, allowing them to view each others' top songs, liked songs, and much more, while also connecting with other users through chats and forums.

We were specifically tasked with using an [ExpressJS](https://expressjs.com/) backend, a [ReactJS](https://reactjs.org/) frontend, and a [Firebase](https://firebase.google.com/) database.

## Table of Contents

- [About](#about)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [File Structure](#file-structure)
- [Major Components and Features](#major-components-and-features)
- [Feature Statuses](#feature-statuses)
- [Credits](#credits)

### Installation

To use our project, begin by cloning our repository at `https://github.com/charliemeyer2000/spotify-app.git`. Then, navigate to the `spotify-app` directory and run `npm install` to install all of the necessary dependencies. Open a new terminal, navigate to the `backend` folder and run `npm install` again to install the backend dependencies.

### How to Use

To run this application, first `cd` into the `spotify-app` folder and run `npm start`. Then, in a new terminal session, `cd` into the `backend` folder and run `npm start`. This will start the backend on Port 9000 and the frontend on Port 3000.

Since we are using both an express backend and a React frontend, ensure that you are running your backend on Port 9000, as all calls to the backend in the frontend are made to Port 9000.

### File Structure

This project was created using a template for `create-react-app`, created using `npx create-react-app --template cgm`. Visit the nodejs package [here](https://www.npmjs.com/package/cra-template-cgm) for more information, as this explains other boilerplate (nginx, docker, workflows, etc) within the file structure. With this bootstrapping, the general file structure of this project is as follows:

```bash
spotify-app
├── .github
│   └── workflows
│       └── deploy.yml
├── public
│   ├── index.html
│   ├── robots.txt
│   └── manifest.json
├── src
│   ├── app
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── firebase.js
│   │   └── RouteLocations.js
│   ├── assets
│   ├── components
│   ├── hooks
│   ├── pages
│   │   ├── discoverPage
│   │   │   ├── assets
│   │   │   ├── components
│   │   │   ├── DiscoverPage.css
│   │   │   ├── DiscoverPage.js
│   │   │   └── utils.js
│   │   ├── /* other pages follow this pattern */
│   │   └── errorPage
│   │       ├── assets
│   │       ├── components
│   │       ├── ErrorPage.css
│   │       ├── ErrorPage.js
│   │       └── utils.js
│   ├── utils
│   └── index.js
├── trash
├── .gitingore
├── Dockerfile
├── nginx.conf
├── package-lock.json
├── package.json
└── README.md
backend
├── app.js
├── firebase.js
├── package-lock.json
├── package.json
├── permissions.json
├── public
│   └── stylesheets
│       └── style.css
├── routes
│   ├── chat.js
│   ├── demo.js
│   ├── index.js
│   ├── usersInfo.js
│   └── users.js

```

### Major Components and Features

- Firebase Authentication
  - This application uses Firebase Authentication to allow users to sign in with their Google accounts. With this, users then can post Forums and chat with other Spotify Connect users. Learn more about Firebase Authentication [here](https://firebase.google.com/docs/auth).
- Spotify Authentication
  - This application uses Spotify Authentication to allow users to sign in with their Spotify accounts. With this, users can view their top songs, liked songs, and other information about their Spotify accounts. Spotify's authentication is handled in the backend. Learn more about Spotify Authentication [here](https://developer.spotify.com/documentation/general/guides/authorization-guide/).
- Forums
  - This application allows users to post on forums, which are then stored in the Firebase database. Users can view these forums and comment on them.
- Chats
  - Users can chat with other users on the application. These chats are stored in the Firebase database, and are updated in real time using the `onSnapshot` function in Firebase.
- Top Songs, Liked Songs, and Top Artists
  - Users can view their top songs, liked songs, and top artists on the application. These are retrieved from the Spotify API and displayed on the frontend.

### Feature Statuses

All features are complete. However, if you would like to run this application yourself, you must create your own Firebase project and add your own Firebase configuration to the `firebase.js` file in the `app` folder. You must also create your own Spotify application and save its client ID, client secret, and redirect URIs in the `users.js` file within the `backend` folder.

With this configuration, all of the features will work as intended.

### Credits

- [Jacob Wald](https://www.linkedin.com/in/jacob-wald-a9107721b/) - Liked Songs, Top Songs, Top Artists, Discover Page
- [Amy Xu](https://www.linkedin.com/in/amyxu08/) - Backend, Spotify Authentication, Forums
- [Jenny Yu](https://www.linkedin.com/in/jeongyeonjyu/) - Forums, Backend
- [Charlie Meyer](https://charliemeyer.xyz) - Authentication, Chats, Profile Page

<!-- ## if you have errors with mui

just do these commands. We did some weird mui force things... or don't push your package-lock.json

``` bash

npm install @mui/material --force

npm install @material-ui/core --force

npm install @mui/icons-material @mui/material @emotion/styled @emotion/react --force

```

## Different pages for backend
http://localhost:9000/users/topArtists : get users top artists

http://localhost:9000/users/topSongs : get users top songs

( For top songs and artists, make sure to pass in term: (short_term/medium_term/long_term) )

http://localhost:9000/users/likedSongs : get users liked songs

http://localhost:9000/users/profileInfo : get users profile info -->
