import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
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
  const [timeEnd, setTimeEnd] = useState(null);
  const [originalPlots, setOriginalPlots] = useState([]);
  const [noiseFilter, setNoiseFilter] = useState('none');
  const [windowSize, setWindowSize] = useState(5);
  const [polynomialOrder, setPolynomialOrder] = useState(2);
  const [baselineStart, setBaselineStart] = useState(null);
  const [baselineEnd, setBaselineEnd] = useState(null);
  const [showRaw, setShowRaw] = useState(true);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [filterTypeInput, setFilterTypeInput] = useState('none');
  const [windowSizeInput, setWindowSizeInput] = useState(5);
  const [polynomialOrderInput, setPolynomialOrderInput] = useState(2);
  const [baselineStartInput, setBaselineStartInput] = useState('');
  const [baselineEndInput, setBaselineEndInput] = useState('');
  const [uploadedFileNames, setUploadedFileNames] = useState([]);

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  const handleFileUpload = (plotPanels, fileNames) => {
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
    setShowRaw(true);
    setStartInput('');
    setEndInput('');
    setFilterTypeInput('none');
    setWindowSizeInput(5);
    setPolynomialOrderInput(2);
    setBaselineStartInput('');
    setBaselineEndInput('');
    setUploadedFileNames(fileNames);
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
    setShowRaw(true);
    setPlots(originalPlots);
    setStartInput('');
    setEndInput('');
    setFilterTypeInput('none');
    setWindowSizeInput(5);
    setPolynomialOrderInput(2);
    setBaselineStartInput('');
    setBaselineEndInput('');
    setUploadedFileNames([]);
  };

  const handleToggleRaw = () => {
    setShowRaw(prev => !prev);
  };

  console.log('Current state:', { tabValue, plots, timeStart, timeEnd, noiseFilter, windowSize, polynomialOrder, baselineStart, baselineEnd, showRaw });

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
            <Box display="flex" flexDirection="column" alignItems="center" mb={3} width="100%">
              <UploadButton onFileUpload={handleFileUpload} />
              {uploadedFileNames.length > 0 && (
                <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                  {uploadedFileNames.map((fileName, index) => (
                    <Box key={index} display="flex" alignItems="center" mt={1}>
                      <FontAwesomeIcon
                        icon={faFileCsv}
                        style={{ color: '#00DE93', marginRight: 8, fontSize: 24 }}
                      />
                      <Typography sx={{ color: '#555' }}>{fileName}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
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
                    showRaw={true}
                  />
                </Box>
              )}
              {tabValue === 1 && (
                <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                  <Box display="flex" justifyContent="center" mb={3} width="100%">
                    <TimeFilter
                      onFilter={handleFilter}
                      onReset={handleReset}
                      initialWindowSize={windowSizeInput}
                      initialPolynomialOrder={polynomialOrderInput}
                      onToggleRaw={handleToggleRaw}
                      showRaw={showRaw}
                      startInput={startInput}
                      setStartInput={setStartInput}
                      endInput={endInput}
                      setEndInput={setEndInput}
                      filterTypeInput={filterTypeInput}
                      setFilterTypeInput={setFilterTypeInput}
                      windowSizeInput={windowSizeInput}
                      setWindowSizeInput={setWindowSizeInput}
                      polynomialOrderInput={polynomialOrderInput}
                      setPolynomialOrderInput={setPolynomialOrderInput}
                      baselineStartInput={baselineStartInput}
                      setBaselineStartInput={setBaselineStartInput}
                      baselineEndInput={baselineEndInput}
                      setBaselineEndInput={setBaselineEndInput}
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
                      showRaw={showRaw}
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