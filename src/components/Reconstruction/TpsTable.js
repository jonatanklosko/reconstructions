import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { getMoveCount } from '../../lib/moves';

function TpsTable({ steps, time }) {
  const metrics = ['stm', 'etm', 'htm', 'qtm'];

  const totalMoveCount = getMoveCount(steps.flatMap((step) => step.moves));

  return (
    <Table>
      <TableHead>
        <TableRow>
          {metrics.map((metric) => (
            <TableCell key={metric}>
              {metric.replace('tm', 'tps').toUpperCase()}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {metrics.map((metric) => (
            <TableCell key={metric}>
              {(totalMoveCount[metric] / time).toFixed(2)}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default TpsTable;
