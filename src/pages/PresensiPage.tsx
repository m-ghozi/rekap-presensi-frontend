import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Alert, Snackbar } from '@mui/material';
import api from '../api/axiosConfig';
import type { IPresensi, IFilterParams } from '../types/presensi';
import FilterPanel from '../components/FilterPanel';
import PresensiTable from '../components/PresensiTable';

const PresensiPage: React.FC = () => {
  const [data, setData] = useState<IPresensi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilterParams>({
    startDate: '',
    endDate: '',
    name: '',
  });

  const fetchTodayData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/presensi/today');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      setError('Gagal memuat data hari ini.');
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
      const response = await api.get('/presensi/', { params: filters });
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
      const today = new Date().toISOString().split('T')[0];
      const downloadParams = {
        ...filters,
        startDate: filters.startDate || today,
        endDate: filters.endDate || today,
      };

      const response = await api.get('/presensi/download', {
        params: downloadParams,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rekap_presensi_${today}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Gagal mengunduh file Excel');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  return (
    <Box>
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={fetchSearchData}
        onDownload={handleDownload}
        loading={loading}
      />

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

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PresensiPage;