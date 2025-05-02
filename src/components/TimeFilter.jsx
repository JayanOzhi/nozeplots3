import React from 'react';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, styled } from '@mui/material';

const FilterButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#999',
  color: '#ffffff',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#777',
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
}));

const ToggleRawButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ff9800',
  color: '#ffffff',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f57c00',
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
}));

function TimeFilter({ 
  onFilter, 
  onReset, 
  onToggleRaw, 
  showRaw, 
  startInput, 
  setStartInput, 
  endInput, 
  setEndInput, 
  filterTypeInput, 
  setFilterTypeInput, 
  windowSizeInput, 
  setWindowSizeInput, 
  polynomialOrderInput, 
  setPolynomialOrderInput, 
  baselineStartInput, 
  setBaselineStartInput, 
  baselineEndInput, 
  setBaselineEndInput 
}) {
  const handleFilterClick = () => {
    const startNum = parseInt(startInput, 10);
    const endNum = parseInt(endInput, 10);
    const winSizeNum = parseInt(windowSizeInput, 10);
    const polyOrderNum = parseInt(polynomialOrderInput, 10);
    const baselineStartNum = parseInt(baselineStartInput, 10);
    const baselineEndNum = parseInt(baselineEndInput, 10);

    if (startInput === '' || endInput === '') {
      alert('Please specify both start and end time counts for the analysis.');
      return;
    }

    if (isNaN(startNum) || isNaN(endNum) || startNum < 0 || endNum < startNum) {
      alert('Please enter valid start and end time counts (start >= 0, end >= start).');
      return;
    }

    if (filterTypeInput !== 'none') {
      if (isNaN(winSizeNum) || winSizeNum < 3) {
        alert('Window size must be a number >= 3.');
        return;
      }
      if (filterTypeInput === 'savitzkyGolay') {
        if (winSizeNum % 2 === 0) {
          alert('Window size must be odd for Savitzky-Golay filter.');
          return;
        }
        if (isNaN(polyOrderNum) || polyOrderNum < 1 || polyOrderNum >= winSizeNum) {
          alert('Polynomial order must be a number >= 1 and < window size.');
          return;
        }
      }
    }

    if (baselineStartInput !== '' && baselineEndInput !== '') {
      if (isNaN(baselineStartNum) || isNaN(baselineEndNum) || baselineStartNum < 0 || baselineEndNum < baselineStartNum) {
        alert('Please enter valid baseline start and end time counts (start >= 0, end >= start).');
        return;
      }
    }

    onFilter(
      startNum,
      endNum,
      filterTypeInput,
      winSizeNum,
      polyOrderNum,
      baselineStartInput !== '' ? baselineStartNum : null,
      baselineEndInput !== '' ? baselineEndNum : null
    );
  };

  const handleToggleRaw = () => {
    onToggleRaw();
  };

  console.log('Rendering TimeFilter');

  return (
    <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      gap={1}
      sx={{
        backgroundColor: '#f5f5f5',
        padding: 2,
        borderRadius: '8px',
        boxShadow: 2,
        justifyContent: 'center',
        width: 'auto',
      }}
    >
      <TextField
        label="Start Time Count"
        type="number"
        value={startInput}
        onChange={(e) => setStartInput(e.target.value)}
        size="small"
        sx={{
          width: 150,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
            borderRadius: '4px',
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#555',
          },
        }}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <TextField
        label="End Time Count"
        type="number"
        value={endInput}
        onChange={(e) => setEndInput(e.target.value)}
        size="small"
        sx={{
          width: 150,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
            borderRadius: '4px',
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#555',
          },
        }}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <TextField
        label="Baseline Start"
        type="number"
        value={baselineStartInput}
        onChange={(e) => setBaselineStartInput(e.target.value)}
        size="small"
        sx={{
          width: 150,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
            borderRadius: '4px',
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#555',
          },
        }}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <TextField
        label="Baseline End"
        type="number"
        value={baselineEndInput}
        onChange={(e) => setBaselineEndInput(e.target.value)}
        size="small"
        sx={{
          width: 150,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
            borderRadius: '4px',
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#555',
          },
        }}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <FormControl
        size="small"
        sx={{
          width: 180,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
            borderRadius: '4px',
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#555',
          },
        }}
      >
        <InputLabel>Noise Filter</InputLabel>
        <Select
          value={filterTypeInput}
          label="Noise Filter"
          onChange={(e) => setFilterTypeInput(e.target.value)}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="movingAverage">Moving Average</MenuItem>
          <MenuItem value="savitzkyGolay">Savitzky-Golay</MenuItem>
          <MenuItem value="medianFilter">Median Filter</MenuItem>
        </Select>
      </FormControl>
      {filterTypeInput !== 'none' && (
        <TextField
          label="Window Size"
          type="number"
          value={windowSizeInput}
          onChange={(e) => setWindowSizeInput(e.target.value)}
          size="small"
          sx={{
            width: 120,
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '4px',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              color: '#555',
            },
          }}
          InputProps={{ inputProps: { min: 3 } }}
        />
      )}
      {filterTypeInput === 'savitzkyGolay' && (
        <TextField
          label="Polynomial Order"
          type="number"
          value={polynomialOrderInput}
          onChange={(e) => setPolynomialOrderInput(e.target.value)}
          size="small"
          sx={{
            width: 150,
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '4px',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              color: '#555',
            },
          }}
          InputProps={{ inputProps: { min: 1, max: windowSizeInput - 1 } }}
        />
      )}
      <FilterButton onClick={handleFilterClick}>
        Apply Filters
      </FilterButton>
      <ResetButton onClick={onReset}>
        Reset
      </ResetButton>
      <ToggleRawButton onClick={onToggleRaw}>
        {showRaw ? 'Hide Raw Plots' : 'Show Raw Plots'}
      </ToggleRawButton>
    </Box>
  );
}

export default TimeFilter;