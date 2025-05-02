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
          <img
            src={`${process.env.PUBLIC_URL}/myLogo1.png`}
            alt="Noze Logo"
            style={{
              height: '40px',
              marginRight: '16px',
            }}
            onError={(e) => console.error('Logo failed to load:', e)} // Log error if logo fails to load
          />
          <Tabs
            value={value < 2 ? value : 0}
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
            onClick={() => onChange(null, 2)}
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