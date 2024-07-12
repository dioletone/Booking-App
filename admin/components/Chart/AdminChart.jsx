import React from 'react';
import { Line } from 'react-chartjs-2';
//import './Chart.css';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Bookings',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Chart = () => (
  <div className="chart">
    <h2>Booking Trends</h2>
    <Line data={data} options={options} />
  </div>
);

export default Chart;
``