import React from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Typography, Box } from '@material-ui/core';
import ReconstructionStatistics from './ReconstructionStatistics';
import { analyzeSolution } from 'solution-analyzer';
import { reconstructionFromString } from '../../lib/reconstruction';
import ReconstructionCard from './ReconstructionCard';
import ReconstructionMenu from './ReconstructionMenu';

function Reconstruction() {
  const location = useLocation();

  const reconstruction = reconstructionFromString(location.search);
  const { title, time, scramble, solution, method } = reconstruction;
  const { steps } = analyzeSolution(scramble, solution, method);

  return (
    <Box p={{ xs: 2, md: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} container alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="h5">{title}</Typography>
          </Grid>
          <Grid item xs />
          <Grid item>
            <ReconstructionMenu reconstruction={reconstruction} steps={steps} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <ReconstructionCard reconstruction={reconstruction} steps={steps} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReconstructionStatistics steps={steps} time={time} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reconstruction;
