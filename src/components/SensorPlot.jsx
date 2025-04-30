import React from 'react';
import Plot from 'react-plotly.js';
import { Box } from '@mui/material';
import { mean, movingAverage, savitzkyGolay, medianFilter } from '../utils/utils';

function SensorPlot({ plotData, timeStart, timeEnd, noiseFilter, windowSize, polynomialOrder }) {
  const { key, fileGroups } = plotData;
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'];
  let colorIndex = 0;
  let yMin = Infinity;
  let yMax = -Infinity;
  const traces = [];

  for (const [concentration, trials] of Object.entries(fileGroups)) {
    const valueArrays = trials
      .map(trial => trial.allColumns[key])
      .filter(arr => arr && arr.length > 0);
    if (valueArrays.length === 0) {
      console.log(`No data for ${key} in ${concentration}`);
      continue;
    }

    // Use count (1, 2, 3, ...) for x-axis
    let times = Array.from({ length: trials[0].time.length }, (_, i) => i + 1);
    let filteredValueArrays = valueArrays;

    // Filter data based on time range
    if (timeStart !== null && timeEnd !== null && timeStart <= timeEnd) {
      const indicesInRange = times
        .map((t, i) => ({ time: t, index: i }))
        .filter(t => t.time >= timeStart && t.time <= timeEnd)
        .map(t => t.index);

      if (indicesInRange.length === 0) {
        console.log(`No data in range ${timeStart}-${timeEnd} for ${key} in ${concentration}`);
        continue;
      }

      times = times.filter(t => t >= timeStart && t <= timeEnd);
      filteredValueArrays = valueArrays.map(arr =>
        indicesInRange.map(i => arr[i])
      );
    }

    // Calculate unfiltered mean
    let avgUnfiltered = mean(filteredValueArrays);

    // Calculate filtered mean
    let avgFiltered = [...avgUnfiltered]; // Start with the unfiltered mean
    if (noiseFilter === 'movingAverage') {
      avgFiltered = movingAverage(avgFiltered, windowSize);
    } else if (noiseFilter === 'savitzkyGolay') {
      avgFiltered = savitzkyGolay(avgFiltered, windowSize, polynomialOrder);
    } else if (noiseFilter === 'medianFilter') {
      avgFiltered = medianFilter(avgFiltered, windowSize);
    }

    console.log(`After filtering - ${key} in ${concentration}: times.length=${times.length}, avgUnfiltered.length=${avgUnfiltered.length}, avgFiltered.length=${avgFiltered.length}, filteredValueArrays.length=${filteredValueArrays[0]?.length}`);
    console.log(`Sample unfiltered data - ${key} in ${concentration}: ${avgUnfiltered.slice(0, 5)}`);
    console.log(`Sample filtered data - ${key} in ${concentration}: ${avgFiltered.slice(0, 5)}`);

    // Update y-axis range based on unfiltered and filtered data
    yMin = Math.min(yMin, ...avgUnfiltered, ...(noiseFilter !== 'none' ? avgFiltered : []));
    yMax = Math.max(yMax, ...avgUnfiltered, ...(noiseFilter !== 'none' ? avgFiltered : []));

    const traceColor = colors[colorIndex % colors.length];

    // Add unfiltered signal (blue, default color, slightly transparent if filtered) first
    traces.push({
      x: times,
      y: avgUnfiltered,
      type: 'scatter',
      mode: 'lines',
      name: `${concentration} Raw`,
      line: { width: 2, color: traceColor },
      opacity: noiseFilter !== 'none' ? 0.3 : 1, // 30% opacity if filtered, full opacity otherwise
    });

    // Add filtered signal (red) last, so it renders on top
    if (noiseFilter !== 'none') {
      traces.push({
        x: times,
        y: avgFiltered,
        type: 'scatter',
        mode: 'lines',
        name: `${concentration} Filtered`,
        line: { width: 3, color: '#ff0000' }, // Slightly thicker line for visibility
        opacity: 1, // Full opacity for filtered signal
      });
    }

    colorIndex++;
  }

  // Set axis ranges with padding
  const xMax = traces.length > 0 ? Math.max(...traces[0].x) : 1;
  const yPadding = (yMax - yMin) * 0.1 || 0.1; // 10% padding, avoid zero
  const xRange = [timeStart !== null ? timeStart : 0, timeEnd !== null ? timeEnd : xMax + 1];
  const yRange = [yMin - yPadding, yMax + yPadding];

  console.log(`Plot ${key}: xRange=${xRange}, yRange=${yRange}`);

  return (
    <Box sx={{ width: 400, height: 300 }}>
      <Plot
        data={traces}
        layout={{
          title: {
            text: key,
            x: 0.5,
            xanchor: 'center',
            font: { size: 16, family: 'Arial', color: '#333' },
          },
          xaxis: {
            title: 'Time[s]',
            titlefont: { size: 14, family: 'Arial', color: '#333' },
            range: xRange,
            showgrid: true,
            gridcolor: '#e0e0e0',
            zeroline: true,
            zerolinecolor: '#666',
            linecolor: '#666',
            linewidth: 1,
            showline: true,
            mirror: true,
          },
          yaxis: {
            title: key,
            titlefont: { size: 14, family: 'Arial', color: '#333' },
            range: yRange,
            showgrid: true,
            gridcolor: '#e0e0e0',
            zeroline: true,
            zerolinecolor: '#666',
            linecolor: '#666',
            linewidth: 1,
            showline: true,
            mirror: true,
          },
          width: 400,
          height: 300,
          margin: { t: 60, l: 50, r: 50, b: 60 }, // Balanced left and right margins
          plot_bgcolor: '#ffffff',
          paper_bgcolor: '#f5f5f5',
          showlegend: true,
          legend: {
            x: 0.02,
            y: 0.98,
            xanchor: 'left',
            yanchor: 'top',
            bgcolor: 'rgba(255,255,255,0.8)',
            bordercolor: '#ccc',
            borderwidth: 1,
          },
          shapes: [
            {
              type: 'rect',
              xref: 'paper',
              yref: 'paper',
              x0: 0,
              y0: 0,
              x1: 1,
              y1: 1,
              line: {
                color: '#666',
                width: 1,
              },
            },
          ],
        }}
        config={{ responsive: false }}
      />
    </Box>
  );
}

export default SensorPlot;