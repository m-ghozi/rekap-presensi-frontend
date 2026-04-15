import React, { useState } from 'react';
import { 
  Container, Box, Tabs, Tab, CssBaseline, ThemeProvider, createTheme 
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PresensiPage from './pages/PresensiPage';
import JadwalPage from './pages/JadwalPage';

const theme = createTheme({
  palette: {
    background: { default: '#f4f6f8' },
    primary: { main: '#1976d2' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  }
});

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Tabs 
              value={currentTab} 
              onChange={(_, newValue) => setCurrentTab(newValue)} 
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="REKAP PRESENSI" />
              <Tab label="JADWAL PEGAWAI" />
            </Tabs>
          </Box>

          <Box>
            {currentTab === 0 ? <PresensiPage /> : <JadwalPage />}
          </Box>

        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;