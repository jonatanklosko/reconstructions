import React from 'react';
import { Paper, Typography, Grid, Box } from '@material-ui/core';
import { prettify } from '../../lib/moves';

function ReconstructionCard({ reconstruction, steps }) {
  const { time, scramble } = reconstruction;

  return (
    <Paper>
      <Box p={2}>
        <Grid container direction="column" spacing={1}>
          {time && (
            <Grid item>
              <Typography variant="subtitle2">Time</Typography>
              <Typography variant="body1">{time.toFixed(2)}</Typography>
            </Grid>
          )}
          <Grid item>
            <Typography variant="subtitle2">Scramble</Typography>
            <Typography variant="body1">{prettify(scramble)}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" component="div">
              {steps.map((step) => (
                <div key={step.label}>
                  <span>{step.moves.join(' ')}</span>
                  <span style={{ opacity: 0.38 }}>{` // ${step.label}`}</span>
                </div>
              ))}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ReconstructionCard;
