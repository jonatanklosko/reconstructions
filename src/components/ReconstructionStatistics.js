import React, { Component } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { countMoves } from '../logic/core/moves';
import { flatMap } from '../logic/core/utils';

export default class ReconstructionStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
    this.metrics = ['stm', 'etm', 'htm', 'qtm'];
  }

  handleTabChange = (event, tabIndex) => {
    this.setState({ tabIndex })
  };

  render() {
    const { tabIndex } = this.state;
    const { steps,  time } = this.props;

    const stepsWithMoveCount = steps
      .filter(step => step.label !== 'inspection')
      .map(step => ({ ...step, moveCount: countMoves(step.moves) }))
    const totalMoveCount = countMoves(flatMap(stepsWithMoveCount, step => step.moves));

    return (
      <div>
        <Tabs value={tabIndex} onChange={this.handleTabChange}>
          <Tab label="Move count" />
          <Tab label="TPS" />
        </Tabs>
        {tabIndex === 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Step</TableCell>
                {this.metrics.map(metric =>
                  <TableCell key={metric}>
                    <a href={'https://www.speedsolving.com/wiki/index.php/' + metric.toUpperCase()} target="_blank">
                      {metric.toUpperCase()}
                    </a>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {stepsWithMoveCount.map(({ moves, label, moveCount }) =>
                <TableRow key={label}>
                  <TableCell>{label}</TableCell>
                  {this.metrics.map(metric =>
                    <TableCell key={metric}>{moveCount[metric]}</TableCell>
                  )}
                </TableRow>
              )}
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
                {this.metrics.map(metric =>
                  <TableCell key={metric} style={{ fontWeight: 'bold' }}>
                    {totalMoveCount[metric]}
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        )}
        {tabIndex === 1 && (
          <Table>
            <TableHead>
              <TableRow>
                {this.metrics.map(metric =>
                  <TableCell key={metric}>
                    {metric.replace('tm', 'tps').toUpperCase()}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {this.metrics.map(metric =>
                  <TableCell key={metric}>
                    {(totalMoveCount[metric] / time).toFixed(2)}
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
}
