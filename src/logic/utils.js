export const flatMap = (arr, fn) =>
  arr.reduce((xs, x) => xs.concat(fn(x)), []);
