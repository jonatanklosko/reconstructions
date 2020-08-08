import { reconstructionToString } from './reconstruction';
import { prettify } from './moves';

export function reconstructionPath(reconstruction) {
  return '/reconstruction?' + reconstructionToString(reconstruction);
}

export function editReconstructionPath(reconstruction) {
  return '/edit?' + reconstructionToString(reconstruction);
}

export function getShortUrl(longUrl) {
  const params = new URLSearchParams({
    login: 'o_214kbfp0ik',
    apiKey: 'R_00aee698807d4b799529bec2d82d0356',
    longUrl,
  });

  const url = `https://api-ssl.bitly.com/v3/shorten?${params.toString()}`;

  return fetch(url)
    .then((response) => response.json())
    .then((json) =>
      json.status_code === 200 ? json.data.url : Promise.reject(json)
    );
}

export function getAnimationUrl(title, setup, alg) {
  const animationParams = new URLSearchParams({
    setup: prettify(setup),
    alg,
    title,
    type: 'reconstruction',
  });

  return `https://alg.cubing.net/?${animationParams.toString()}`;
}
