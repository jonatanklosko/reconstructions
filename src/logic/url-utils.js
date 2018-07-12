import { shrink } from './core/moves';

export const reconstructionToParams = reconstruction =>
  new URLSearchParams({
    ...reconstruction,
    scramble: shrink(reconstruction.scramble),
    solution: shrink(reconstruction.solution)
  });

export const reconstructionFromParams = params => ({
  title: params.get('title') || '',
  method: params.get('method') || 'cfop',
  time: (params.get('time') && parseFloat(params.get('time'))) || '',
  scramble: params.get('scramble') || '',
  solution: params.get('solution') || ''
});

export const reconstructionPath = reconstruction =>
  '/show?' + reconstructionToParams(reconstruction).toString();

export const editReconstructionPath = reconstruction =>
  '/?' + reconstructionToParams(reconstruction).toString();

export const shortenUrl = url => {
  const params = new URLSearchParams({
    login: 'o_214kbfp0ik',
    apiKey: 'R_00aee698807d4b799529bec2d82d0356',
    longUrl: url
  });
  return fetch(`https://api-ssl.bitly.com/v3/shorten?${params.toString()}`)
    .then(response => response.json())
    .then(json => json.status_code === 200 ? json.data.url : Promise.reject(json));
};
