import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Button, Grid, Avatar,
  Alert, Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Search as SearchIcon,
  PeopleAlt as PeopleAltIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningAmberIcon,
  EventBusy as EventBusyIcon
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import api from '../api/axiosConfig';
import type { IPresensi } from '../types/presensi';
import AutocompletePegawai from '../components/AutocompletePegawai';
import PresensiTable from '../components/PresensiTable';

const PresensiHarianPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedName, setSelectedName] = useState<string>('');
  const [data, setData] = useState<IPresensi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHarianData = useCallback(async (dateStr: string, nameStr: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/presensi/harian', {
        params: {
          date: dateStr,
          name: nameStr || undefined,
        }
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Gagal memuat data presensi harian');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data presensi harian');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const dateStr = selectedDate ? selectedDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    fetchHarianData(dateStr, selectedName);
  }, [fetchHarianData]);

  const handleSearch = () => {
    const dateStr = selectedDate ? selectedDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    fetchHarianData(dateStr, selectedName);
  };

  // Stats calculation
  const totalPegawai = data.length;
  const belumHadir = data.filter(d => !d.status || d.status === 'Belum Hadir').length;
  const hadir = totalPegawai - belumHadir;
  const terlambat = data.filter(d => d.status && d.status.toLowerCase().includes('terlambat')).length;

  const StatCard = ({
    icon, title, value, color,
  }: { icon: React.ReactNode; title: string; value: number | string; color: string }) => (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>{icon}</Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{title}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Filter Presensi Harian
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <DatePicker
              label="Tanggal"
              format="DD/MM/YYYY"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <AutocompletePegawai
              value={selectedName}
              onChange={(newValue) => setSelectedName(newValue)}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
              sx={{ minWidth: 120, height: 40, width: { xs: '100%', md: 'auto' } }}
            >
              Cari
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<PeopleAltIcon />} title="Total Pegawai Aktif" value={totalPegawai} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<CheckCircleIcon />} title="Sudah Hadir" value={hadir} color="success.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<WarningAmberIcon />} title="Terlambat" value={terlambat} color="warning.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<EventBusyIcon />} title="Belum Hadir" value={belumHadir} color="error.main" />
        </Grid>
      </Grid>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Daftar Presensi Harian: {data.length} Pegawai
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedDate ? selectedDate.format('DD MMMM YYYY') : ''}
        </Typography>
      </Box>

      <PresensiTable data={data} loading={loading} />

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PresensiHarianPage;
