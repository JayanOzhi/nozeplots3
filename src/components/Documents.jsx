import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function Documents() {
  const renderMath = (tex, display = false) => {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: '0 auto', bgcolor: '#f5f5f5', borderRadius: '8px', boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
        Documentation for Noze Plots
      </Typography>
      <Divider sx={{ mb: 3, borderColor: '#ccc' }} />

      <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
        Overview
      </Typography>
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        Noze Plots is a web-based tool designed to visualize and analyze sensor data from CSV files. It provides an intuitive interface to upload data, view raw plots, apply filters, normalize data, and access detailed documentation. The application features three main tabs: "Plot," "Analyze," and "Documents."
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
        Features
      </Typography>
      <List sx={{ pl: 2 }}>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemText
            primary={<Typography sx={{ fontWeight: 'bold', color: '#333' }}>1. Data Upload</Typography>}
            secondary={<Typography sx={{ color: '#555' }}>Upload multiple CSV files containing sensor data. The app automatically groups data by concentration (e.g., ppm, uL) extracted from filenames.</Typography>}
          />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemText
            primary={<Typography sx={{ fontWeight: 'bold', color: '#333' }}>2. Plot Tab</Typography>}
            secondary={<Typography sx={{ color: '#555' }}>Displays raw data plots for each sensor column (e.g., CHR0, CHR1, etc.) in a responsive grid layout.</Typography>}
          />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemText
            primary={<Typography sx={{ fontWeight: 'bold', color: '#333' }}>3. Analyze Tab</Typography>}
            secondary={<Typography sx={{ color: '#555' }}>Allows users to apply time range filtering, noise filtering, and baseline normalization to the data, displaying both unfiltered and filtered plots.</Typography>}
          />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemText
            primary={<Typography sx={{ fontWeight: 'bold', color: '#333' }}>4. Documents Tab</Typography>}
            secondary={<Typography sx={{ color: '#555' }}>Provides detailed information on the app's logic, features, and usage instructions.</Typography>}
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
        Logic and Implementation
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: '#444', fontWeight: 'bold' }}>
        Data Processing
      </Typography>
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        - <strong>File Parsing</strong>: Utilizes Papa Parse to parse CSV files, extracting columns such as time and sensor data (e.g., CHR0 to CHR31, H0, T0, bVOC, GASR0, s0, s1).<br />
        - <strong>Grouping</strong>: Groups data by concentration extracted from filenames using the regular expression <code>(\\d+(\\.\\d+)?)(nL|uL|ppm)</code>.<br />
        - <strong>Mean Calculation</strong>: For each sensor column, computes the mean across trials for the same concentration using the equation:
      </Typography>
      <Typography paragraph sx={{ textAlign: 'center', fontStyle: 'italic', color: '#555', my: 2 }} dangerouslySetInnerHTML={{ __html: renderMath("\\text{Mean}(y) = \\frac{y_1 + y_2 + \\dots + y_n}{n}", true) }} />
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        where <span dangerouslySetInnerHTML={{ __html: renderMath("y_1, y_2, \\dots, y_n", false) }} /> are the values across <span dangerouslySetInnerHTML={{ __html: renderMath("n", false) }} /> trials.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: '#444', fontWeight: 'bold' }}>
        Time Range Filtering
      </Typography>
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        - Filters data to a user-specified time range (<code>timeStart</code> to <code>timeEnd</code>).<br />
        - Only data points within this range are plotted by filtering the time array and corresponding sensor values.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: '#444', fontWeight: 'bold' }}>
        Noise Filtering
      </Typography>
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        - <strong>Moving Average</strong>: Smooths data using a window size <span dangerouslySetInnerHTML={{ __html: renderMath("w", false) }} />:
      </Typography>
      <Typography paragraph sx={{ textAlign: 'center', fontStyle: 'italic', color: '#555', my: 2 }} dangerouslySetInnerHTML={{ __html: renderMath("y_{\\text{smooth}}[i] = \\frac{1}{w} \\sum_{j=i-\\lfloor w/2 \\rfloor}^{i+\\lfloor w/2 \\rfloor} y[j]", true) }} />
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        - <strong>Savitzky-Golay</strong>: Applies polynomial smoothing over a window size <span dangerouslySetInnerHTML={{ __html: renderMath("w", false) }} /> with a polynomial order <span dangerouslySetInnerHTML={{ __html: renderMath("p", false) }} />.<br />
        - <strong>Median Filter</strong>: Replaces each value with the median of neighboring values within a window size <span dangerouslySetInnerHTML={{ __html: renderMath("w", false) }} />:
      </Typography>
      <Typography paragraph sx={{ textAlign: 'center', fontStyle: 'italic', color: '#555', my: 2 }} dangerouslySetInnerHTML={{ __html: renderMath("y_{\\text{median}}[i] = \\text{median}(y[i - \\lfloor w/2 \\rfloor], \\dots, y[i], \\dots, y[i + \\lfloor w/2 \\rfloor])", true) }} />

      <Typography variant="h6" gutterBottom sx={{ color: '#444', fontWeight: 'bold' }}>
        Baseline Normalization
      </Typography>
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        - Users specify a baseline region (<code>baselineStart</code> to <code>baselineEnd</code>).<br />
        - The average <span dangerouslySetInnerHTML={{ __html: renderMath("y", false) }} />-value (<span dangerouslySetInnerHTML={{ __html: renderMath("y_{\\text{Avg}}", false) }} />) in this region is computed:
      </Typography>
      <Typography paragraph sx={{ textAlign: 'center', fontStyle: 'italic', color: '#555', my: 2 }} dangerouslySetInnerHTML={{ __html: renderMath("y_{\\text{Avg}} = \\frac{y_1 + y_2 + \\dots + y_m}{m}", true) }} />
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        where <span dangerouslySetInnerHTML={{ __html: renderMath("m", false) }} /> is the number of points in the baseline region.<br />
        - Data is normalized using the equation:
      </Typography>
      <Typography paragraph sx={{ textAlign: 'center', fontStyle: 'italic', color: '#555', my: 2 }} dangerouslySetInnerHTML={{ __html: renderMath("y_{\\text{normalized}} = 100 \\times \\frac{y - y_{\\text{Avg}}}{y_{\\text{Avg}}}", true) }} />
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        - The normalized data is then filtered if a noise filter is applied.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
        How to Use
      </Typography>
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        1. <strong>Upload CSV Files</strong>:
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li>Click "Upload CSV Files" to select one or more CSV files.</li>
          <li>Files should contain a "time" column and sensor columns (e.g., CHR0, CHR1).</li>
          <li>Concentrations are extracted from filenames (e.g., "data_100ppm.csv").</li>
        </ul>
        2. <strong>Plot Tab</strong>:
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li>Displays raw data plots for each sensor column in a responsive grid.</li>
        </ul>
        3. <strong>Analyze Tab</strong>:
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li><strong>Time Range</strong>: Enter start and end times to filter the data (e.g., 600 to 1200).</li>
          <li><strong>Noise Filter</strong>: Select a filter (Moving Average, Savitzky-Golay, Median Filter).</li>
          <li><strong>Window Size</strong>: Specify the window size for filtering (e.g., 5).</li>
          <li><strong>Polynomial Order</strong>: For Savitzky-Golay, specify the polynomial order (e.g., 2).</li>
          <li><strong>Baseline Region</strong>: Enter start and end times for normalization (e.g., 600 to 700).</li>
          <li>Click "Apply Filters" to update plots with filtered and normalized data.</li>
          <li>Click "Reset" to revert to raw data.</li>
        </ul>
        4. <strong>Documents Tab</strong>:
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li>Access this page for detailed information on the app's logic and usage.</li>
        </ul>
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
        Example
      </Typography>
      <Typography paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
        - Upload a CSV file with columns: <code>time</code>, <code>CHR0</code>, <code>CHR1</code>, etc.<br />
        - In the "Plot" tab, view raw data plots.<br />
        - Switch to the "Analyze" tab:
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li>Set Time Range: 600 to 1200</li>
          <li>Set Noise Filter: Moving Average, Window Size: 5</li>
          <li>Set Baseline Region: 600 to 700</li>
          <li>Click "Apply Filters"</li>
        </ul>
        - Plots will show normalized data (<span dangerouslySetInnerHTML={{ __html: renderMath("100 \\times \\frac{y - y_{\\text{Avg}}}{y_{\\text{Avg}}}", false) }} />) with unfiltered (blue) and filtered (red) signals.
      </Typography>
    </Box>
  );
}

export default Documents;