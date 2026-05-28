import React, { useState, useEffect, useCallback } from 'react';
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
import LaporanPage from './pages/LaporanPage';
import LaporanBulananPage from './pages/LaporanBulananPage';
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

// Baca tab awal dari history state (jika ada), fallback ke 0
const getInitialTab = (): number => {
  const state = window.history.state;
  if (state && typeof state.tab === 'number') return state.tab;
  return 0;
};

// Komponen utama yang sudah tahu status login
const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<number>(getInitialTab);

  // Saat pertama kali mount, pastikan history entry awal sudah punya state tab
  useEffect(() => {
    const state = window.history.state;
    if (!state || typeof state.tab !== 'number') {
      // Ganti entry saat ini agar punya state tab=0
      window.history.replaceState({ tab: 0 }, '');
    }
  }, []);

  // Tangkap tombol back/forward hardware
  const handlePopState = useCallback((event: PopStateEvent) => {
    const tab = event.state?.tab;
    if (typeof tab === 'number') {
      setCurrentTab(tab);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);

  // Ganti tab: push state baru ke history agar back button bisa balik
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue !== currentTab) {
      window.history.pushState({ tab: newValue }, '');
      setCurrentTab(newValue);
    }
  };

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
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="REKAP PRESENSI" />
            <Tab label="JADWAL PEGAWAI" />
            <Tab label="LAPORAN INDIVIDU" />
            <Tab label="LAPORAN BULANAN" />
          </Tabs>
        </Box>

        <Box>
          {currentTab === 0 && <PresensiPage />}
          {currentTab === 1 && <JadwalPage />}
          {currentTab === 2 && <LaporanPage />}
          {currentTab === 3 && <LaporanBulananPage />}
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