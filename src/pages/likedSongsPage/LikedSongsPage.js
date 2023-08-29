import "./LikedSongsPage.css";

import {
  Typography,
  Grid,
  TextField,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LikedSongsPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/users/likedSongs"
        );
        const firstResponseData = response.data.items.map((song) => {
          return createData(
            song.track.name,
            song.track.artists[0].name,
            song.track.album.name,
            song.added_at,
            song.track.album.images[0].url
          );
        });

        const response2 = await axios.get(
          "http://localhost:9000/users/secondLikedSongs"
        );
        const secondResponseData = response2.data.items.map((song) => {
          return createData(
            song.track.name,
            song.track.artists[0].name,
            song.track.album.name,
            song.added_at,
            song.track.album.images[0].url
          );
        });

        setRows([...firstResponseData, ...secondResponseData]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  function createData(song, artist, album, dateAdded, url) {
    return { song, artist, album, dateAdded, url };
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    const filtered = rows.filter(
      (row) =>
        row.song.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.artist.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredRows(filtered);
  }

  function renderRow(row) {
    return (
      <TableRow
        key={row.song}
        style={{
          backgroundColor: "var(--light-green)",
          width: "100%",
          borderBottom: "10px solid var(--cream)",
          borderRadius: "10px",
        }}
        className="tableRow"
      >
        <TableCell component="th" scope="row">
          <Grid
            container
            spacing={2}
            alignItems="center"
            style={{ flexWrap: "nowrap" }}
          >
            <Grid item>
              <div style={{ width: 50, height: 50 }}>
                <CardMedia
                  component="img"
                  alt="Album Cover"
                  image={row.url}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Grid>
            <Grid item style={{ flex: "1 1 auto" }}>
              <Typography
                style={{
                  color: "var(--cream)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.song}
              </Typography>
              <Typography
                className="likedSongsPage-artistundersong"
                style={{
                  color: "var(--cream)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                By: {row.artist}
              </Typography>
            </Grid>
          </Grid>
        </TableCell>
        <TableCell
          align="center"
          className="likedSongsPage-makemedisappearartist"
        >
          <Typography style={{ color: "var(--cream)" }}>
            {row.artist}
          </Typography>
        </TableCell>
        <TableCell
          align="center"
          className="likedSongsPage-makemedisappearalbum"
        >
          <Typography style={{ color: "var(--cream)" }}>{row.album}</Typography>
        </TableCell>
        <TableCell align="right" className="likedSongsPage-makemedisappeardate">
          <Typography style={{ color: "var(--cream)" }}>
            {row.dateAdded.substring(0, 10)}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <main>
        <div className="likedSongsPage">
          <Typography className="headerColor" variant="h2" gutterBottom>
            Liked Songs
          </Typography>
        </div>
        <Grid container spacing={2} style={{ marginLeft: "20px" }}>
          <Grid item>
            <SearchIcon></SearchIcon>
          </Grid>
          <Grid item>
            <TextField
              value={search}
              placeholder="Find in liked songs"
              onChange={(event) => handleSearch(event)}
            ></TextField>
          </Grid>
        </Grid>
        <div style={{ padding: "25px" }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead
                style={{
                  backgroundColor: "var(--dark-green)",
                  borderBottom: "10px solid var(--cream)",
                }}
                root={{
                  paddingTop: "1rem",
                }}
              >
                <TableRow>
                  <TableCell>
                    <Typography variant="h5" style={{ color: "var(--cream)" }}>
                      Song
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="likedSongsPage-makemedisappearartist"
                  >
                    <Typography variant="h5" style={{ color: "var(--cream)" }}>
                      Artist
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="likedSongsPage-makemedisappearalbum"
                  >
                    <Typography variant="h5" style={{ color: "var(--cream)" }}>
                      Album
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    className="likedSongsPage-makemedisappeardate"
                  >
                    <Typography variant="h5" style={{ color: "var(--cream)" }}>
                      Date Added
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {search === ""
                  ? rows && rows.map((row) => renderRow(row))
                  : filteredRows.map((song) => renderRow(song))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </>
  );
}
