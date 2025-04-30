import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, Box } from '@mui/material';

function Navbar({ value, onChange }) {
  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        backgroundColor: '#fff', // White background
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
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              letterSpacing: 1,
              color: '#000', // Black text
              mr: 2, // Margin-right to space between title and tabs
            }}
          >
            Noze plots2
          </Typography>
          <Tabs
            value={value}
            onChange={onChange}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                color: '#000', // Black text for tabs
                fontWeight: 'medium',
                textTransform: 'none',
                fontSize: '1rem',
                padding: '6px 12px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light gray hover effect
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2', // Blue indicator (MUI primary color)
                height: '3px',
              },
            }}
          >
            <Tab label="Plot" />
            <Tab label="Customise" />
          </Tabs>
        </Box>
        <Button
          sx={{
            color: '#000', // Black text
            fontWeight: 'medium',
            textTransform: 'none',
            fontSize: '1rem',
            padding: '6px 12px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light gray hover effect
            },
          }}
        >
          Documents
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;