import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField'

import { analyzeSolution } from 'solution-analyzer';
import { prettify } from '../logic/moves';
import { reconstructionPath } from '../logic/url-utils';

export default class ReconstructionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoFormatting: true
    };
    this.solutionInputRef = React.createRef();
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.props.onChange({ ...this.props.reconstruction, [name]: value });
  };

  handleTimeInputChange = event => {
    const { value } = event.target;
    const formatTime = string =>
      string.replace(',', '.').replace(/[^\d.]/, '');
    this.props.onChange({ ...this.props.reconstruction, time: formatTime(value) });
  };

  handleSolutionInputChange = event => {
    const { value } = event.target;
    const start = prettify(value.slice(0, event.target.selectionStart)).length;
    this.props.onChange({ ...this.props.reconstruction, solution: value }, () => {
      this.solutionInputRef.current.selectionStart = start;
      this.solutionInputRef.current.selectionEnd = start;
    });
  };

  handleOptionChange = event => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  render() {
    const { title, method, time, scramble, solution } = this.props.reconstruction;
    const { autoFormatting } = this.state;

    const { steps, solved } = scramble && solution
      ? analyzeSolution(scramble, solution, method)
      : { steps: [], solved: true };
    const formattedSolution = steps.map(step => step.moves.join(' ')).join('\n');

    return (
      <form autoComplete="off">
        <TextField
          label="Title"
          name="title"
          margin="normal"
          fullWidth
          value={title}
          onChange={this.handleInputChange}
        />
        <FormControl margin="normal">
          <InputLabel>Method</InputLabel>
          <Select
            name="method"
            value={method}
            onChange={this.handleInputChange}
          >
            <MenuItem value="cfop">CFOP</MenuItem>
            <MenuItem value="roux">Roux</MenuItem>
            <MenuItem value="zz">ZZ</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Time"
          name="time"
          margin="normal"
          value={time}
          onChange={this.handleTimeInputChange}
        />
        <TextField
          label="Scramble"
          name="scramble"
          margin="normal"
          value={prettify(scramble)}
          onChange={this.handleInputChange}
          fullWidth
          inputProps={{ spellCheck: false }}
        />
        <TextField
          label="Solution"
          name="solution"
          margin="normal"
          value={autoFormatting ? formattedSolution : solution}
          onChange={this.handleSolutionInputChange}
          fullWidth
          multiline
          inputProps={{ spellCheck: false }}
          inputRef={this.solutionInputRef}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="autoFormatting"
              checked={autoFormatting}
              onChange={this.handleOptionChange}
            />
          }
          label="Use intelligent formatting"
        />
        <div>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to={reconstructionPath(this.props.reconstruction)}
            disabled={!scramble || !solution || !solved}
          >
            Done
          </Button>
        </div>
      </form>
    );
  }
}
