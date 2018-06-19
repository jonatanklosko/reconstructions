import { flatMap, intersection, maxBy, reverse, rotate } from './utils';
import { LINES, SIDES, rotateLine } from './cube';

export const OPPOSITE_SIDE = { 'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'B', 'B': 'F' };

const stickerSide = sticker => sticker[0];

/* A sticker is considered solved when it has the same value as the corresponding center. */
const isStickerSolved = (cube, sticker) =>
  cube[sticker] === cube[stickerSide(sticker)];

export const isSolved = cube =>
  Object.keys(cube).every(sticker => isStickerSolved(cube, sticker));

const isCenterSticker = sticker => sticker.length === 1;

const isEdgeSticker = sticker => sticker.length === 2;

const isCornerSticker = sticker => sticker.length === 3;

const elementStickers  = element =>
  Array.from({ length: element.length }, (_, i) => rotate(element.split(''), i).join(''));

/* An element is considered solved when all its stickers are solved.
   E.g. URF corner is solved when URF, RFU and FUR stickers are solved.
        UF edge is solved when UF and FU stickers are solved. */
const isElementSolved = (cube, element) =>
  elementStickers(element).every(sticker => isStickerSolved(cube, sticker));

const sameValue = (cube, stickers) =>
  stickers.length === 0 || new Set(stickers.map(sticker => cube[sticker])).size === 1;

const sameValueBySide = (cube, stickers) =>
  Object.values(SIDES).every(sideStickers =>
    sameValue(cube, intersection(sideStickers, stickers))
  );

/* See: https://www.speedsolving.com/wiki/index.php/EOLine#EO_Detection */
export const edgesOriented = (cube, dSide = 'D', fSide = 'F') => {
  const rSide = SIDES[dSide].filter(isCornerSticker).find(sticker => sticker.startsWith(dSide + fSide))[2];
  const [uSide, bSide, lSide] = [dSide, fSide, rSide].map(side => OPPOSITE_SIDE[side]);
  const stickers = [...SIDES[uSide], ...SIDES[dSide], ...LINES[rSide], ...LINES[lSide]].filter(isEdgeSticker);
  const value = sticker => cube[sticker];
  const hasSameValueAs = (stickers, sticker) => stickers.map(value).includes(value(sticker));
  const anyMisoriented = stickers.some(sticker =>
    hasSameValueAs([lSide, rSide], sticker) || (hasSameValueAs([fSide, bSide], sticker) && hasSameValueAs([uSide, dSide], reverse(sticker)))
  );
  return !anyMisoriented;
};

/* CFOP-specific */

const sidesWithCrossSolved = cube =>
  Object.entries(SIDES).filter(([side, stickers]) =>
    stickers.filter(isEdgeSticker).every(sticker => isElementSolved(cube, sticker))
  ).map(([side, stickers]) => side);

export const solvedSlots = cube => {
  const solvedSlotsWithSide = sidesWithCrossSolved(cube).map(side => {
    const solvedSlotsAroundCross = SIDES[side].filter(sticker =>
      isCornerSticker(sticker)
      && isElementSolved(cube, sticker)
      && isElementSolved(cube, sticker.slice(1) /* Adjacent edge. */)
    );
    return { side, count: solvedSlotsAroundCross.length };
  });
  return solvedSlotsWithSide.length > 0
    ? maxBy(solvedSlotsWithSide, ({ count }) => count)
    : { side: null, count: 0 };
};

/* Returns true if in any position with cross at the bottom edges are oriented. */
export const crossBottomEdgesOriented = (cube, crossSide) => {
  const [, ...perpendicularSides] = SIDES[crossSide].find(isCornerSticker);
  return perpendicularSides.some(side => edgesOriented(cube, crossSide, side));
};

export const sideOriented = (cube, side, stickerPredicate = () => true) =>
  sameValue(cube, SIDES[side].filter(stickerPredicate));

export const sideEdgesOriented = (cube, side) =>
  sideOriented(cube, side, isEdgeSticker);

export const sideCornersOriented = (cube, side) =>
  sideOriented(cube, side, isCornerSticker);

export const sideSolved = (cube, side, stickerPredicate = () => true) =>
  [0, -1, 1, 2]
    .map(n => rotateLine(cube, side, n))
    .some(cube =>
      SIDES[side]
        .filter(stickerPredicate)
        .every(sticker => isElementSolved(cube, sticker))
    );

export const sideCornersSolved = (cube, side) =>
  sideSolved(cube, side, isCornerSticker);

export const sideEdgesSolved = (cube, side) =>
  sideSolved(cube, side, isEdgeSticker);

/* Roux-specific */

export const lrSquares = cube =>
  ['L', 'R'].map(side =>
    SIDES[side]
      .filter(isCornerSticker)
      .filter(cornerSticker => {
        const adjacentEdges = cornerSticker.split('').slice(1).map(adjacentSide => `${side}${adjacentSide}`);
        const stickers = flatMap([...adjacentEdges, cornerSticker, side], elementStickers);
        return sameValueBySide(cube, stickers);
      })
  );

export const ulurSolved = cube =>
  ['R', 'L'].every(center =>
    ['R', 'L', 'F', 'B'].some(side =>
      intersection(SIDES[side], LINES['U']).every(sticker => cube[sticker] === cube[center])
    )
  );

export const uCornersSolved = cube =>
  sameValueBySide(cube, SIDES['U'].filter(isCornerSticker));

/* ZZ-specific */

export const eoLine = cube =>
  isElementSolved(cube, 'DF') && isElementSolved(cube, 'DB') && edgesOriented(cube);

export const lrF2lSquares = cube =>
  lrSquares(cube).map(squares => squares.filter(corner => elementStickers(corner).some(sticker => cube[sticker] === cube['D'])));
