import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Alert, Snackbar,
  CssBaseline, ThemeProvider, createTheme
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import api from './api/axiosConfig';
import type { IPresensi, IFilterParams } from './types/presensi';
import FilterPanel from './components/FilterPanel';
import PresensiTable from './components/PresensiTable';

// Refined Theme extending default Material UI palette
const theme = createTheme({
  palette: {
    background: {
      default: '#f4f6f8',
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.06),0px 4px 5px 0px rgba(0,0,0,0.04),0px 1px 10px 0px rgba(0,0,0,0.02)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  // --- States ---
  const [data, setData] = useState<IPresensi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilterParams>({
    startDate: '',
    endDate: '',
    name: '',
  });

  // --- Functions ---
  const fetchTodayData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/today');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      setError('Gagal memuat data hari ini. Pastikan backend berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSearchData = async () => {
    if (!filters.startDate && !filters.endDate && !filters.name) {
      fetchTodayData();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/', { params: filters });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pencarian gagal dilakukan');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Default to today's date if no filter dates are selected
      const today = new Date().toISOString().split('T')[0];
      const downloadParams = {
        ...filters,
        startDate: filters.startDate || today,
        endDate: filters.endDate || today,
      };

      const response = await api.get('/download', {
        params: downloadParams,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rekap_presensi_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Gagal mengunduh file Excel');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Effects ---
  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 2 } }}>
        <Container maxWidth="xl">

          {/* Filter Section */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={fetchSearchData}
            onDownload={handleDownload}
            loading={loading}
          />

          {/* Data Table Section */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {filters.startDate || filters.name
                  ? `Hasil Pencarian: ${data.length} Log Presensi`
                  : `Data Kehadiran Hari Ini`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>

            <PresensiTable data={data} loading={loading} />
          </Box>
        </Container>
      </Box>

      {/* Error Notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
        </Snackbar>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;