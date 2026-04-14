import React from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, Box, Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import type { IPresensi } from '../types/presensi';

interface PresensiTableProps {
  data: IPresensi[];
  loading: boolean;
}

// Visual helpers for specific status
const getStatusColor = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s.includes('tepat') || s === 'hadir') return 'success';
  if (s.includes('terlambat')) return 'error';
  if (s.includes('izin') || s.includes('cuti')) return 'warning';
  return 'default';
};

const PresensiTable: React.FC<PresensiTableProps> = ({ data, loading }) => {
  return (
    <TableContainer component={Card} sx={{ maxHeight: 650, borderRadius: 2 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>Pegawai</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>Shift</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>Datang</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>Pulang</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>Keterlambatan</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>Keterangan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => {
            const statusColor = getStatusColor(row.status);
            const isLate = row.keterlambatan && row.keterlambatan !== '0 Menit' && row.keterlambatan !== '0';

            return (
              <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.light', mr: 2, width: 32, height: 32 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {row.nama_pegawai}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.shift || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {row.jam_datang ? (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(row.jam_datang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  ) : '-'}
                  {row.jam_datang && (
                    <Typography variant="caption" color="text.disabled">
                      {new Date(row.jam_datang).toLocaleDateString('id-ID')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {row.jam_pulang ? (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(row.jam_pulang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {row.status ? (
                    <Chip label={row.status} color={statusColor as any} size="small" sx={{ fontWeight: 600 }} />
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {isLate ? (
                    <Chip label={row.keterlambatan} variant="outlined" color="error" size="small" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.keterangan || '-'}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
          
          {data.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Tidak ada data presensi.
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Silahkan sesuaikan filter tanggal atau nama pegawai.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PresensiTable;