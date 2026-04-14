import React from 'react';
import { Card, CardContent, Stack, TextField, Button, Box, InputAdornment, Typography } from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon, FilterAlt as FilterAltIcon } from '@mui/icons-material';
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
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterAltIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Filter Data
          </Typography>
        </Box>
        
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            label="Nama Pegawai"
            name="name"
            size="small"
            variant="outlined"
            fullWidth
            placeholder="Cari berdasarkan nama..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }
            }}
            value={filters.name}
            onChange={onFilterChange}
          />
          <TextField
            label="Tanggal Mulai"
            name="startDate"
            type="date"
            size="small"
            variant="outlined"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={filters.startDate}
            onChange={onFilterChange}
          />
          <TextField
            label="Tanggal Selesai"
            name="endDate"
            type="date"
            size="small"
            variant="outlined"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={filters.endDate}
            onChange={onFilterChange}
          />
          
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', lg: 'auto' } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={onSearch}
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
              onClick={onDownload}
              fullWidth
              sx={{ minWidth: 120 }}
            >
              Excel
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;