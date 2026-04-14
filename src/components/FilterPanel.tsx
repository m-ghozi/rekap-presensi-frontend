import React from 'react';
import { Paper, Stack, TextField, Button } from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import type { IFilterParams } from '../types/presensi';

interface FilterPanelProps {
  filters: IFilterParams;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onDownload: () => void;
  loading: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onSearch, onDownload, loading }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
        <TextField
          label="Nama Pegawai"
          name="name"
          size="small"
          value={filters.name}
          onChange={onFilterChange}
        />
        <TextField
          label="Mulai"
          name="startDate"
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={filters.startDate}
          onChange={onFilterChange}
        />
        <TextField
          label="Selesai"
          name="endDate"
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={filters.endDate}
          onChange={onFilterChange}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          disabled={loading}
        >
          Cari
        </Button>
        <Button
          variant="outlined"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
        >
          Excel
        </Button>
      </Stack>
    </Paper>
  );
};

export default FilterPanel;