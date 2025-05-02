import React, { useRef } from 'react';
import { Box, Button, styled } from '@mui/material';
import Papa from 'papaparse';
import { mean } from '../utils/utils';

// Custom styled Button
const UploadButtonStyled = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[6],
    transform: 'translateY(-2px)',
  },
}));

function UploadButton({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name); // Extract file names
    const fileGroups = {};

    // Parse files and group by concentration
    for (const file of files) {
      await new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            if (!data || data.length === 0) {
              console.log(`Skipping empty file: ${file.name}`);
              resolve();
              return;
            }

            const concentrationMatch = file.name.match(/(\d+(\.\d+)?)(nL|uL|ppm)/);
            const concentration = concentrationMatch ? concentrationMatch[0] : 'unknown';

            if (!fileGroups[concentration]) fileGroups[concentration] = [];

            const time = data.map(row => row['time'] ?? row['Timestamp (YYMMDDHHMMSS)'] ?? 0);
            
            // Define allowed columns: CHR0-CHR31, H0, T0, bVOC, GASR0, s0, s1
            const allowedColumns = [
              'H0', 'T0', 'bVOC', 'GASR0', 's0', 's1',
              ...Array.from({ length: 32 }, (_, i) => `CHR${i}`)
            ];
            
            // Filter keys to only include allowed columns
            const keys = Object.keys(data[0])
              .filter(k => k !== 'time' && k !== 'Timestamp (YYMMDDHHMMSS)')
              .filter(k => allowedColumns.includes(k));

            const allColumns = keys.reduce((acc, key) => {
              acc[key] = data.map(row => parseFloat(row[key] ?? 0));
              return acc;
            }, {});

            fileGroups[concentration].push({ time, allColumns });
            resolve();
          },
        });
      });
    }

    // Get all unique column names from allowed columns and sort them
    const allKeys = new Set();
    Object.values(fileGroups).forEach(group => {
      group.forEach(file => {
        Object.keys(file.allColumns).forEach(key => allKeys.add(key));
      });
    });

    const sortedKeys = Array.from(allKeys).sort((a, b) => {
      const chrPrefix = 'CHR';
      if (a.startsWith(chrPrefix) && b.startsWith(chrPrefix)) {
        const aNum = parseInt(a.replace(chrPrefix, ''), 10);
        const bNum = parseInt(b.replace(chrPrefix, ''), 10);
        return aNum - bNum;
      }
      return a.localeCompare(b);
    });

    console.log(`Generating plots for ${sortedKeys.length} columns:`, sortedKeys);

    // Generate plot data
    const plotPanels = sortedKeys.map((key) => ({
      key,
      fileGroups,
    }));

    console.log(`Generated ${plotPanels.length} plot panels for ${Math.ceil(sortedKeys.length / 3)} rows`);
    onFileUpload(plotPanels, fileNames); // Pass both plot data and file names
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box display="flex" justifyContent="center">
      <UploadButtonStyled onClick={handleButtonClick}>
        Upload CSV Files
      </UploadButtonStyled>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </Box>
  );
}

export default UploadButton;