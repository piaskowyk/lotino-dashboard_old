import React, { Component } from 'react';
import Chart from 'chart.js';

export default class PlacesChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
  
  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: {
        labels: this.props.data.map(d => d.time),
        datasets: [{
          label: this.props.title,
          data: this.props.data.map(d => d.value),
          backgroundColor: this.props.color
        }]
      }
    });
  }

  render() {
    return (
      <canvas ref={this.canvasRef} />
    );
  }
}
