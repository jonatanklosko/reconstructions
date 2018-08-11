import { applyMove, applyMoves, newCube } from './cube';
import { isSolved } from './cube-analyzers';
import { labelCFOPStep, labelRouxStep, labelZZStep } from './step-analyzers';
import { splitWith } from './utils';
import { stringToMoves } from './moves';

const analyzeSolutionWith = (scramble, solution, labelStep) => {
  const [inspectionMoves, solutionMoves] = splitWith(stringToMoves(solution), move => !move.match(/[xyz]/));
  const scrambledCube = applyMoves(newCube(), stringToMoves(scramble).concat(inspectionMoves));
  const preSolutionSteps = inspectionMoves.length > 0 ? [{ label: 'inspection', moves: inspectionMoves }] : [];
  const [steps, , cube, remainingMoves] = solutionMoves.reduce(([steps, previousStepCube, cube, stepMoves], move) => {
    const cubeAfterMove = applyMove(cube, move);
    const label = labelStep(previousStepCube, cubeAfterMove);
    return label
      ? [[...steps, { label, moves: [...stepMoves, move] }], cubeAfterMove, cubeAfterMove, []]
      : [steps, previousStepCube, cubeAfterMove, [...stepMoves, move]];
  }, [preSolutionSteps, scrambledCube, scrambledCube, []]);
  return {
    steps: remainingMoves.length > 0 ? [...steps, { label: null, moves: remainingMoves }] : steps,
    solved: isSolved(cube)
  };
};

export const analyzeSolution = (scramble, solution, method) => {
  switch (method.toLowerCase()) {
    case 'cfop': return analyzeSolutionWith(scramble, solution, labelCFOPStep);
    case 'roux': return analyzeSolutionWith(scramble, solution, labelRouxStep);
    case 'zz': return analyzeSolutionWith(scramble, solution, labelZZStep);
    default: throw new Error(`Unsupported method '${method}'. Supported methods are: CFOP, Roux, ZZ.`);
  }
};
