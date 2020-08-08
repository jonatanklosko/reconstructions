import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Typography, Toolbar, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import coffeeImage from './coffee.svg';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  titleTypography: {
    fontFamily: 'Indie Flower',
    color: 'inherit',
    textDecoration: 'none',
  },
  content: {
    flexGrow: 1,
  },
}));

function Layout({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar elevation={0} position="static">
        <Toolbar>
          <Grid container spacing={1} alignItems="center" justify="center">
            <Grid item>
              <img src={coffeeImage} height="32" alt="" />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                className={classes.titleTypography}
                component={RouterLink}
                to="/"
              >
                Reconstructions
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
