import React, { useState } from 'react';
import {
  Container, Box, Tabs, Tab, CssBaseline, ThemeProvider, createTheme,
  AppBar, Toolbar, Typography, Button, Tooltip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import PresensiPage from './pages/PresensiPage';
import JadwalPage from './pages/JadwalPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

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

// Komponen utama yang sudah tahu status login
const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      {/* AppBar dengan tombol logout */}
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense">
          <BadgeIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Rekap Presensi
          </Typography>
          <Tooltip title="Keluar">
            <Button
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Keluar
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

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
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;