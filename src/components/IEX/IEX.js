import React from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { zScore, mean, standardDeviation } from 'simple-statistics';
import { PulseLoader } from 'react-loaders-spinners';

class IEXComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentData: {
        step: 0,
        data: []
      },
      currentMeanMax: 0,
      currentMeanMin: 0,
      isLoading: true,
      SMAStep: 30,
      SMALoading: true,
      SMAData: []
    };

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.initialization = this.initialization.bind(this);
    this.calcSMA = this.calcSMA.bind(this);
  }

  /**
   *  TODO EMA to display on same plot
   */
  calcSMA() {
    const { SMAStep } = this.state;

    let working = this.state.data.map(el => {
        return {
          date: el.date,
          close: el.close
        };
      }),
      SMAData = [],
      firstCounter = 0,
      finishCounter = SMAStep;

    for (let i = 0; i < working.length - SMAStep; i++) {
      let tmpMEAN = mean(
        working.slice(firstCounter, finishCounter).map(el => el.close)
      );

      firstCounter++;
      finishCounter++;
      SMAData.push({
        date: working[i].date,
        SMA: tmpMEAN,
        def: 0
      });
    }

    this.setState({ SMAData: SMAData, SMALoading: false });
  }

  next() {
    if (
      (this.state.currentData.step + 1) * this.props.separator >
      this.state.data.length
    )
      return;

    let nC = this.state.data.slice(
      (this.state.currentData.step + 1) * this.props.separator,
      (this.state.currentData.step + 1) * this.props.separator +
        this.props.separator
    );

    let perMeanMinMax = mean(nC.map(el => (el.min + el.max) / 2));

    let finalNc = nC.map(el => {
      return {
        date: el.date,
        min: el.min - perMeanMinMax,
        max: el.max - perMeanMinMax,
        zScore: zScore(
          (el.min + el.max) / 2,
          perMeanMinMax,
          standardDeviation(nC.map(el => (el.min + el.max) / 2))
        ),
        def: 0,
        vwap: el.vwap - perMeanMinMax
      };
    });

    this.setState({
      currentData: { step: this.state.currentData.step + 1, data: finalNc },
      currentMeanMin: perMeanMinMax,
      currentMeanMax: perMeanMinMax
    });
  }

  prev() {
    if (this.state.currentData.step - 1 < 0) return;

    let nC = this.state.data.slice(
      (this.state.currentData.step - 1) * this.props.separator,
      (this.state.currentData.step - 1) * this.props.separator +
        this.props.separator
    );

    let perMeanMinMax = mean(nC.map(el => (el.min + el.max) / 2));

    let finalNc = nC.map(el => {
      return {
        date: el.date,
        min: el.min - perMeanMinMax,
        max: el.max - perMeanMinMax,
        def: 0,
        zScore: zScore(
          (el.min + el.max) / 2,
          perMeanMinMax,
          standardDeviation(nC.map(el => (el.min + el.max) / 2))
        ),
        vwap: el.vwap - perMeanMinMax
      };
    });

    this.setState({
      currentData: { step: this.state.currentData.step - 1, data: finalNc },
      currentMeanMax: perMeanMinMax
    });
  }

  initialization(ticker = 'aapl') {
    axios
      .get(`https://api.iextrading.com/1.0/stock/${ticker}/chart/5y`)
      .then(res => res.data)
      .then(data => {
        let dataNew = [];

        data.forEach(element => {
          dataNew.push({
            date: element.date,
            min: element.low,
            max: element.high,
            vwap: element.vwap,
            close: element.close
          });
        });

        const step = this.props.separator;

        let cDTMP = dataNew.slice(0, step);
        let meanPeriodicalMinMax = mean(cDTMP.map(el => (el.min + el.max) / 2));

        const finalCurrent = cDTMP.map(el => {
          return {
            date: el.date,
            min: el.min - meanPeriodicalMinMax,
            max: el.max - meanPeriodicalMinMax,
            def: 0,
            zScore: zScore(
              (el.min + el.max) / 2,
              meanPeriodicalMinMax,
              standardDeviation(cDTMP.map(el => (el.min + el.max) / 2))
            ),
            vwap: el.vwap - meanPeriodicalMinMax
          };
        });

        this.setState({
          data: dataNew,
          currentData: { step: 0, data: finalCurrent },
          currentMeanMax: meanPeriodicalMinMax,
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.initialization();
    setTimeout(() => this.calcSMA(), 5000);
  }

  render() {
    return (
      <section
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {this.state.isLoading ? (
          <PulseLoader
            width={600}
            height={600}
            pColor="dodgerblue"
            sColor="#FF711E"
            style={{ alignSelf: 'center' }}
          />
        ) : (
          <React.Fragment>
            <span>
              Mean for minimals per preiod: {this.state.currentMeanMin}
            </span>
            <br />
            <span>
              Mean for maximals per preiod: {this.state.currentMeanMax}
            </span>
            <LineChart
              width={1300}
              height={750}
              data={this.state.currentData.data}
              style={{ margin: 'auto', marginTop: '0px', marginRight: '200px' }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip separator="-" />
              <Legend />
              <Line type="linear" dataKey="min" stroke="#ff7300" dot={false} />
              <Line type="linear" dataKey="max" stroke="green" dot={false} />
              <Line type="linear" dataKey="def" stroke="black" dot={false} />
              <Line
                type="linear"
                dataKey="zScore"
                stroke="violet"
                dot={false}
              />
              <Line type="linear" dataKey="vwap" stroke="#1d72f9" dot={false} />
            </LineChart>
            <button onClick={() => this.prev()}>Prev</button>
            <span>{this.state.currentData.step}</span>
            <button onClick={() => this.next()}>Next</button>
          </React.Fragment>
        )}
        {this.state.SMALoading ? (
          <PulseLoader
            width={600}
            height={600}
            pColor="dodgerblue"
            sColor="#FF711E"
            style={{ alignSelf: 'center' }}
          />
        ) : (
          <React.Fragment>
            <span>SMA with 30-day period per whole period days</span>
            <LineChart
              width={1300}
              height={750}
              data={this.state.SMAData}
              style={{ margin: 'auto', marginTop: '0px', marginRight: '200px' }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip separator=":" />
              <Legend />
              <Line type="linear" dataKey="SMA" stroke="#ff7300" dot={false} />
              <Line type="linear" dataKey="def" stroke="black" dot={false} />
            </LineChart>
            <button onClick={() => this.prev()}>Prev</button>
            <span>{this.state.currentData.step}</span>
            <button onClick={() => this.next()}>Next</button>
          </React.Fragment>
        )}
      </section>
    );
  }
}

export default IEXComponent;
