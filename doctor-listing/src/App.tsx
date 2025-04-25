import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import DoctorListing from './components/DoctorListing';
import AppointmentBooked from './components/AppointmentBooked';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
          <Box sx={{ my: 4 }}>
            <Routes>
              <Route path="/" element={<DoctorListing />} />
              <Route path="/appointment-booked" element={<AppointmentBooked />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App; 