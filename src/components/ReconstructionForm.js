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

import { analyzeSolution } from '../logic/core/solution-analyzer';
import { prettify } from '../logic/core/moves';

import { reconstructionPath } from '../logic/url-utils';

export default class ReconstructionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoFormatting: true
    };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.props.onChange({ ...this.props.reconstruction, [name]: value });
  };

  handleOptionChange = event => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  render() {
    const { title, method, time, scramble, solution } = this.props.reconstruction;
    const { autoFormatting } = this.state;

    const { steps, solved } = analyzeSolution(scramble, solution, method);
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
        <FormControl>
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
          onChange={this.handleInputChange}
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
          onChange={this.handleInputChange}
          fullWidth
          multiline
          inputProps={{ spellCheck: false }}
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
            variant="contained"
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
