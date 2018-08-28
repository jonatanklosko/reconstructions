import React from 'react';
import { shrink } from '../logic/moves';

const IMAGE_BASE_URL = 'http://cube.crider.co.uk/visualcube.php';

const imageUrl = (scramble, solution) => {
  const params = new URLSearchParams({
    fmt: 'svg',
    size: 300,
    bg: 't',
    pzl: 3,
    alg: shrink(scramble + solution),
    sch: 'wrgyob',
    r: 'y34x-34'
  });

  return `${IMAGE_BASE_URL}?${params.toString()}`;
};

const CubeImage = ({ scramble, solution }) => (
  <img src={imageUrl(scramble, solution)} alt="Failed to load" />
);

export default CubeImage;
