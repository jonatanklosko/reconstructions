import React, { useState, useRef } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { analyzeSolution } from 'solution-analyzer';
import { prettify } from '../../lib/moves';

function reformatTime(string) {
  return string.replace(',', '.').replace(/[^\d.]/, '');
}

function removeComments(solution) {
  return solution
    .split('\n')
    .map((line) => line.replace(/\s+\/\/.*$/, ''))
    .join('\n');
}

function ReconstructionForm({ reconstruction, onChange, onSubmit }) {
  const [autoFormatting, setAutoFormatting] = useState(true);
  const solutionInputRef = useRef(null);

  const { title, method, time, scramble, solution } = reconstruction;

  function handleTitleChange(event) {
    onChange({ ...reconstruction, title: event.target.value });
  }

  function handleMethodChange(event) {
    onChange({ ...reconstruction, method: event.target.value });
  }

  function handleTimeChange(event) {
    onChange({
      ...reconstruction,
      time: reformatTime(event.target.value),
    });
  }

  function handleSolutionChange(event) {
    const newSolution = removeComments(event.target.value);
    onChange({ ...reconstruction, solution: newSolution });
    // Make sure removing a move in the middle doesn't move the cursor to the end.
    if (autoFormatting) {
      // In terms of position prettify is the same as formatting, just spaces instead of enters.
      let start = prettify(newSolution.slice(0, event.target.selectionStart))
        .length;
      setTimeout(() => {
        solutionInputRef.current.setSelectionRange(start, start);
      }, 0);
    }
  }

  function handleScrambleChange(event) {
    onChange({ ...reconstruction, scramble: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(reconstruction);
  }

  const { steps, solved } =
    scramble && solution
      ? analyzeSolution(scramble, solution, method)
      : { steps: [], solved: true };

  const formattedSolution = steps
    .map((step) => step.moves.join(' '))
    .join('\n');

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item container spacing={2}>
          <Grid item>
            <FormControl margin="normal">
              <InputLabel>Method</InputLabel>
              <Select
                value={method}
                onChange={handleMethodChange}
                style={{ minWidth: 150 }}
              >
                <MenuItem value="cfop">CFOP</MenuItem>
                <MenuItem value="roux">Roux</MenuItem>
                <MenuItem value="zz">ZZ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              margin="normal"
              label="Time"
              value={time}
              onChange={handleTimeChange}
            />
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            label="Scramble"
            value={prettify(scramble)}
            onChange={handleScrambleChange}
            fullWidth
            spellCheck={false}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Solution"
            name="solution"
            value={autoFormatting ? formattedSolution : solution}
            onChange={handleSolutionChange}
            fullWidth
            multiline
            spellCheck={false}
            inputRef={solutionInputRef}
            disabled={!scramble}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={autoFormatting}
                onChange={(event) => setAutoFormatting(event.target.checked)}
              />
            }
            label="Use intelligent formatting"
          />
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            color="secondary"
            disabled={!scramble || !solution || !solved}
          >
            Done
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default ReconstructionForm;
