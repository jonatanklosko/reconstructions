import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Tooltip } from '@material-ui/core';
import MovieIcon from '@material-ui/icons/Movie';
import LinkIcon from '@material-ui/icons/Link';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { prettify } from '../../lib/moves';
import {
  editReconstructionPath,
  getShortUrl,
  getAnimationUrl,
} from '../../lib/url';

function ReconstructionMenu({ reconstruction, steps }) {
  const [url, setUrl] = useState(window.location.href);

  useEffect(() => {
    getShortUrl(window.location.href).then((url) => setUrl(url));
  }, []);

  const { title, time, scramble } = reconstruction;

  const formattedSolution = steps
    .map((step) => `${step.moves.join(' ')} // ${step.label}`)
    .join('\n');

  const formattedSolutionWithData = [
    time ? `Time: ${time}` : '',
    `Scramble: ${prettify(scramble)}\n`,
    formattedSolution,
  ].join('\n');

  const animationUrl = getAnimationUrl(
    title || 'Reconstruction',
    scramble,
    formattedSolution
  );

  return (
    <>
      <Tooltip title="See animation" placement="top">
        <IconButton href={animationUrl} target="_blank">
          <MovieIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Copy URL" placement="top">
        <CopyToClipboard text={url}>
          <IconButton>
            <LinkIcon />
          </IconButton>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip title="Copy solution" placement="top">
        <CopyToClipboard text={formattedSolutionWithData}>
          <IconButton>
            <FileCopyIcon />
          </IconButton>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip title="Edit" placement="top">
        <IconButton
          component={RouterLink}
          to={editReconstructionPath(reconstruction)}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default ReconstructionMenu;
