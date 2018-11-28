import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Link } from 'react-router-dom';
import TestPlot from './components/TestPlot/TestPlot';
import PricingTingoComponent from './components/PricingTingo/PricingTingoComponent';
import URLS from './helpers/URLS';
import IEXComponent from './components/IEX/IEX';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urls: URLS()
    };
  }
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
          <Route
            path="/basic"
            exact
            render={() => <PricingTingoComponent url={this.state.urls.base} />}
          />
          <Route path="/iex" exact render={() => <IEXComponent />} />
        </Switch>
      </div>
    );
  }
}

export default App;
