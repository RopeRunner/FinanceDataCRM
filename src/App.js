import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Link } from 'react-router-dom';
import TestPlot from './components/TestPlot/TestPlot';
import BasicPlotComponent from './components/BasicPlot/BasicPlotComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            path="/"
            exact
            render={() => {
              return (
                <section>
                  <Link to="/test">Test Data</Link>
                </section>
              );
            }}
          />
          <Route path="/test" exact render={() => <TestPlot />} />
          <Route path="/basic" exact render={() => <BasicPlotComponent />} />
        </Switch>
      </div>
    );
  }
}

export default App;
