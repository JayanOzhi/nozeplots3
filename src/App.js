import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import UploadButton from './components/UploadButton';
import PlotGrid from './components/PlotGrid';
import TimeFilter from './components/TimeFilter';
import Documents from './components/Documents';
import theme from './theme';

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [plots, setPlots] = useState([]);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null); // Fixed: Changed setTimeStart to setTimeEnd
  const [originalPlots, setOriginalPlots] = useState([]);
  const [noiseFilter, setNoiseFilter] = useState('none');
  const [windowSize, setWindowSize] = useState(5);
  const [polynomialOrder, setPolynomialOrder] = useState(2);
  const [baselineStart, setBaselineStart] = useState(null);
  const [baselineEnd, setBaselineEnd] = useState(null);

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  const handleFileUpload = (plotPanels) => {
    console.log('Uploaded plots:', plotPanels);
    setPlots(plotPanels);
    setOriginalPlots(plotPanels);
    setTimeStart(null);
    setTimeEnd(null);
    setNoiseFilter('none');
    setWindowSize(5);
    setPolynomialOrder(2);
    setBaselineStart(null);
    setBaselineEnd(null);
  };

  const handleFilter = (start, end, filterType, winSize, polyOrder, baselineStartNum, baselineEndNum) => {
    console.log('Filter applied:', { start, end, filterType, winSize, polyOrder, baselineStartNum, baselineEndNum });
    setTimeStart(start);
    setTimeEnd(end);
    setNoiseFilter(filterType);
    setWindowSize(winSize);
    setPolynomialOrder(polyOrder);
    setBaselineStart(baselineStartNum);
    setBaselineEnd(baselineEndNum);
  };

  const handleReset = () => {
    console.log('Reset filters');
    setTimeStart(null);
    setTimeEnd(null);
    setNoiseFilter('none');
    setWindowSize(5);
    setPolynomialOrder(2);
    setBaselineStart(null);
    setBaselineEnd(null);
    setPlots(originalPlots);
  };

  console.log('Current state:', { tabValue, plots, timeStart, timeEnd, noiseFilter, windowSize, polynomialOrder, baselineStart, baselineEnd });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
        <Navbar value={tabValue} onChange={handleTabChange} />
        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {(tabValue === 0 || tabValue === 1) && (
            <Box display="flex" justifyContent="center" mb={3} width="100%">
              <UploadButton onFileUpload={handleFileUpload} />
            </Box>
          )}
          {plots.length > 0 && (
            <>
              {tabValue === 0 && (
                <Box display="flex" justifyContent="center" width="100%">
                  <PlotGrid
                    plots={plots}
                    timeStart={null}
                    timeEnd={null}
                    noiseFilter="none"
                    windowSize={5}
                    polynomialOrder={2}
                    baselineStart={null}
                    baselineEnd={null}
                  />
                </Box>
              )}
              {tabValue === 1 && (
                <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                  <Box display="flex" justifyContent="center" mb={3} width="100%">
                    <TimeFilter
                      onFilter={handleFilter}
                      onReset={handleReset}
                      initialWindowSize={windowSize}
                      initialPolynomialOrder={polynomialOrder}
                    />
                  </Box>
                  <Box display="flex" justifyContent="center" width="100%">
                    <PlotGrid
                      plots={plots}
                      timeStart={timeStart}
                      timeEnd={timeEnd}
                      noiseFilter={noiseFilter}
                      windowSize={windowSize}
                      polynomialOrder={polynomialOrder}
                      baselineStart={baselineStart}
                      baselineEnd={baselineEnd}
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
          {tabValue === 2 && (
            <Documents />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;