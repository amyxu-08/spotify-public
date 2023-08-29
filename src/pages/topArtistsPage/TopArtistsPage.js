import "./TopArtistsPage.css";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Container,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TopArtistsPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [term, setTerm] = useState("Last Several Years");
  const terms = ["Last 4 Weeks", "Last 6 Months", "Last Several Years"];

  useEffect(() => {
    const fetchData = async () => {
      let response;
      try {
        switch (term) {
          case "Last 4 Weeks":
            response = await axios.get(
              "http://localhost:9000/users/topArtists/short_term"
            );
            break;
          case "Last 6 Months":
            response = await axios.get(
              "http://localhost:9000/users/topArtists/medium_term"
            );
            break;
          case "Last Several Years":
            response = await axios.get(
              "http://localhost:9000/users/topArtists/long_term"
            );
            break;
          default:
            response = await axios.get(
              "http://localhost:9000/users/topArtists/long_term"
            );
            break;
        }
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [term]);

  function handleSearch(event) {
    setSearch(event.target.value);
    setFilteredData(
      data.items.filter((artist) =>
        artist.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  }

  function renderCard(artist) {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Card
          className="likedSongCard"
          style={{ backgroundColor: "var(--light-green)" }}
        >
          <div className="cardMediaContainer">
            <CardMedia className="cardMedia" image={artist.images[0].url} />
          </div>
          <Card
            className="cardContentContainer"
            style={{ backgroundColor: "var(--dark-green)" }}
          >
            <CardContent style={{ backgroundColor: "var(--dark-green)" }}>
              <Typography variant="h6" gutterBottom className="artistName">
                {artist.name}
              </Typography>
            </CardContent>
          </Card>
        </Card>
      </Grid>
    );
  }

  return (
    <>
      <main>
        <div className="topArtistsPage">
          <Typography className="headerColor" variant="h2" gutterBottom>
            Top Artists
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
              placeholder="Find in top artists"
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
        <Container maxWidth="fullWidth">
          <Grid container className="cardGrid" spacing={3}>
            {search === ""
              ? data && data.items.map((artist) => renderCard(artist))
              : filteredData.map((artist) => renderCard(artist))}
          </Grid>
        </Container>
      </main>
    </>
  );
}
