import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import TestPlot from './components/TestPlot/TestPlot';
import PricingTingoComponent from './components/PricingTingo/PricingTingoComponent';
import URLS from './helpers/URLS';
import IEXComponent from './components/IEX/IEX';
import HomeComponent from './components/UI/Home/HomeComponent';
import HeaderComponent from './components/UI/Header/HeaderComponent';

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
        <HeaderComponent />
        <Switch>
          <Route path="/" exact render={() => <HomeComponent />} />
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
