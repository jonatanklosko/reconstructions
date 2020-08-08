import React, { useState } from 'react';
import { Paper, Tab, Tabs } from '@material-ui/core';
import MoveCountTable from './MoveCountTable';
import TpsTable from './TpsTable';

function ReconstructionStatistics({ steps, time }) {
  const [tab, setTab] = useState('move-count');

  const relevantSteps = steps.filter((step) => step.label !== 'inspection');

  return (
    <Paper style={{ overflowX: 'auto' }}>
      <Tabs value={tab} onChange={(event, tab) => setTab(tab)}>
        <Tab label="Move count" value="move-count" />
        {time && <Tab label="TPS" value="tps" />}
      </Tabs>
      {tab === 'move-count' && <MoveCountTable steps={relevantSteps} />}
      {tab === 'tps' && <TpsTable steps={relevantSteps} time={time} />}
    </Paper>
  );
}

export default ReconstructionStatistics;
