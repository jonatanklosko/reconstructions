import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import CubeImage from '../CubeImage/CubeImage';
import ReconstructionForm from './ReconstructionForm';
import { reconstructionPath, editReconstructionPath } from '../../lib/url';
import { reconstructionFromString } from '../../lib/reconstruction';

function EditReconstruction() {
  const location = useLocation();
  const history = useHistory();

  const [reconstruction, setReconstruction] = useState(
    reconstructionFromString(location.search)
  );

  function handleChange(reconstruction) {
    setReconstruction(reconstruction);
    history.replace(editReconstructionPath(reconstruction));
  }

  function handleSubmit(reconstruction) {
    const path = reconstructionPath(reconstruction);
    history.push(path);
  }

  return (
    <div style={{ padding: 32 }}>
      <Grid container justify="space-evenly" spacing={4}>
        <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
          <CubeImage
            alg={reconstruction.scramble + reconstruction.solution}
            size={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReconstructionForm
            reconstruction={reconstruction}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default EditReconstruction;
