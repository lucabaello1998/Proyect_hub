import { createTheme } from '@mui/material/styles';

const base = {
  typography: { 
    fontSize: 14, 
    button: { textTransform: 'none' as const } 
  },
  components: {
    MuiButton: { 
      defaultProps: { variant: 'contained' as const } 
    },
    MuiCard: { 
      styleOverrides: { root: { borderRadius: 14 } } 
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        },
        body: {
          transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6750A4' },
    secondary: { main: '#386A20' },
    background: { default: '#fafafa', paper: '#fff' },
  },
  ...base,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#B69DF8' },
    secondary: { main: '#A0D39D' },
    background: { default: '#0f1115', paper: '#151923' },
  },
  ...base,
});