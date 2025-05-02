import React from 'react';
import { AppBar, Toolbar, Tabs, Tab, Box } from '@mui/material';

function Navbar({ value, onChange }) {
  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        backgroundColor: '#fff',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src="/myLogo1.png"
            alt="Noze Logo"
            sx={{
              height: 40,
              mr: 2,
            }}
          />
          <Tabs
            value={value < 2 ? value : 0} // Map value for Plot and Analyze tabs
            onChange={(event, newValue) => onChange(event, newValue)}
            sx={{
              '& .MuiTab-root': {
                color: '#000',
                fontWeight: 'medium',
                textTransform: 'none',
                fontSize: '1rem',
                padding: '6px 12px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              },
              '& .Mui-selected': {
                color: '#00DE93',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00DE93',
                height: '3px',
              },
            }}
          >
            <Tab label="Plot" />
            <Tab label="Processing" />
          </Tabs>
        </Box>
        <Box>
          <Tab
            label="Documents"
            onClick={() => onChange(null, 2)} // Set tabValue to 2 for Documents
            sx={{
              color: value === 2 ? '#00DE93' : '#000',
              fontWeight: 'medium',
              textTransform: 'none',
              fontSize: '1rem',
              padding: '6px 12px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;