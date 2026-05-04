import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Alert, Snackbar, Card, CardContent,
  CircularProgress, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/id';
import api from '../api/axiosConfig';
import type { ILaporanBulanan } from '../types/presensi';
import AutocompletePegawai from '../components/AutocompletePegawai';

// Setup dayjs locale to indonesian for better month names
dayjs.locale('id');

const LaporanBulananPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ILaporanBulanan[]>([]);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedName, setSelectedName] = useState<string>('');

  const fetchLaporanData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        bulan: selectedDate ? selectedDate.month() + 1 : dayjs().month() + 1,
        tahun: selectedDate ? selectedDate.year() : dayjs().year(),
        name: selectedName || undefined,
      };

      const response = await api.get('/laporan/bulanan', { params });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Gagal memuat data laporan bulanan.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporanData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams();
      params.append('bulan', String(selectedDate ? selectedDate.month() + 1 : dayjs().month() + 1));
      params.append('tahun', String(selectedDate ? selectedDate.year() : dayjs().year()));
      if (selectedName) params.append('name', selectedName);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/laporan/bulanan/download?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message || 'Gagal mengunduh file.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const cd = response.headers.get('Content-Disposition') || '';
      const fnMatch = cd.match(/filename=([^;]+)/);
      a.download = fnMatch ? fnMatch[1] : `rekap_bulanan_${params.get('bulan')}_${params.get('tahun')}.xlsx`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunduh laporan Excel.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssessmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Filter Laporan Bulanan</Typography>
          </Box>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <AutocompletePegawai
              value={selectedName}
              onChange={(val) => setSelectedName(val || '')}
            />
            <DatePicker
              views={['year', 'month']}
              label="Bulan & Tahun"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', lg: 'auto' } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={fetchLaporanData}
                disabled={loading}
                fullWidth
                sx={{ minWidth: 120 }}
              >
                Cari
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadExcel}
                disabled={downloading}
                fullWidth
                sx={{ minWidth: 120 }}
              >
                {downloading ? 'Unduh...' : 'Excel'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : data.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>No</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Nama Pegawai</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Jumlah Hadir</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Tepat Waktu</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Terlambat</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Total Keterlambatan</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Tidak Hadir</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Total Jam Kerja</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>Hari Kerja Efektif</TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Persentase Kehadiran</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.nama_pegawai} hover>
                      <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.no}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.nama_pegawai}</TableCell>
                      <TableCell align="center" sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.jumlah_hadir}</TableCell>
                      <TableCell align="center" sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.tepat_waktu}</TableCell>
                      <TableCell align="center" sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.terlambat}</TableCell>
                      <TableCell align="center" sx={{ color: row.total_keterlambatan !== '00:00:00' ? 'error.main' : 'inherit', fontWeight: row.total_keterlambatan !== '00:00:00' ? 'bold' : 'normal', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.total_keterlambatan}</TableCell>
                      <TableCell align="center" sx={{ color: Number(row.tidak_hadir) > 0 ? 'error.main' : 'inherit', fontWeight: Number(row.tidak_hadir) > 0 ? 'bold' : 'normal', borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.tidak_hadir}</TableCell>
                      <TableCell align="center" sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.total_jam_kerja}</TableCell>
                      <TableCell align="center" sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.5)' }}>{row.hari_kerja_efektif}</TableCell>
                      <TableCell align="center" sx={{ color: parseInt(row.persentase_kehadiran) < 100 ? 'error.main' : 'inherit', fontWeight: 'bold' }}>{row.persentase_kehadiran}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">Tidak ada data laporan untuk periode tersebut.</Alert>
          )}

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LaporanBulananPage;
