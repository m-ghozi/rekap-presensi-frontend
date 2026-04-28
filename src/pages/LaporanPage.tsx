import React, { useState } from 'react';
import { Typography, Box, Alert, Snackbar, Grid, Card, CardContent, CircularProgress, Divider } from '@mui/material';
import api from '../api/axiosConfig';
import type { IPresensi, IFilterParams, ILaporanPenilaian } from '../types/presensi';
import FilterPanel from '../components/FilterPanel';
import PresensiTable from '../components/PresensiTable';
import AssessmentIcon from '@mui/icons-material/Assessment';

const LaporanPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [laporan, setLaporan] = useState<ILaporanPenilaian | null>(null);
  const [riwayat, setRiwayat] = useState<IPresensi[]>([]);
  const [filters, setFilters] = useState<IFilterParams>({
    startDate: '',
    endDate: '',
    name: '',
  });

  const fetchLaporanData = async () => {
    if (!filters.name) {
      setError('Silakan masukkan nama pegawai untuk melihat laporan detail.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = {
        name: filters.name,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      const [laporanRes, riwayatRes] = await Promise.all([
        api.get('/laporan/penilaian', { params }),
        api.get('/presensi/', { params })
      ]);

      if (laporanRes.data.success && laporanRes.data.data.length > 0) {
        setLaporan(laporanRes.data.data[0]);
      } else {
        setLaporan(null);
      }

      if (riwayatRes.data.success) {
        setRiwayat(riwayatRes.data.data);
      } else {
        setRiwayat([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data laporan.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const StatCard = ({ title, value, color = 'primary.main' }: { title: string, value: string | number, color?: string }) => (
    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ color, fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={fetchLaporanData}
        loading={loading}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          {laporan ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Summary Section */}
              <Box>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AssessmentIcon color="primary" />
                  Ringkasan Kehadiran: {laporan.nama_pegawai}
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Persentase Kehadiran" value={laporan.persentase_kehadiran} color="primary.main" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Total Hadir" value={laporan.total_hadir} color="success.main" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Tepat Waktu" value={laporan.tepat_waktu} color="success.main" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Terlambat 1 (4-5m)" value={laporan.terlambat_1} color="warning.main" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Terlambat 2 (>5m)" value={laporan.terlambat_2} color="error.main" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Tidak Hadir / Alpha" value={laporan.tidak_hadir} color="error.main" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Hari Kerja Efektif" value={laporan.hari_kerja_efektif} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <StatCard title="Total Jam Kerja" value={laporan.total_jam_kerja?.split('.')[0] || '0'} />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* History Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Riwayat Presensi Detail
                </Typography>
                <PresensiTable data={riwayat} loading={loading} />
              </Box>
            </Box>
          ) : !loading && filters.name ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Data laporan tidak ditemukan untuk nama "{filters.name}" pada periode tersebut.
            </Alert>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <AssessmentIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
              <Typography variant="h6">Silakan cari nama pegawai</Typography>
              <Typography variant="body2">Gunakan panel filter di atas untuk melihat detail laporan penilaian dan riwayat presensi.</Typography>
            </Box>
          )}
        </Box>
      )}

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LaporanPage;
