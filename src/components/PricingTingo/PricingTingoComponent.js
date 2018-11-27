import React, { PureComponent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import axios from 'axios';
import { zScore, mean, standardDeviation } from 'simple-statistics';
import validator from 'validator';

class PricingTingoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      base: props.url,
      deltaData: [],
      inputPeriodValue: ''
    };

    this.getData = this.getData.bind(this);
    this.inputPeriodHandler = this.inputPeriodHandler.bind(this);
  }

  inputPeriodHandler(value) {
    if (validator.isInt(value) === true || value.length === 0)
      this.setState({ inputPeriodValue: value });
  }

  async componentDidMount() {
    let dataArr = [];
    for (let i = 0; i < 100; i++) {
      dataArr.push({
        name: `${Date.now()}`,
        uv: Math.round(Math.random() * 100)
      });
    }

    this.setState({ data: dataArr });

    this.getData()
      .then(res => {
        const data = res.json,
          regularHigh = data.map(el => {
            return {
              date: el.date,
              uv: (el.high + el.low) / 2
            };
          }),
          tmp = regularHigh.map(el => el.uv),
          meanV = mean(tmp),
          newDelta = [];

        let c = 0;

        data.forEach(element => {
          if (c++ > 365) {
            c = 0;
          } else {
            c++;
          }
          if (newDelta.length === 0 || c === 0) {
            newDelta.push([]);
          }

          newDelta[newDelta.length - 1].push({
            date: element.date,
            val: element.high - element.low
          });
        });

        const zScoreData = this.calculateZScore(
          regularHigh,
          meanV,
          standardDeviation(tmp)
        );

        this.setState({
          data: regularHigh.map((el, i) => {
            return {
              date: el.date,
              uv: el.uv - meanV,
              pv: zScoreData[i].uv
            };
          }),
          deltaData: newDelta
        });
      })
      .catch(err => console.log(err));
  }

  getData(
    ticker = 'FXF',
    start = new Date(1992, 1, 1).toISOString(),
    end = new Date(2018, 11, 18).toISOString()
  ) {
    const data = {
      ticker: ticker,
      start: start
        .split('')
        .splice(0, 10)
        .join(''),
      end: end
        .split('')
        .splice(0, 10)
        .join('')
    };

    return fetch(this.state.base, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  calculateZScore(payloadData, mean, standartDeviation) {
    return payloadData.map(el => {
      return {
        date: el.date,
        uv: zScore(el.uv, mean, standartDeviation)
      };
    });
  }

  render() {
    return (
      <section
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <h1>Green - ZScore</h1>
        <h1>Not Green - Hoghest Price of Day</h1>
        <LineChart
          width={2300}
          height={800}
          data={this.state.data}
          style={{ margin: 'auto', marginTop: '200px', marginRight: '200px' }}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="1 1" />
          <Tooltip />
          <Legend />
          <Line type="linear" dataKey="uv" stroke="#ff7300" dot={false} />
          <Line type="linear" dataKey="pv" stroke="green" dot={false} />
        </LineChart>
        <label htmlFor="periods">
          Period which will separate all data, to display delta of min-max
          values
        </label>
        <div className="periods">
          <input
            id="periods"
            type="text"
            placeholder="Number of days in period"
            value={this.state.inputPeriodValue}
            onChange={e => this.inputPeriodHandler(e.target.value)}
          />
          <button>Build Plot</button>
        </div>
        {/* {this.state.deltaData.map((delta, idx) => {
          return (
            <React.Fragment>
              <h1>
                Разница максимального и минимального значений за {delta.length}{' '}
                дней
              </h1>
              <LineChart
                key={idx}
                width={2300}
                height={800}
                data={delta}
                style={{
                  margin: 'auto',
                  marginTop: '200px',
                  marginRight: '200px'
                }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="1 1" />
                <Tooltip />
                <Legend />
                <Line
                  type="linear"
                  dataKey="val"
                  stroke="#2e3756"
                  dot={false}
                />
              </LineChart>
            </React.Fragment>
          );
        })}*/}
      </section>
    );
  }
}

export default PricingTingoComponent;
