import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import About from '../About/About';
import EditReconstruction from '../EditReconstruction/EditReconstruction';
import Reconstruction from '../Reconstruction/Reconstruction';

function Navigation() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/edit" component={EditReconstruction} />
        <Route exact path="/reconstruction" component={Reconstruction} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default Navigation;
