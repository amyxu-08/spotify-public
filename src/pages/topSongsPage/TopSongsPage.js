import "./TopSongsPage.css";
import {
  Typography,
  Grid,
  TextField,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

export default function TopArtistsPage() {
  const [search, setSearch] = useState("");

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  const [term, setTerm] = useState("Last Several Years");
  const terms = ["Last 4 Weeks", "Last 6 Months", "Last Several Years"];

  useEffect(() => {
    const fetchData = async () => {
      let response;
      try {
        switch (term) {
          case "Last 4 Weeks":
            response = await axios.get(
              "http://localhost:9000/users/topSongs/short_term"
            );
            break;
          case "Last 6 Months":
            response = await axios.get(
              "http://localhost:9000/users/topSongs/medium_term"
            );
            break;
          case "Last Several Years":
            response = await axios.get(
              "http://localhost:9000/users/topSongs/long_term"
            );
            break;
          default:
            response = await axios.get(
              "http://localhost:9000/users/topSongs/long_term"
            );
            break;
        }
        setRows(
          response.data.items.map((song) => {
            return createData(
              song.name,
              song.artists[0].name,
              song.album.name,
              song.popularity,
              song.album.images[0].url
            );
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [term]);

  function createData(song, artist, album, popularity, url) {
    return { song, artist, album, popularity, url };
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
                className="topSongsPage-artistundersong"
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
          className="topSongsPage-makemedisappearartist"
        >
          <Typography style={{ color: "var(--cream)" }}>
            {row.artist}
          </Typography>
        </TableCell>
        <TableCell align="center" className="topSongsPage-makemedisappearalbum">
          <Typography style={{ color: "var(--cream)" }}>{row.album}</Typography>
        </TableCell>
        <TableCell
          align="right"
          className="topSongsPage-makemedisappearpopularity"
        >
          <Typography style={{ color: "var(--cream)" }}>
            {row.popularity}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <main>
        <div className="topSongsPage">
          <Typography className="headerColor" variant="h2" gutterBottom>
            Top Songs
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
              placeholder="Find in top songs"
              onChange={(event) => handleSearch(event)}
            ></TextField>
          </Grid>
          <Grid
            item
            style={{ width: "100%", marginBottom: "16px", marginRight: "40px" }}
          >
            <FormControl style={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">
                Time duration
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={term}
                label="Time duration"
                onChange={(e) => setTerm(e.target.value)}
              >
                {terms.map((term) => (
                  <MenuItem key={term} value={term}>
                    {" "}
                    {term}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                    className="topSongsPage-makemedisappearartist"
                  >
                    <Typography variant="h5" style={{ color: "var(--cream)" }}>
                      Artist
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="topSongsPage-makemedisappearalbum"
                  >
                    <Typography variant="h5" style={{ color: "var(--cream)" }}>
                      Album
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    className="topSongsPage-makemedisappearpopularity"
                  >
                    <Typography variant="h5" style={{ color: "var(--cream)" }}>
                      Popularity
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
