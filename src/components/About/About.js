import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Grid, Link } from '@material-ui/core';
import whatImg from './what.svg';
import { exampleReconstruction } from '../../lib/reconstruction';
import { reconstructionPath } from '../../lib/url';

function About() {
  return (
    <div style={{ padding: 16 }}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="h5">{`Seriously, what's that?`}</Typography>
        </Grid>
        <Grid item>
          <img src={whatImg} alt="progress" height="150" />
        </Grid>
        <Grid item>
          <Typography>
            Reconstruction of a Rubik's Cube solve is a textual representation
            of the exact moves applied to the cube from start to finish.
            Speedcubers often reconstruct solves to share their solutions with
            others and calculate some statistics - like the number of moves in
            total or the number of moves per second. This tool helps in creating
            reconstructions by automatically detecting steps, ensuring the
            solution is correct and calculating the basic statistics. Check out
            an example reconstruction{' '}
            <Link
              color="secondary"
              component={RouterLink}
              to={reconstructionPath(exampleReconstruction)}
            >
              here
            </Link>
            .
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default About;
