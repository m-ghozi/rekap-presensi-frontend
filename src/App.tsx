import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import api from './api/axiosConfig';
import type { IPresensi, IFilterParams } from './types/presensi';
import FilterPanel from './components/FilterPanel';
import PresensiTable from './components/PresensiTable';

// Membuat tema sederhana untuk tampilan yang lebih profesional
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    success: {
      main: '#2e7d32',
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

  /**
   * Mengambil data hari ini (Hit pertama kali)
   * Menggunakan endpoint /today agar loading awal ringan
   */
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

  /**
   * Mengambil data berdasarkan filter (Pencarian Kustom)
   * Menggunakan endpoint utama /
   */
  const fetchSearchData = async () => {
    // Jika filter kosong, arahkan kembali ke fetchTodayData untuk efisiensi
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

  /**
   * Menangani download excel
   */
  const handleDownload = async () => {
    try {
      const response = await api.get('/download', {
        params: filters,
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

  /**
   * Menangani perubahan input pada FilterPanel
   */
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
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Dashboard Rekap Presensi Pegawai
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Menampilkan data kehadiran secara real-time dari database hospital.
          </Typography>
        </Box>

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
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            {filters.startDate || filters.name
              ? `Hasil Pencarian: ${data.length} data ditemukan`
              : `Presensi Hari Ini (${new Date().toLocaleDateString('id-ID')})`}
          </Typography>
          <PresensiTable data={data} loading={loading} />
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
      </Container>
    </ThemeProvider>
  );
};

export default App;