import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Typography, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import homeImage from './home.svg';

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
  },
  imageContainer: {
    textAlign: 'center',
  },
  titleTypography: {
    fontFamily: 'Indie Flower',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <Box p={{ xs: 2, md: 3 }} className={classes.fullHeight}>
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justify="center"
        className={classes.fullHeight}
      >
        <Grid item>
          <img src={homeImage} alt="about" height="250" />
        </Grid>
        <Grid item>
          <Typography
            variant="h5"
            className={classes.titleTypography}
            align="center"
          >
            Reconstructing solves made easy breezy.
          </Typography>
        </Grid>
        <Grid item>
          <Button
            size="large"
            variant="contained"
            disableElevation
            color="secondary"
            component={RouterLink}
            to="/edit"
          >
            Let's go
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
