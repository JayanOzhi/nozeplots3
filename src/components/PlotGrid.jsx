import React from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import SensorPlot from './SensorPlot';

// Styled Grid item for consistent 3-column layout
const GridItem = styled(Grid)(({ theme }) => ({
  flexBasis: '33.333%',
  maxWidth: '33.333%',
  padding: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'center',
  boxSizing: 'border-box',

  [theme.breakpoints.down('md')]: {
    flexBasis: '50%',
    maxWidth: '50%',
  },
  [theme.breakpoints.down('sm')]: {
    flexBasis: '100%',
    maxWidth: '100%',
  },
}));

function PlotGrid({ plots, timeStart, timeEnd, noiseFilter, windowSize, polynomialOrder, baselineStart, baselineEnd, showRaw }) {
  return (
    <Grid
      container
      spacing={0.5}
      sx={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        margin: 0,
      }}
    >
      {plots.map((plot) => (
        <GridItem item key={plot.key}>
          <SensorPlot
            plotData={plot}
            timeStart={timeStart}
            timeEnd={timeEnd}
            noiseFilter={noiseFilter}
            windowSize={windowSize}
            polynomialOrder={polynomialOrder}
            baselineStart={baselineStart}
            baselineEnd={baselineEnd}
            showRaw={showRaw}
          />
        </GridItem>
      ))}
    </Grid>
  );
}

export default PlotGrid;