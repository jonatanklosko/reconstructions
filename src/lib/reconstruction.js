import { shrink, prettify } from './moves';

export function reconstructionToString(reconstruction) {
  const params = new URLSearchParams({
    ...reconstruction,
    scramble: shrink(reconstruction.scramble),
    solution: shrink(reconstruction.solution),
  });

  return params.toString();
}

export function reconstructionFromString(string) {
  const params = new URLSearchParams(string);

  return {
    title: params.get('title') || '',
    method: params.get('method') || 'cfop',
    time: (params.get('time') && parseFloat(params.get('time'))) || null,
    scramble: prettify(params.get('scramble') || ''),
    solution: prettify(params.get('solution') || ''),
  };
}

export const exampleReconstruction = {
  title: '[Official] Feliks Zemdegs - 4.22 seconds',
  method: 'cfop',
  time: 4.22,
  scramble: "R2 L' F2 D2 F' D L2 B' D L U B2 U B2 D2 L2 D' F2 D",
  solution: `
    F' R' D' R y R U' R' u'
    U' R U R'
    y' L' U2 L U' L' U L
    d U R' U' R U R' U' R
    U' R U2' R' R' F R F' R U2' R'
  `,
};
