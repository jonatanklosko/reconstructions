import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'

import CubeImage from './CubeImage';
import ReconstructionForm from './ReconstructionForm';

import { reconstructionFromParams } from '../logic/url-utils';

export default class ReconstructionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reconstruction: reconstructionFromParams(new URLSearchParams(this.props.location.search))
    };
  }

  handleReconstructionChange = reconstruction => {
    this.setState({ reconstruction });
  };

  render() {
    const { reconstruction } = this.state;

    return (
      <Grid container>
        <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
          <CubeImage scramble={reconstruction.scramble} solution={reconstruction.solution} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="headline">Reconstruction</Typography>
          <ReconstructionForm
            reconstruction={reconstruction}
            onChange={this.handleReconstructionChange}
          />
        </Grid>
      </Grid>
    );
  }
}
