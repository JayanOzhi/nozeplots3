import React from 'react';
import Plot from 'react-plotly.js';
import { Box } from '@mui/material';
import { mean, movingAverage, savitzkyGolay, medianFilter } from '../utils/utils';

function SensorPlot({ plotData, timeStart, timeEnd, noiseFilter, windowSize, polynomialOrder, baselineStart, baselineEnd }) {
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

    // Ensure all values in valueArrays are numbers
    const cleanedValueArrays = valueArrays.map(arr =>
      arr.map(val => (typeof val === 'number' && !isNaN(val) ? val : 0))
    );

    let times = Array.from({ length: trials[0].time.length }, (_, i) => i + 1);
    let filteredValueArrays = cleanedValueArrays;

    // Apply time range filter
    if (timeStart !== null && timeEnd !== null && timeStart <= timeEnd) {
      const indicesInRange = times
        .map((t, i) => ({ time: t, index: i }))
        .filter(t => t.time >= timeStart && t.time <= timeEnd)
        .map(t => t.index);

      if (indicesInRange.length === 0) {
        console.log(`No data in range ${timeStart}-${timeEnd} for ${key} in ${concentration}`);
        continue;
      }

      times = indicesInRange.map(i => times[i]);
      filteredValueArrays = cleanedValueArrays.map(arr =>
        indicesInRange.map(i => arr[i])
      );
    }

    let avgUnfiltered = mean(filteredValueArrays);
    let avgFiltered = [...avgUnfiltered];

    // Normalize if baseline region is specified
    let normalizedUnfiltered = [...avgUnfiltered];
    let normalizedFiltered = [...avgFiltered];

    if (baselineStart !== null && baselineEnd !== null && baselineStart <= baselineEnd) {
      const baselineIndices = times
        .map((t, i) => ({ time: t, index: i }))
        .filter(t => t.time >= baselineStart && t.time <= baselineEnd)
        .map(t => t.index);

      if (baselineIndices.length > 0) {
        const baselineValues = avgUnfiltered.filter((_, i) => baselineIndices.includes(i));
        const yAvg = baselineValues.reduce((sum, val) => sum + val, 0) / baselineValues.length;

        if (yAvg !== 0) {
          normalizedUnfiltered = avgUnfiltered.map(y => 100 * (y - yAvg) / yAvg);
          normalizedFiltered = avgFiltered.map(y => 100 * (y - yAvg) / yAvg);
        } else {
          console.log(`Baseline average is zero for ${key} in ${concentration}, skipping normalization`);
        }
      } else {
        console.log(`No data in baseline range ${baselineStart}-${baselineEnd} for ${key} in ${concentration}`);
      }
    }

    // Apply noise filter to normalized data
    if (noiseFilter !== 'none') {
      if (noiseFilter === 'movingAverage') {
        normalizedFiltered = movingAverage(normalizedFiltered, windowSize);
      } else if (noiseFilter === 'savitzkyGolay') {
        normalizedFiltered = savitzkyGolay(normalizedFiltered, windowSize, polynomialOrder);
      } else if (noiseFilter === 'medianFilter') {
        normalizedFiltered = medianFilter(normalizedFiltered, windowSize);
      }
    }

    yMin = Math.min(yMin, ...normalizedUnfiltered, ...(noiseFilter !== 'none' ? normalizedFiltered : []));
    yMax = Math.max(yMax, ...normalizedUnfiltered, ...(noiseFilter !== 'none' ? normalizedFiltered : []));

    const traceColor = colors[colorIndex % colors.length];

    traces.push({
      x: times,
      y: normalizedUnfiltered,
      type: 'scatter',
      mode: 'lines',
      name: `${concentration} Raw`,
      line: { width: 2, color: traceColor },
      opacity: noiseFilter !== 'none' ? 0.3 : 1,
    });

    if (noiseFilter !== 'none') {
      traces.push({
        x: times,
        y: normalizedFiltered,
        type: 'scatter',
        mode: 'lines',
        name: `${concentration} Filtered`,
        line: { width: 3, color: '#ff0000' },
        opacity: 1,
      });
    }

    colorIndex++;
  }

  const xMax = traces.length > 0 ? Math.max(...traces[0].x) : 1;
  const yPadding = (yMax - yMin) * 0.1 || 0.1;
  const xRange = [timeStart !== null ? timeStart : 0, timeEnd !== null ? timeEnd : xMax + 1];
  const yRange = [yMin - yPadding, yMax + yPadding];

  return (
    <Box sx={{ width: 360, height: 300 }}>
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
            title: baselineStart !== null && baselineEnd !== null ? '% Change from Baseline' : key,
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
          width: 500,
          height: 350,
          margin: { t: 60, l: 50, r: 50, b: 60 },
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