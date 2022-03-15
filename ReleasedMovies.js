import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { Link } from "react-router-dom";
import { Button, CardContent, FormControl, Card } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Input } from "@material-ui/core";
import "../../common/header/Form.css";
import { MenuItem, ListItemText, Select, Checkbox } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


//styling props
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  getContentAnchorEl: null,
};

const styles = (theme) => ({
  h4: {
    color: theme.palette.primary.light,
    margin: theme.spacing.unit,
  },
  root: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240,
    paddingTop:0
  },
  typo: {
    color: theme.palette.primary.light
},
formControl: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240
}
});

function ReleasedMovies(props) {

  const { classes } = props;
  //initialize filter values
  const [filters, setFilters] = useState({
    movieName: "",
    genreSelector: {},
    artistSelector: {},
    releaseStartDate: "",
    releaseEndDate: "",
  });
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genresList, setGenresList] = React.useState([]);
  const [artistList, setArtistList] = React.useState([]);
  const [releasedMoviesListCopy,setReleasedMoviesListCopy]=useState([]);

  //fetch genre details
  async function loadGenreDetails() {
    const rawResponse = await fetch(props.baseUrl + "/genres");
    const list = await rawResponse.json();
    setGenresList(list.genres);
  }

  //fetch artist details
  async function loadArtistDetails() {
    const rawResponse = await fetch(props.baseUrl + "/artists");
    const list = await rawResponse.json();
    setArtistList(
      list.artists.map((artist) => ({
        name: artist.first_name + " " + artist.last_name,
        id: artist.id,
      }))
    );
  }

  const [releasedMoviesList, setReleasedMoviesList] = useState([]);
  //fetch releasedMovies list
  async function loadReleasedMovies() {
    const rawResponse = await fetch(
      props.baseUrl + "/movies?" + new URLSearchParams({ status: "RELEASED" })
    );
    const moviesList = await rawResponse.json();

    setReleasedMoviesList(moviesList.movies);
    setReleasedMoviesListCopy(moviesList.movies)
  
  }

  useEffect(() => {
    loadGenreDetails();
    loadArtistDetails();
    loadReleasedMovies();
  }, []);

  //handle input change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFilters((values) => ({ ...values, [name]: value }));
  };

  //handle genre change
  const handleGenreChange = (e) => {
    const {
      target: { value },
    } = e;
    setGenres(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  //handle artist change
  const handleArtistChange = (e) => {
    const {
      target: { value },
    } = e;
   setArtists(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  
  };

  //handle filter action
  const applyFilters = (event) => {
    setReleasedMoviesList(releasedMoviesListCopy);
    filters.artistSelector=artists;
    filters.genreSelector=genres;
   let filteredMoviesList = releasedMoviesList.filter((movie) => {
      let dataFilter = {};
     
      if (filters.movieName) {
        if (
          `${movie.title}`.toLowerCase().includes(`${filters.movieName}`.toLowerCase())
        ) {
          dataFilter.titleStatus = true;
        } else {
          dataFilter.titleStatus = false;
        }
      }
      if (filters.genreSelector && filters.genreSelector.length > 0) {
        movie.genres.forEach((genre) => {
          if (filters.genreSelector.indexOf(genre) > -1) {
            dataFilter.genreStatus = true;
          }
        });
        if (!dataFilter.genreStatus) {
          dataFilter.genreStatus = false;
        }
      }
      if (filters.artistSelector && filters.artistSelector.length > 0) {
        movie.artists &&
          movie.artists.forEach((artist) => {
            const name = artist.first_name + " " + artist.last_name;
            if (filters.artistSelector.indexOf(name) > -1) {
              dataFilter.artistStatus = true;
            }
          });
        if (!dataFilter.artistStatus) {
          dataFilter.artistStatus = false;
        }
      }
      let endDate = new Date();
      if (filters.releaseEndDate) {
        endDate = new Date(filters.releaseEndDate);
      }
      if (filters.releaseStartDate) {
        const startDate = new Date(filters.releaseStartDate);
        const filmDate = new Date(movie.release_date);
        if (filmDate >= startDate && filmDate <= endDate) {
          dataFilter.releaseDateStatus = true;
        } else {
          dataFilter.releaseDateStatus = false;
        }
      }
      let status = true;
      for (let item in dataFilter) {
        if (!dataFilter[item]) {
          status = false;
          break;
        }
      }
      return status;
    });
    setReleasedMoviesList(filteredMoviesList);
  };

  function dateString(string) {
    return new Date(string).toDateString();
  }
  
  return (
    <div className="flex-container">
      <div className="released-movies">
        <GridList cols={4} >
          {releasedMoviesList.map((movie) => (
            <GridListTile key={movie.id} style={{height:'350px'}}>
              <Link to={`/movie/${movie.id}`}>
                <img src={movie.poster_url} alt={movie.title} width="100%" />
                <GridListTileBar
                  title={movie.title}
                  subtitle={
                    <span>Release Date: {dateString(movie.release_date)}</span>
                  }
                />
              </Link>
            </GridListTile>
          ))}
        </GridList>
      </div>
      <div style={{width:'24%',margin:'16px'}}>
        <Card className="movies-filter">
          <CardContent>
          <Typography variant="title" className={classes.typo}>
                                FIND MOVIES BY:
                                </Typography>
                           
          </CardContent>
          <form>
            <CardContent
              className={`${classes.root}`}
            >
              <FormControl fullWidth>
                <InputLabel htmlFor="movieName" >
                  Movie Name
                </InputLabel>
                <Input
                  id="movieName"
                  variant="standard"
                  value={filters.movieName}
                  name="movieName"
                  onChange={handleChange}
                />
              </FormControl>
            </CardContent>
            <CardContent
              className={`${classes.root}`}
            >
              <FormControl fullWidth>
                <InputLabel htmlFor="genres" >
                  Genres
                </InputLabel>
                <Select
                  id="genres"
                  variant="standard"
                  multiple
                  value={genres}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                  onChange={handleGenreChange}
                  name="genreSelector"
                >
                  {genresList.map((gen) => (
                    <MenuItem key={gen.id} value={gen.genre}>
                      <Checkbox checked={genres.indexOf(gen.genre) > -1} />
                      <ListItemText primary={gen.genre} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
            <CardContent
              className={`${classes.root}`}
            >
              <FormControl fullWidth>
                <InputLabel htmlFor="artists" >
                  Artists
                </InputLabel>
                <Select
                  id="artists"
                  variant="standard"
                  multiple
                  value={artists}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                  onChange={handleArtistChange}
                  name="artistSelector"
                >
                  {artistList.map((artist) => (
                    <MenuItem key={artist.id} value={artist.name}>
                      <Checkbox checked={artists.indexOf(artist.name) > -1} />
                      <ListItemText primary={artist.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
            <CardContent
              className={`${classes.root}`}
            >
              <FormControl fullWidth>
                <InputLabel htmlFor="releaseStartDate"  shrink={true}>
                  Release Date Start
                </InputLabel>
                <Input
                  id="releaseStartDate"
                  variant="standard"
                  type="date"
                  name="releaseStartDate"
                  onChange={handleChange}
                  value={filters.releaseStartDate}
                />
              </FormControl>
            </CardContent>
            <CardContent
              className={`${classes.root}`}
            >
              <FormControl fullWidth>
                <InputLabel htmlFor="releaseEndDate"  shrink={true}>
                  Release Date End
                </InputLabel>
                <Input
                  id="releaseEndDate"
                  variant="standard"
                  type="date"
                  name="releaseEndDate"
                  value={filters.releaseEndDate}
                  onChange={handleChange}
                />
              </FormControl>
            </CardContent>
            <CardContent
              className={`${classes.root}`}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={applyFilters}
              >
                APPLY
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}

ReleasedMovies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReleasedMovies);
