import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import TestPlot from './components/TestPlot/TestPlot';
import PricingTingoComponent from './components/PricingTingo/PricingTingoComponent';
import URLS from './helpers/URLS';
import IEXComponent from './components/IEX/IEX';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urls: URLS(),
      separatorForIEX: 30
    };

    this.changeSeparatorIEX = this.changeSeparatorIEX.bind(this);
  }

  changeSeparatorIEX(newSep) {
    if (typeof newSep !== 'number') return;
    this.setState({ separatorForIEX: newSep });
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
                <section
                  style={{
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  <Link style={{ textDecoration: 'none' }} to="/test">
                    Test Data
                  </Link>
                  <Link style={{ textDecoration: 'none' }} to="/basic">
                    To tingo dat
                  </Link>
                  <Link style={{ textDecoration: 'none' }} to="/iex">
                    To IEX
                  </Link>
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
          <Route
            path="/iex"
            exact
            render={() => (
              <IEXComponent separator={this.state.separatorForIEX} />
            )}
          />
          <Route path="**" render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    );
  }
}

export default App;
