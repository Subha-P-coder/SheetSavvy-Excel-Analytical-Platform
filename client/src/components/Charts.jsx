import React, { useState, useEffect } from 'react';
import {
  Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble
} from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale, Tooltip, Title, Legend
);

const Charts = ({ type, data = [], xField, yField, rField }) => {
  const [rotationKey, setRotationKey] = useState(0);

  useEffect(() => {
    if (['pie', 'doughnut', 'polar'].includes(type)) {
      setRotationKey(prev => prev + 1);
    }
  }, [type, data]);

  if (!data || data.length === 0 || !xField || !yField) {
    return (
      <p style={{ color: 'red' }}>
        ❌ Chart rendering failed. Missing or mismatched fields:
        <br />
        xField: <b>{xField}</b>, yField: <b>{yField}</b>
      </p>
    );
  }


  const solidColors = [
    '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff',
    '#ff9f40', '#00d8d6', '#f72585', '#3a0ca3', '#b5179e',
    '#7209b7', '#560bad', '#3f37c9', '#4361ee', '#4895ef',
  ];

  const labels = data.map(row => row[xField]);
  const values = data.map(row => parseFloat(row[yField]));

  const chartData = {
    labels,
    datasets: [
      {
        label: `${yField} vs ${xField}`,
        data: values,
        backgroundColor: solidColors.slice(0, values.length),
        borderColor: solidColors.slice(0, values.length),
        borderWidth: 2,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#00ffff' } },
      title: {
        display: true,
        text: `Chart: ${type}`,
        color: '#00ffff',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: {
        title: { display: true, text: xField, color: '#00ffff' },
        ticks: { color: '#00ffff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        title: { display: true, text: yField, color: '#00ffff' },
        ticks: { color: '#00ffff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar': return <Bar data={chartData} options={chartOptions} />;
      case 'line': return <Line data={chartData} options={chartOptions} />;
      case 'pie': return <Pie key={rotationKey} data={chartData} options={chartOptions} />;
      case 'doughnut': return <Doughnut key={rotationKey} data={chartData} options={chartOptions} />;
      case 'radar': return <Radar data={chartData} options={chartOptions} />;
      case 'polar': return <PolarArea key={rotationKey} data={chartData} options={chartOptions} />;
      case 'scatter': return (
        <Scatter
          data={{
            datasets: [{
              label: `${yField} vs ${xField}`,
              data: data.map(row => ({ x: row[xField], y: row[yField] })),
              backgroundColor: solidColors,
            }],
          }}
          options={chartOptions}
        />
      );
      case 'bubble': return (
        <Bubble
          data={{
            datasets: [{
              label: `${yField} vs ${xField}`,
              data: data.map(row => ({
                x: row[xField],
                y: row[yField],
                r: parseFloat(row[rField]) / 3 || 5,
              })),
              backgroundColor: solidColors,
            }],
          }}
          options={chartOptions}
        />
      );
      case 'scatter3d': return (
        <Plot
          data={[{
            x: data.map(row => row[xField]),
            y: data.map(row => row[yField]),
            z: data.map(row => row[rField]),
            type: 'scatter3d',
            mode: 'markers',
            marker: {
              size: 5,
              color: data.map(row => row[rField]),
              colorscale: 'Viridis',
            },
          }]}
          layout={{
            title: '3D Scatter Plot',
            paper_bgcolor: '#121212',
            font: { color: '#00ffff' },
            scene: {
              xaxis: { title: xField },
              yaxis: { title: yField },
              zaxis: { title: rField },
            },
          }}
          useResizeHandler
          style={{ width: '100%', height: '400px' }}
        />
      );
      case 'bar3d': return (
        <Plot
          data={data.map((row, i) => ({
            type: 'scatter3d',
            mode: 'lines',
            x: [i, i],
            y: [0, 0],
            z: [0, parseFloat(row[yField])],
            line: { color: solidColors[i % solidColors.length], width: 10 },
          }))}
          layout={{
            title: '3D Bar Chart',
            paper_bgcolor: '#121212',
            font: { color: '#00ffff' },
            scene: {
              xaxis: { title: xField },
              yaxis: { title: 'Depth', visible: false },
              zaxis: { title: yField },
            },
          }}
          useResizeHandler
          style={{ width: '100%', height: '400px' }}
        />
      );

      case 'surface': {
        const xCategories = [...new Set(data.map(row => row[xField]))];
        const yCategories = [...new Set(data.map(row => row[yField]))];

        // Build Z matrix
        const zMatrix = yCategories.map(yVal => {
          return xCategories.map(xVal => {
            const match = data.find(row => row[xField] === xVal && row[yField] === yVal);
            return match ? parseFloat(match[rField]) || 0 : 0;
          });
        });

        return (
          <Plot
            data={[{
              type: 'surface',
              x: xCategories,
              y: yCategories,
              z: zMatrix,
              colorscale: 'Viridis',
            }]}
            layout={{
              title: '3D Surface Chart',
              paper_bgcolor: '#121212',
              font: { color: '#00ffff' },
              scene: {
                xaxis: { title: xField },
                yaxis: { title: yField },
                zaxis: { title: rField },
              },
            }}
            useResizeHandler
            style={{ width: '100%', height: '400px' }}
          />
        );
      }


      default: return <p>Unsupported chart type: {type}</p>;
    }
  };

  return (
    <div className="chart-container" style={{ minHeight: '400px' }}>
      {renderChart()}
    </div>
  );
};

export default Charts;
