import React from "react";
import Header from "../../common/header/Header";
import ReleasedMovies from "./ReleasedMovies";
import UpcomingMovies from "./UpcomingMovies";
import "./Home.css";
import "./ReleasedMovies.css";

export default function Home(props) {
  

  return (
    <div>
        {console.log("base URL is "+props.baseUrl)}
      <Header {...props} />
      <div className="upcoming-movies-header">Upcoming Movies</div>
      <UpcomingMovies {...props} />
      <ReleasedMovies {...props} />
    </div>
  );
}
