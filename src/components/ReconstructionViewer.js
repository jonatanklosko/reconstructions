import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ReconstructionStatistics from './ReconstructionStatistics';

import { analyzeSolution } from 'solution-analyzer';
import { prettify } from '../logic/moves';
import { reconstructionFromParams, editReconstructionPath, shortenUrl } from '../logic/url-utils';

export default class ReconstructionViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reconstruction: reconstructionFromParams(new URLSearchParams(this.props.location.search)),
      url: window.location.href
    };
  }

  componentDidMount() {
    shortenUrl(window.location.href).then(url => this.setState({ url }));
  }

  render() {
    const { url, reconstruction } = this.state;
    const { title, time, scramble, solution, method } = reconstruction;

    const { steps } = analyzeSolution(scramble, solution, method);

    const formattedSolution = steps.map(step => `${step.moves.join(' ')} // ${step.label}`).join('\n');
    const formattedSolutionWithData = [
      title ? title : '',
      time ? `Time: ${time}` : '',
      `Scramble: ${prettify(scramble)}\n`,
      formattedSolution
    ].join('\n');

    const animationParams = new URLSearchParams({
      setup: prettify(scramble),
      alg: formattedSolution,
      title: title || 'Reconstruction',
      type: 'reconstruction'
    });
    const animationUrl = `https://alg.cubing.net/?${animationParams.toString()}`;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h5">Reconstruction</Typography>
            {title && <Typography variant="subtitle1">{title}</Typography>}
            {time && <Typography variant="subtitle1">Time: {time.toFixed(2)}</Typography>}
            <Typography variant="subtitle1">Scramble: {prettify(scramble)}</Typography>
            <Divider />
            <Typography variant="subtitle1">
              {steps.map(step =>
                <p key={step.label} style={{ margin: 0 }}>
                  <span>{step.moves.join(' ')}</span>
                  <span style={{ opacity: 0.38 }}>{` // ${step.label}`}</span>
                </p>
              )}
            </Typography>
            <Divider />
            <div>
              <Tooltip title="See animation">
                <IconButton href={animationUrl} target="_blank">
                  <Icon>movie</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy URL">
                <CopyToClipboard text={url}>
                  <IconButton>
                    <Icon>link</Icon>
                  </IconButton>
                </CopyToClipboard>
              </Tooltip>
              <Tooltip title="Copy solution">
                <CopyToClipboard text={formattedSolutionWithData}>
                  <IconButton>
                    <Icon>content_copy</Icon>
                  </IconButton>
                </CopyToClipboard>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton component={Link} to={editReconstructionPath(reconstruction)}>
                  <Icon>mode_edit</Icon>
                </IconButton>
              </Tooltip>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h5">Statistics</Typography>
            <ReconstructionStatistics steps={steps} time={time} />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
