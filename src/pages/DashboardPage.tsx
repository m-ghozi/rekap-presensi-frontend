// src/pages/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, Chip, Avatar,
    List, ListItem, ListItemAvatar, ListItemText, Divider,
    CircularProgress, IconButton, Tooltip, Alert, Snackbar, Skeleton
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import api from '../api/axiosConfig';

interface IPegawaiTerlambat {
    nama_pegawai: string;
    shift: string;
    keterlambatan: string;
}

interface IPegawaiPerluPerhatian {
    no: number;
    nama_pegawai: string;
    tidak_hadir: number;
    persentase_kehadiran: string;
}

interface IDashboardSummary {
    totalPegawai: number;
    hadirHariIni: number;
    tepatWaktu: number;
    terlambat: number;
    belumHadir: number;
    rataKehadiranBulanIni: number;
    pegawaiTerlambat: IPegawaiTerlambat[];
    pegawaiPerluPerhatian: IPegawaiPerluPerhatian[];
}

const parsePersen = (val: string | number) => {
    const num = parseFloat(String(val).replace('%', ''));
    return isNaN(num) ? 0 : num;
};

const DashboardPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<IDashboardSummary | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/dashboard/summary');
            if (response.data.success) {
                setStats(response.data.data);
                setLastUpdated(new Date());
            } else {
                setError('Gagal memuat data dashboard.');
            }
        } catch (err) {
            console.error('Gagal memuat dashboard', err);
            setError('Gagal memuat data dashboard. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    const StatCard = ({
        icon, title, value, subtitle, color,
    }: { icon: React.ReactNode; title: string; value: number | string; subtitle?: string; color: string }) => (
        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{title}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{value}</Typography>
                    {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
                </Box>
            </CardContent>
        </Card>
    );

    if (loading && !stats) {
        return (
            <Box>
                <Grid container spacing={2}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Skeleton variant="rounded" height={100} />
                        </Grid>
                    ))}
                </Grid>
                <Skeleton variant="rounded" height={200} sx={{ mt: 3 }} />
            </Box>
        );
    }

    if (!stats) return null;

    const totalRoster = stats.totalPegawai || 1;
    const persenTepat = Math.round((stats.tepatWaktu / totalRoster) * 100);
    const persenTerlambat = Math.round((stats.terlambat / totalRoster) * 100);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dashboard Presensi</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                </Box>
                <Tooltip title={`Update terakhir: ${lastUpdated.toLocaleTimeString('id-ID')}`}>
                    <IconButton onClick={fetchDashboard} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard icon={<PeopleAltIcon />} title="Total Pegawai Terjadwal" value={stats.totalPegawai} subtitle="Shift aktif hari ini" color="primary.main" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard icon={<CheckCircleIcon />} title="Hadir Hari Ini" value={stats.hadirHariIni} subtitle={`${stats.tepatWaktu} tepat waktu`} color="success.main" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard icon={<WarningAmberIcon />} title="Terlambat Hari Ini" value={stats.terlambat} subtitle="Pegawai" color="warning.main" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard icon={<EventBusyIcon />} title="Belum Hadir" value={stats.belumHadir} subtitle="Dari yang terjadwal" color="error.main" />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Rata-rata Kehadiran Bulan Ini</Typography>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={stats.rataKehadiranBulanIni}
                                    size={120}
                                    thickness={5}
                                    color={stats.rataKehadiranBulanIni >= 90 ? 'success' : stats.rataKehadiranBulanIni >= 75 ? 'warning' : 'error'}
                                />
                                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{stats.rataKehadiranBulanIni}%</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Status Kehadiran Hari Ini</Typography>
                            <Box sx={{ display: 'flex', height: 16, borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                                <Box sx={{ width: `${persenTepat}%`, bgcolor: 'success.main' }} />
                                <Box sx={{ width: `${persenTerlambat}%`, bgcolor: 'warning.main' }} />
                                <Box sx={{ flexGrow: 1, bgcolor: 'grey.200' }} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                                    <Typography variant="body2">Tepat Waktu ({stats.tepatWaktu})</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
                                    <Typography variant="body2">Terlambat ({stats.terlambat})</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'grey.400' }} />
                                    <Typography variant="body2">Belum Hadir ({stats.belumHadir})</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Pegawai Terlambat Hari Ini</Typography>
                            {stats.pegawaiTerlambat.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                    Tidak ada pegawai yang terlambat hari ini. 🎉
                                </Typography>
                            ) : (
                                <List dense>
                                    {stats.pegawaiTerlambat.map((p, i) => (
                                        <React.Fragment key={i}>
                                            <ListItem disableGutters>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'warning.light', width: 32, height: 32 }}>
                                                        <PersonIcon fontSize="small" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={p.nama_pegawai} secondary={p.shift || '-'} />
                                                <Chip label={p.keterlambatan} color="warning" size="small" variant="outlined" />
                                            </ListItem>
                                            {i < stats.pegawaiTerlambat.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Perlu Perhatian (Kehadiran Terendah Bulan Ini)</Typography>
                            {stats.pegawaiPerluPerhatian.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                    Belum ada data laporan bulan ini.
                                </Typography>
                            ) : (
                                <List dense>
                                    {stats.pegawaiPerluPerhatian.map((p, i) => (
                                        <React.Fragment key={i}>
                                            <ListItem disableGutters>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'error.light', width: 32, height: 32 }}>
                                                        <PersonIcon fontSize="small" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={p.nama_pegawai} secondary={`Tidak hadir: ${p.tidak_hadir} hari`} />
                                                <Chip
                                                    label={p.persentase_kehadiran}
                                                    color={parsePersen(p.persentase_kehadiran) >= 90 ? 'success' : parsePersen(p.persentase_kehadiran) >= 75 ? 'warning' : 'error'}
                                                    size="small"
                                                />
                                            </ListItem>
                                            {i < stats.pegawaiPerluPerhatian.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
                <Alert severity="error" variant="filled" onClose={() => setError(null)}>{error}</Alert>
            </Snackbar>
        </Box>
    );
};

export default DashboardPage;