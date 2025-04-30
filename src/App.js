import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import UploadButton from './components/UploadButton';
import PlotGrid from './components/PlotGrid';
import TimeFilter from './components/TimeFilter';
import theme from './theme';

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [plots, setPlots] = useState([]);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);
  const [originalPlots, setOriginalPlots] = useState([]);
  const [noiseFilter, setNoiseFilter] = useState('none');
  const [windowSize, setWindowSize] = useState(5);
  const [polynomialOrder, setPolynomialOrder] = useState(2);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileUpload = (plotPanels) => {
    setPlots(plotPanels);
    setOriginalPlots(plotPanels);
    setTimeStart(null);
    setTimeEnd(null);
    setNoiseFilter('none');
    setWindowSize(5);
    setPolynomialOrder(2);
  };

  const handleFilter = (start, end, filterType, winSize, polyOrder) => {
    setTimeStart(start);
    setTimeEnd(end);
    setNoiseFilter(filterType);
    setWindowSize(winSize);
    setPolynomialOrder(polyOrder);
  };

  const handleReset = () => {
    setTimeStart(null);
    setTimeEnd(null);
    setNoiseFilter('none');
    setWindowSize(5);
    setPolynomialOrder(2);
    setPlots(originalPlots);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minWidth: '100vw', // Force full viewport width
          minHeight: '100vh', // Force full viewport height
          bgcolor: '#f0f2f5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Align content at the top
          alignItems: 'center', // Center horizontally
          margin: 0, // Remove any default margins
          padding: 0, // Remove any default padding
        }}
      >
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
          <Box display="flex" justifyContent="center" mb={3} width="100%">
            <UploadButton onFileUpload={handleFileUpload} />
          </Box>
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
                  />
                </Box>
              )}
              {tabValue === 1 && (
                <>
                  <Box display="flex" justifyContent="center" mb={3} width="100%">
                    <TimeFilter
                      onFilter={handleFilter}
                      onReset={handleReset}
                      initialWindowSize={windowSize}
                      initialPolynomialOrder={polynomialOrder}
                    />
                  </Box>
                  {(timeStart !== null && timeEnd !== null) && (
                    <Box display="flex" justifyContent="center" width="100%">
                      <PlotGrid
                        plots={plots}
                        timeStart={timeStart}
                        timeEnd={timeEnd}
                        noiseFilter={noiseFilter}
                        windowSize={windowSize}
                        polynomialOrder={polynomialOrder}
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;