import React, { useRef, useEffect } from 'react';
import { cubeSVG } from 'sr-visualizer';

function CubeImage({ alg = null, size = 150 }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = root.firstChild;
    if (svg) {
      root.removeChild(svg);
    }

    cubeSVG(rootRef.current, {
      height: size,
      width: size,
      viewportRotations: [
        [1, 34],
        [0, -34],
      ],
      algorithm: alg,
      colorScheme: {
        0: '#FFFFFF',
        1: '#EE0000',
        2: '#00D800',
        3: '#FEFE00',
        4: '#FFA100',
        5: '#0000F2',
      },
    });
  }, [alg, size]);

  return <div ref={rootRef} />;
}

export default CubeImage;
