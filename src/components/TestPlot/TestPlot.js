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
      ]
    };
  }

  componentDidMount() {
    axios
      .get(
        'https://www.quandl.com/api/v3/datasets/OPEC/ORB.json?api_key=NF_98GZte7JRFrhxMb9z'
      )
      .then(data => {
        const needed = data.data.dataset.data.map(el => {
          return {
            name: el[0],
            uv: el[1]
          };
        });
        this.setState({ data: needed });
      });
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
