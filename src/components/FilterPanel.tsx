import React from 'react';
import { Card, CardContent, Stack, Button, Box, Typography } from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon, FilterAlt as FilterAltIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { IFilterParams } from '../types/presensi';
import AutocompletePegawai from './AutocompletePegawai';

interface FilterPanelProps {
  filters: IFilterParams;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onDownload?: () => void;
  loading: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onSearch, onDownload, loading }) => {
  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterAltIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Filter Data
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
          <AutocompletePegawai
            value={filters.name || ''}
            onChange={(newValue) => onFilterChange({
              target: { name: 'name', value: newValue }
            } as any)}
          />
          <DatePicker
            label="Tanggal Mulai"
            format="DD/MM/YYYY"
            value={filters.startDate ? dayjs(filters.startDate) : null}
            onChange={(newValue) => onFilterChange({
              target: { name: 'startDate', value: newValue ? newValue.format('YYYY-MM-DD') : '' }
            } as any)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label="Tanggal Selesai"
            format="DD/MM/YYYY"
            value={filters.endDate ? dayjs(filters.endDate) : null}
            onChange={(newValue) => onFilterChange({
              target: { name: 'endDate', value: newValue ? newValue.format('YYYY-MM-DD') : '' }
            } as any)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
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
            {onDownload && (
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
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;