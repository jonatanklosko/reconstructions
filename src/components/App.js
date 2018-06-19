import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import Navigation from './Navigation';
import ReconstructionEditor from './ReconstructionEditor';
import ReconstructionViewer from './ReconstructionViewer';

export default class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div>
          <CssBaseline />
          <Navigation />
          <div style={{ padding: 16 }}>
            <Route exact path="/" component={ReconstructionEditor} />
            <Route path="/show" component={ReconstructionViewer} />
          </div>
        </div>
      </Router>
    );
  }
}
