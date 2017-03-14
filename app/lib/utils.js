export function rotate(array, offset) {
  if(typeof array === 'string') return rotate(array.split(''), offset).join('');
  let copy = array.slice(0);
  while(offset < 0) offset += array.length;
  copy.push(...copy.splice(0, offset));
  return copy;
}

export function reverse(string) {
  return string.split('').reverse().join('');
}
