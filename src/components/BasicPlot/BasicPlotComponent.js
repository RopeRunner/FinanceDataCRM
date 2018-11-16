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

class BasicPlotComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      base: 'https://etfdb.com/'
    };

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    let dataArr = [];
    for (let i = 0; i < 100; i++) {
      dataArr.push({
        name: `${Date.now()}`,
        uv: Math.round(Math.random() * 100)
      });
    }

    this.setState({ data: dataArr });

    this.getData().then(res => console.log(res));
  }

  getData() {
    let auth = 'Token 80ea1da93bc39e147ab911b71e2225c36649e67b';
    return axios.get(
      'https://api.tiingo.com/iex/AAPL/prices?startDate=2017-5-22&resampleFreq=5min',
      { headers: { 'Content-Type': 'application/json', Authorization: auth } }
    );
  }

  /* var auth = 'Token 80ea1da93bc39e147ab911b71e2225c36649e67b';
var request = require('request');
var requestOptions = {
        'url': 'https://api.tiingo.com/api/test/',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': auth
            }
        };

request(requestOptions,
        function(error, response, body) {
            console.log(body);
        }
);

//OR we can use the token directly in the url
var auth = 'Token 80ea1da93bc39e147ab911b71e2225c36649e67b';
var request = require('request');
var requestOptions = {
        'url': 'https://api.tiingo.com/api/test?token=80ea1da93bc39e147ab911b71e2225c36649e67b',
        'headers': {
            'Content-Type': 'application/json'
            }
        };

request(requestOptions,
        function(error, response, body) {
            console.log(body);
        }
);*/

  render() {
    return (
      <section>
        <LineChart
          width={1300}
          height={400}
          data={this.state.data}
          style={{ margin: 'auto', marginTop: '200px' }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="linear" dataKey="uv" dot={false} />
        </LineChart>
      </section>
    );
  }
}

export default BasicPlotComponent;
