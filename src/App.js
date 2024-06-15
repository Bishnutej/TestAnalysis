import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import useLocalStorage from './hooks/useLocalStorage';
import 'chart.js/auto';
import './App.css';

function App() {
  const [testData, setTestData] = useLocalStorage('testData', {});
  const [formState, setFormState] = useState({
    platform: 'Platform 1',
    testSeries: 'Series 1',
    testNumber: 1,
    attemptNumber: 1,
    quantitative: 0,
    reasoning: 0,
    english: 0
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { platform, testSeries, testNumber, attemptNumber, quantitative, reasoning, english } = formState;
    const totalScore = parseInt(quantitative) + parseInt(reasoning) + parseInt(english);

    const updatedTestData = { ...testData };

    if (!updatedTestData[platform]) {
      updatedTestData[platform] = {};
    }

    if (!updatedTestData[platform][testSeries]) {
      updatedTestData[platform][testSeries] = {};
    }

    if (!updatedTestData[platform][testSeries][testNumber]) {
      updatedTestData[platform][testSeries][testNumber] = {};
    }

    updatedTestData[platform][testSeries][testNumber][attemptNumber] = {
      quantitative,
      reasoning,
      english,
      totalScore
    };

    setTestData(updatedTestData);
    setFormState({ ...formState, testNumber: '', attemptNumber: '', quantitative: '', reasoning: '', english: '' });
  };

  const handleClearTestData = () => {
    const { platform, testSeries, testNumber } = formState;
    const updatedTestData = { ...testData };

    if (updatedTestData[platform] && updatedTestData[platform][testSeries] && updatedTestData[platform][testSeries][testNumber]) {
      delete updatedTestData[platform][testSeries][testNumber];
      setTestData(updatedTestData);
    }
  };

  const updateChart = () => {
    const { platform, testSeries } = formState;

    if (!testData[platform] || !testData[platform][testSeries]) return;

    const seriesData = testData[platform][testSeries];
    const testNumbers = Object.keys(seriesData).sort((a, b) => a - b);
    const quantitativeScores = [];
    const reasoningScores = [];
    const englishScores = [];
    const totalScores = [];

    testNumbers.forEach(testNumber => {
      const attempts = Object.values(seriesData[testNumber]);
      const latestAttempt = attempts[attempts.length - 1];

      quantitativeScores.push(latestAttempt.quantitative);
      reasoningScores.push(latestAttempt.reasoning);
      englishScores.push(latestAttempt.english);
      totalScores.push(latestAttempt.totalScore);
    });

    return {
      labels: testNumbers,
      datasets: [
        {
          label: 'Quantitative',
          data: quantitativeScores,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false
        },
        {
          label: 'Reasoning',
          data: reasoningScores,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false
        },
        {
          label: 'English',
          data: englishScores,
          borderColor: 'rgb(255, 206, 86)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          fill: false
        },
        {
          label: 'Total Score',
          data: totalScores,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: false
        }
      ]
    };
  };

  const chartData = updateChart();

  return (
    <div className="App">
      <h1>Test Series Analysis</h1>
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>
              Platform:
              <select name="platform" value={formState.platform} onChange={handleChange}>
                <option value="Platform 1">Testbook</option>
                <option value="Platform 2">Guidely</option>
                <option value="Platform 3">Smartkeeda</option>
              </select>
            </label><br />

            <label>
              Test Series:
              <select name="testSeries" value={formState.testSeries} onChange={handleChange}>
                <option value="Series 1">RRB PO</option>
                <option value="Series 2">RRB Clerk</option>
                <option value="Series 3">IBPS PO</option>
                <option value="Series 4">IBPS Clerk</option>
                <option value="Series 5">SBI PO</option>
                <option value="Series 6">SBI Clerk</option>
              </select>
            </label><br />

            <label>
              Test Number:
              <input type="number" name="testNumber" min="1" max="30" value={formState.testNumber} onChange={handleChange} required />
            </label><br />

            <label>
              Attempt Number:
              <input type="number" name="attemptNumber" min="1" max="10" value={formState.attemptNumber} onChange={handleChange} required />
            </label><br />

            <label>
              Quantitative (out of 35):
              <input type="number" name="quantitative" value={formState.quantitative} onChange={handleChange} required />
            </label><br />

            <label>
              Reasoning (out of 35):
              <input type="number" name="reasoning" value={formState.reasoning} onChange={handleChange} required />
            </label><br />

            <label>
              English (out of 20):
              <input type="number" name="english" value={formState.english} onChange={handleChange} required />
            </label><br />

            <button type="submit">Add Test</button>
          </form>
          <button onClick={handleClearTestData}>Clear Test Data</button>
        </div>
        <div className="chart-container">
          {chartData && <Line data={chartData} />}
        </div>
      </div>
    </div>
  );
}

export default App;
