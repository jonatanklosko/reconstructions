import {
  OPPOSITE_SIDE,
  solvedSlots,
  crossBottomEdgesOriented,
  sideOriented,
  sideEdgesOriented,
  sideSolved,
  sideCornersSolved,
  isSolved,
  lrSquares,
  edgesOriented,
  ulurSolved,
  uCornersSolved,
  eoLine,
  lrF2lSquares,
  sideCornersOriented
} from './cube-analyzers';

export const labelCFOPStep = (previous, current) => {
  const { count: slotsPrevious, side: crossSidePrevious } = solvedSlots(previous);
  const { count: slots, side: crossSide } = solvedSlots(current);
  if (!crossSidePrevious) {
    if (crossSide) return 'x'.repeat(slots) + 'cross';
  } else {
    const llSidePrevious = OPPOSITE_SIDE[crossSidePrevious];
    /* Current LL side is the one that has the value of previous LL side. */
    const llSide = Object.keys(OPPOSITE_SIDE).find(side => current[side] === previous[llSidePrevious]);
    if (slots > slotsPrevious) {
      const pairsLabel = ['1st', '2nd', '3rd', '4th'].slice(slotsPrevious, slots).join(' + ') + ' pair';
      if (slots === 4) {
        const label = lastSlotLabel => `${pairsLabel} / ${lastSlotLabel}`;
        if (sideOriented(current, llSide))
          return label(sideEdgesOriented(previous, llSidePrevious) ? 'CLS' : 'OLS');
        if (!crossBottomEdgesOriented(previous, crossSide) && sideEdgesOriented(current, llSide)) return label('EOLS');
      }
      return pairsLabel;
    } else if (slotsPrevious === 3 && slots === 3) {
      if (!sideEdgesOriented(previous, llSidePrevious) && sideEdgesOriented(current, llSide)) return 'ELS';
    } else if (slotsPrevious === 4 && slots === 4) {
      if (!sideEdgesOriented(previous, llSidePrevious)) {
        if (sideSolved(current, llSide)) return '1LLL';
        if (sideCornersSolved(current, llSide)) return 'OLLCP';
        if (sideOriented(current, llSide)) return 'OLL';
        if (sideEdgesOriented(current, llSide)) return 'EOLL';
      } else if (!sideOriented(previous, llSidePrevious)) {
        if (sideSolved(current, llSide)) return 'ZBLL';
        if (sideCornersSolved(current, llSide)) return 'COLL';
        if (sideOriented(current, llSide)) return 'OCLL';
      } else if (!sideCornersSolved(previous, llSidePrevious)) {
        if (sideSolved(current, llSide)) return 'PLL';
        if (sideCornersSolved(current, llSide)) return 'CPLL';
      } else if (!sideSolved(previous, llSidePrevious)) {
        if (sideSolved(current, llSide)) return 'EPLL';
      } else if (!isSolved(previous) && isSolved(current)) {
        return 'AUF';
      }
    }
  }
};

const dBlock = squares =>
  squares.filter(cornerSticker => cornerSticker.includes('D')).length === 2;

export const labelRouxStep = (previous, current) => {
  const [leftSquaresPrevious, rightSquaresPrevious] = lrSquares(previous);
  const [leftSquares, rightSquares] = lrSquares(current);
  if (!dBlock(leftSquaresPrevious) && dBlock(leftSquares)) return 'LBlock';
  if (!dBlock(rightSquaresPrevious) && dBlock(rightSquares)) return 'RBlock';
  if (!leftSquaresPrevious.length && leftSquares.length) return 'LSquare';
  if (!rightSquaresPrevious.length && rightSquares.length) return 'RSquare';
  if (dBlock(leftSquares) && dBlock(rightSquares)) {
    if (!uCornersSolved(previous)) {
      if (uCornersSolved(current)) return !edgesOriented(previous) && edgesOriented(current) ? 'CMLL + EO' : 'CMLL';
    } else if (!edgesOriented(previous)) {
      if (edgesOriented(current)) return ulurSolved(current) ? 'EO + UL/UR' : 'EO';
    } else if (!ulurSolved(previous)) {
      if (isSolved(current)) return 'LSE';
      /* One move off solved state means that LSE is about to be done, so don't label as UL/UR. */
      if (!sideSolved(current, 'U') && edgesOriented(current) && ulurSolved(current)) return 'UL/UR';
    } else if (!isSolved(previous) && isSolved(current)) {
      return 'EP';
    }
  }
};

export const labelZZStep = (previous, current) => {
  if (!eoLine(previous)) {
    if (eoLine(current)) return 'EOLine';
  } else {
    const [leftSquaresPrevious, rightSquaresPrevious] = lrF2lSquares(previous);
    const [leftSquares, rightSquares] = lrF2lSquares(current);
    if (!dBlock(leftSquaresPrevious) && dBlock(leftSquares)) return 'LBlock';
    if (!dBlock(rightSquaresPrevious) && dBlock(rightSquares)) return 'RBlock';
    if (!leftSquaresPrevious.length && leftSquares.length) return 'LSquare';
    if (!rightSquaresPrevious.length && rightSquares.length) return 'RSquare';
    if (dBlock(leftSquares) && dBlock(rightSquares)) {
      if (!sideCornersOriented(previous, 'U')) {
        if (sideSolved(current, 'U')) return 'ZBLL';
        if (sideCornersSolved(current, 'U')) return 'COLL';
        if (sideCornersOriented(current, 'U')) return 'OCLL';
      } else if (!sideCornersSolved(previous, 'U')) {
        if (sideSolved(current, 'U')) return 'PLL';
        if (sideCornersSolved(current, 'U')) return 'CPLL';
      } else if (!sideSolved(previous, 'U')) {
        if (sideSolved(current, 'U')) return 'EPLL';
      } else if (!isSolved(previous) && isSolved(current)) {
        return 'AUF'
      }
    }
  }
};
