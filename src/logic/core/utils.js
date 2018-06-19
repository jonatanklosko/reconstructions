export const flatMap = (arr, fn) =>
  arr.reduce((xs, x) => xs.concat(fn(x)), []);

export const fromPairs = arr =>
  arr.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

export const intersection = (xs, ys) =>
  xs.filter(x => ys.includes(x));

export const maxBy = (arr, fn) =>
  arr.reduce((x, y) => fn(y) > fn(x) ? y : x);

export const reverse = str =>
  str.split('').reverse().join('');

export const rotate = (arr, n) =>
  arr.slice(n).concat(arr.slice(0, n));

export const splitWith = (arr, predicate) => {
  const index = arr.findIndex(predicate);
  const splitIndex = index === -1 ? arr.length : index;
  return [arr.slice(0, splitIndex), arr.slice(splitIndex)];
};

export const zip = (...arrs) =>
  arrs[0].map((_, i) => arrs.map(arr => arr[i]));
