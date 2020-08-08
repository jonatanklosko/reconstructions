import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getMoveCount } from '../../lib/moves';

const useStyles = makeStyles((theme) => ({
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  totalCell: {
    fontWeight: 'bold',
  },
}));

function metricInfoUrl(metric) {
  return (
    'https://www.speedsolving.com/wiki/index.php/Metric#' + metric.toUpperCase()
  );
}

function MoveCountTable({ steps }) {
  const classes = useStyles();

  const metrics = ['stm', 'etm', 'htm', 'qtm'];

  const stepsWithMoveCount = steps.map((step) => [
    step,
    getMoveCount(step.moves),
  ]);

  const totalMoveCount = getMoveCount(steps.flatMap((step) => step.moves));

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Step</TableCell>
          {metrics.map((metric) => (
            <TableCell key={metric}>
              <a
                href={metricInfoUrl(metric)}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                {metric.toUpperCase()}
              </a>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {stepsWithMoveCount.map(([step, moveCount]) => (
          <TableRow key={step.label}>
            <TableCell>{step.label}</TableCell>
            {metrics.map((metric) => (
              <TableCell key={metric}>{moveCount[metric]}</TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow>
          <TableCell className={classes.totalCell}>Total</TableCell>
          {metrics.map((metric) => (
            <TableCell key={metric} className={classes.totalCell}>
              {totalMoveCount[metric]}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default MoveCountTable;
