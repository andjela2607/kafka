import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const App = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [tempInC, setTempInC] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [pressure, setPressure] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:8000');

    socket.on('message', (message) => {
      const newData = JSON.parse(message);

      if (newData.hasOwnProperty('temperature_in_c')) {
        setTempInC(newData.temperature_in_c);
      }

      setData((prevData) => [...prevData, newData]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Formatiranje podataka za grafikon samo ako postoje podaci
    if (data.length > 0) {
      const chartLabels = data.map((entry) => {
        const date = new Date(entry.dt * 1000);
        return date.toLocaleTimeString(); // Formatiraj datum u "dd/MM/yy"
      });

      const chartTemperatureData = data.map((entry) => entry?.main?.temp);
      const chartMaxTemperatureData = data.map((entry) => entry?.main?.temp_max);
      const chartMinTemperatureData = data.map((entry) => entry?.main?.temp_min);
      const chartFeelsLike = data.map((entry) => entry?.main?.feels_like)
      const humidityArray = data.map((entry) => entry?.main?.humidity)
      const pressureArray = data.map((entry) => entry?.main?.pressure)

      setTempInC(chartTemperatureData[0] - 273.15);
      setHumidity(humidityArray[0]);
      setPressure(pressureArray[0]);
      
      setChartData({
        labels: chartLabels,

        datasets: [
          {
            label: 'Temperatura',
            data: chartTemperatureData,
            fill: false,
            borderColor: '#000',
            tension: 0.1,
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.1,
              },
            },
          },
          {
            label: 'Max Temperature',
            data: chartMaxTemperatureData,
            fill: false,
            borderColor: '#ef0326',
            tension: 0.1,
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.1,
              }
            }
          },
          {
            label: 'Min Temperature',
            data: chartMinTemperatureData,
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.1,
              }
            }
          },
          {
            label: 'Feels Like',
            data: chartFeelsLike,
            fill: false,
            borderColor: 'yellow',
            tension: 0.1,
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.1,
              }
            }
          }
        ],
      });
    }
  }, [data]);

  return (
    <div>
      {/* Prikazivanje grafikona samo ako postoje podaci */}
      {chartData && <Line data={chartData} />}
      <p>Temperature in Celsius: {tempInC?.toFixed(2)} °C</p>
      {humidity && <p>Humidity: {humidity} % </p>}
      {pressure && <p>Atmospheric pressure: {pressure} mbar</p>}
    </div>
  );
};

export default App;