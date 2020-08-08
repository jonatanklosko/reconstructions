import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography, Grid } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  heartIcon: {
    verticalAlign: 'middle',
    color: red[700],
  },
  grow: {
    flexGrow: 1,
  },
}));

function Footer({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant="body2">
            Made with <FavoriteIcon className={classes.heartIcon} /> by{' '}
            <Link
              className={classes.link}
              href="https://github.com/jonatanklosko"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jonatan Kłosko
            </Link>
          </Typography>
        </Grid>
        <Grid item className={classes.grow} />
        <Grid item>
          <Link
            href="https://github.com/jonatanklosko/reconstructions"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/about">
            What?
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default Footer;
