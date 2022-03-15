import { Typography } from "@material-ui/core";
import React from "react";
import Header from "../../common/header/Header";
import "./Details.css";
import YouTube from "react-youtube";
import { GridListTileBar, GridList, GridListTile } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import Rating from "../../common/Rating";

const opts = {
  height: "390",
  width: "850",
  playerVars: {
    autoplay: 1,
  },
};
const _onReady = (e) => {
  e.target.pauseVideo();
};

export default function Details(props) {
  const [movieDetails, setMovieDetails] = React.useState({
    artists: [],
    censor_board_rating: "",
    duration: 0,
    genres: [],
    id: "",
    poster_url: "",
    rating: 0,
    release_date: "",
    status: "",
    storyline: "",
    title: "",
    trailer_url: "",
    wiki_url: "",
  });

  console.log("base url in details page is " + props.baseUrl);

  async function loadMovieDetails() {
    const rawResponse = await fetch(
      props.baseUrl + "movies/" + props.match.params.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
    const movieData = await rawResponse.json();
    setMovieDetails(movieData);
  }

  useEffect(() => {
    loadMovieDetails();
  }, []);

  function dateString(string) {
    return new Date(string).toDateString();
  }

  const ratingClickHandler = (event) => {
    console.log(event.target);
  };

  return (
    <div>
      <Header showBookShow={true} {...props} movieID={movieDetails.id} />
      <div>
        <div className="back-button">
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography variant="button">&lt; Back to Home</Typography>
          </Link>
        </div>
        <div className="details-container">
          <div className="details-left">
            <img src={movieDetails.poster_url} alt={movieDetails.title} />
          </div>
          <div className="details-middle">
            <Typography variant="headline" component="h2">
              {movieDetails.title}
            </Typography>
            <Typography variant="body1">
              <span className="movie-detail-label">Genre: </span>
              {movieDetails.genres.join(", ")}
            </Typography>
            <Typography variant="body1">
              <span className="movie-detail-label">Duration: </span>
              {movieDetails.duration}
            </Typography>
            <Typography variant="body1">
              <span className="movie-detail-label">Release Date: </span>
              {dateString(movieDetails.release_date)}
            </Typography>
            <Typography variant="body1">
              <span className="movie-detail-label">Rating: </span>
              {movieDetails.rating}
            </Typography>
            <Typography variant="body1" className="movie-detail-plot">
              <span className="movie-detail-label">Plot: </span>{" "}
              <a href={movieDetails.wiki_url}>(Wiki URL)</a>{" "}
              {movieDetails.storyline}
            </Typography>
            <Typography variant="body1" className="movie-detail-plot">
              <span className="movie-detail-label">Trailer: </span>
            </Typography>
            <YouTube
              videoId={movieDetails.trailer_url.split("v=")[1]}
              opts={opts}
              onReady={_onReady}
            />
            ;
          </div>
          <div className="details-right">
            <Typography style={{ fontWeight: 600 }} component="div">
              Rate this movie:
              <Rating
                numberOfStars="5"
                rating={movieDetails.rating}
                onClick={ratingClickHandler}
              />
            </Typography>
            <Typography style={{ margin: "16px 0" }}>
              <span className="movie-detail-label">Artists: </span>
            </Typography>
            <GridList cols={2}>
              {movieDetails.artists.map((artist) => (
                <GridListTile key={artist.id}>
                  <img src={artist.profile_url} alt={"artist profile link"} />
                  <GridListTileBar
                    title={artist.first_name + " " + artist.last_name}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </div>
      </div>
    </div>
  );
}
