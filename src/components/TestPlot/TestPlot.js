import React, { PureComponent } from 'react';
import './TestPlot.css';
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

class TestPlot extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        { name: 'Page A', uv: 4000 },
        { name: 'Page B', uv: 3000 },
        { name: 'Page C', uv: 2000 },
        { name: 'Page D', uv: 2780 },
        { name: 'Page E', uv: 1890 },
        { name: 'Page F', uv: 2390 },
        { name: 'Page G', uv: 3490 }
      ],
      base: 'https://api.iextrading.com/1.0/'
    };
  }

  componentDidMount() {
    axios
      .get(`${this.state.base}/stock/iev/price`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <section>
        <LineChart
          width={1300}
          height={500}
          data={this.state.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="basic" dataKey="uv" dot={false} stroke="#82ca9d" />
        </LineChart>
      </section>
    );
  }
}

export default TestPlot;
