import React from 'react';
import { Grid } from '@mui/material';
import SensorPlot from './SensorPlot';
import { styled } from '@mui/material';

// Custom styled Grid item for 3 columns
const GridItem = styled(Grid)(({ theme }) => ({
  flexBasis: '33.333%',
  maxWidth: '33.333%',
  padding: theme.spacing(1),
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    flexBasis: '100%',
    maxWidth: '100%',
  },
}));

function PlotGrid({ plots, timeStart, timeEnd, noiseFilter, windowSize, polynomialOrder }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '0 auto',
      }}
    >
      {plots.map((plot, index) => (
        <GridItem key={plot.key}>
          <SensorPlot
            plotData={plot}
            timeStart={timeStart}
            timeEnd={timeEnd}
            noiseFilter={noiseFilter || 'none'}
            windowSize={windowSize || 5}
            polynomialOrder={polynomialOrder || 2}
          />
        </GridItem>
      ))}
    </Grid>
  );
}

export default PlotGrid;