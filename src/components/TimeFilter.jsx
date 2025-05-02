import React, { useState } from 'react';
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

function TimeFilter({ onFilter, onReset, initialWindowSize, initialPolynomialOrder }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [filterType, setFilterType] = useState('none');
  const [windowSize, setWindowSize] = useState(initialWindowSize);
  const [polynomialOrder, setPolynomialOrder] = useState(initialPolynomialOrder);
  const [baselineStart, setBaselineStart] = useState('');
  const [baselineEnd, setBaselineEnd] = useState('');

  const handleFilterClick = () => {
    const startNum = parseInt(start, 10);
    const endNum = parseInt(end, 10);
    const winSizeNum = parseInt(windowSize, 10);
    const polyOrderNum = parseInt(polynomialOrder, 10);
    const baselineStartNum = parseInt(baselineStart, 10);
    const baselineEndNum = parseInt(baselineEnd, 10);

    if (start === '' || end === '') {
      alert('Please specify both start and end time counts for the analysis.');
      return;
    }

    if (isNaN(startNum) || isNaN(endNum) || startNum < 0 || endNum < startNum) {
      alert('Please enter valid start and end time counts (start >= 0, end >= start).');
      return;
    }

    if (filterType !== 'none') {
      if (isNaN(winSizeNum) || winSizeNum < 3) {
        alert('Window size must be a number >= 3.');
        return;
      }
      if (filterType === 'savitzkyGolay') {
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

    if (baselineStart !== '' && baselineEnd !== '') {
      if (isNaN(baselineStartNum) || isNaN(baselineEndNum) || baselineStartNum < 0 || baselineEndNum < baselineStartNum) {
        alert('Please enter valid baseline start and end time counts (start >= 0, end >= start).');
        return;
      }
    }

    onFilter(
      startNum,
      endNum,
      filterType,
      winSizeNum,
      polyOrderNum,
      baselineStart !== '' ? baselineStartNum : null,
      baselineEnd !== '' ? baselineEndNum : null
    );
  };

  const handleResetClick = () => {
    setStart('');
    setEnd('');
    setFilterType('none');
    setWindowSize(initialWindowSize);
    setPolynomialOrder(initialPolynomialOrder);
    setBaselineStart('');
    setBaselineEnd('');
    onReset();
  };

  console.log('Rendering TimeFilter'); // Debug rendering

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
        value={start}
        onChange={(e) => setStart(e.target.value)}
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
        value={end}
        onChange={(e) => setEnd(e.target.value)}
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
        value={baselineStart}
        onChange={(e) => setBaselineStart(e.target.value)}
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
        value={baselineEnd}
        onChange={(e) => setBaselineEnd(e.target.value)}
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
          value={filterType}
          label="Noise Filter"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="movingAverage">Moving Average</MenuItem>
          <MenuItem value="savitzkyGolay">Savitzky-Golay</MenuItem>
          <MenuItem value="medianFilter">Median Filter</MenuItem>
        </Select>
      </FormControl>
      {filterType !== 'none' && (
        <TextField
          label="Window Size"
          type="number"
          value={windowSize}
          onChange={(e) => setWindowSize(e.target.value)}
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
      {filterType === 'savitzkyGolay' && (
        <TextField
          label="Polynomial Order"
          type="number"
          value={polynomialOrder}
          onChange={(e) => setPolynomialOrder(e.target.value)}
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
          InputProps={{ inputProps: { min: 1, max: windowSize - 1 } }}
        />
      )}
      <FilterButton onClick={handleFilterClick}>
        Apply Filters
      </FilterButton>
      <ResetButton onClick={handleResetClick}>
        Reset
      </ResetButton>
    </Box>
  );
}

export default TimeFilter;