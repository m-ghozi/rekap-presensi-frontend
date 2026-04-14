import React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography
} from '@mui/material';
import type { IPresensi } from '../types/presensi';

interface PresensiTableProps {
  data: IPresensi[];
  loading: boolean;
}

const PresensiTable: React.FC<PresensiTableProps> = ({ data, loading }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Nama Pegawai</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Shift</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Datang</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Pulang</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Terlambat</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Keterangan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell>{row.nama_pegawai}</TableCell>
              <TableCell>{row.shift}</TableCell>
              <TableCell>{row.jam_datang ? new Date(row.jam_datang).toLocaleString('id-ID') : '-'}</TableCell>
              <TableCell>{row.jam_pulang ? new Date(row.jam_pulang).toLocaleString('id-ID') : '-'}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell sx={{ color: 'error.main' }}>{row.keterlambatan}</TableCell>
              <TableCell>{row.keterangan || '-'}</TableCell>
            </TableRow>
          ))}
          {data.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" sx={{ py: 2 }}>Data tidak ditemukan</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PresensiTable;