import { createTheme } from '@mui/material/styles';

// Amazon Prime-inspired dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00A8E1', // Amazon Prime blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#232F3E', // Amazon dark blue
    },
    background: {
      default: '#0F1419', // Amazon Prime background
      paper: '#1B2631',   // Amazon Prime card background
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    warning: {
      main: '#FF9900', // Amazon orange accent
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1B2631',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F1419',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
