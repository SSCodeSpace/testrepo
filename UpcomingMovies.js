import React,{useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

//styling props
const styles = theme => ({
  root: {
   
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.white,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
});

function UpcomingMovies(props) {

  //initialize the moviesList
  const [moviesList,setMoviesList]=useState([]);

  //fetch upcomingMovies list
  async function loadUpComingMovies() {
    const rawResponse = await fetch(props.baseUrl + "/movies?" + new URLSearchParams({status: 'PUBLISHED'}));
    const UpcomingMovies = await rawResponse.json();
    setMoviesList(UpcomingMovies.movies);
   
}

useEffect(() => {
  loadUpComingMovies();
}, []);

  const { classes } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={250} style={{ flexWrap: "nowrap", transform: 'translateZ(0)' }} cols={6}>
        {moviesList.map(movie => (
          <GridListTile key={movie.id} style={{height:'250px'}}>
            <img src={movie.poster_url} alt={movie.title}/>
            <GridListTileBar
              title={movie.title}
              classes={{
                
                title: classes.title,
              }}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

UpcomingMovies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpcomingMovies);
