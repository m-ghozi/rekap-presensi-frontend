import { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, MenuItem, Box, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../api/axiosConfig';
import type { JadwalPegawai } from '../types/jadwal';
import AutocompletePegawai from '../components/AutocompletePegawai';

const JadwalPage = () => {
  const [data, setData] = useState<JadwalPegawai[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    name: '',
    tanggal: '' // State baru untuk filter tanggal
  });

  // Tentukan kolom yang akan dirender
  const getDaysToShow = (tglStr: string) => {
    if (!tglStr) return Array.from({ length: 31 }, (_, i) => `h${i + 1}`);
    if (tglStr.includes('-')) {
      const [startStr, endStr] = tglStr.split('-');
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        return Array.from({ length: end - start + 1 }, (_, i) => `h${start + i}`);
      }
    }
    const parsed = parseInt(tglStr);
    return !isNaN(parsed) ? [`h${parsed}`] : Array.from({ length: 31 }, (_, i) => `h${i + 1}`);
  };

  const daysToShow = getDaysToShow(filters.tanggal);

  const fetchJadwal = async () => {
    // Hindari pemanggilan API jika format range belum selesai diketik (misal "1-")
    if (filters.tanggal && filters.tanggal.includes('-')) {
      const parts = filters.tanggal.split('-');
      if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
        return;
      }
    }

    setLoading(true);
    try {
      const response = await api.get('/jadwal', { params: filters });
      setData(response.data.data);
    } catch (error) {
      console.error("Gagal load jadwal", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/jadwal/download', {
        params: filters,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Jadwal_${filters.bulan}_${filters.tahun}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mendownload jadwal", error);
      alert("Gagal mendownload data jadwal.");
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [filters.bulan, filters.tahun, filters.tanggal]); // Auto fetch jika bulan/tahun/tanggal berubah

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField select label="Bulan" size="small" value={filters.bulan}
          onChange={(e) => setFilters({ ...filters, bulan: Number(e.target.value) })} sx={{ width: 140 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
            </MenuItem>
          ))}
        </TextField>

        <TextField label="Tahun" type="number" size="small" value={filters.tahun}
          onChange={(e) => setFilters({ ...filters, tahun: Number(e.target.value) })} sx={{ width: 100 }} />

        {/* Input Filter Tanggal */}
        <TextField label="Tanggal" type="text" size="small" value={filters.tanggal}
          onChange={(e) => setFilters({ ...filters, tanggal: e.target.value })} sx={{ width: 120 }} />

        <Box sx={{ width: 300 }}>
          <AutocompletePegawai
            value={filters.name}
            onChange={(newValue) => setFilters({ ...filters, name: newValue })}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={fetchJadwal}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          Cari
        </Button>

        <Button
          variant="outlined"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          Download
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        {loading ? <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white', position: 'sticky', left: 0, zIndex: 3 }}>
                  NAMA PEGAWAI
                </TableCell>
                {daysToShow.map((day) => (
                  <TableCell key={day} align="center" sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white', minWidth: 100 }}>
                    {day.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'white', zIndex: 1, fontWeight: 'bold', borderRight: '2px solid #eee' }}>
                    {row.nama_pegawai}
                  </TableCell>
                  {daysToShow.map((day) => (
                    <TableCell
                      key={day}
                      align="center"
                      sx={{
                        whiteSpace: 'pre-line', // Ini kunci agar \n menjadi baris baru
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        borderRight: '1px solid #f0f0f0'
                      }}
                    >
                      {row[day] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default JadwalPage;