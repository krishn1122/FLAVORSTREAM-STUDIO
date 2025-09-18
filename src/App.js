import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './styles/global.css';

// Theme
import theme from './styles/theme';

// Components
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Upload from './pages/Upload';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="videos" element={<Videos />} />
              <Route path="upload" element={<Upload />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
