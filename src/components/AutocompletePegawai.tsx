import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import api from '../api/axiosConfig';

interface AutocompletePegawaiProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const AutocompletePegawai: React.FC<AutocompletePegawaiProps> = ({ 
  value, 
  onChange, 
  label = "Nama Pegawai",
  placeholder = "Cari berdasarkan nama..."
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 1) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/pegawai/autocomplete', {
          params: { q: inputValue }
        });
        if (response.data.success) {
          const names = response.data.data.map((item: any) => item.nama);
          setOptions(names);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (open) {
        fetchSuggestions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, open]);

  return (
    <Autocomplete
      id="pegawai-autocomplete"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      freeSolo
      fullWidth
      options={options}
      loading={loading}
      value={value}
      onChange={(_event, newValue) => {
        onChange(newValue || '');
      }}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
        onChange(newInputValue);
      }}
      renderInput={(params) => {
        const { slotProps, ...restParams } = params as any;
        return (
          <TextField
            {...restParams}
            label={label}
            size="small"
            placeholder={placeholder}
            slotProps={{
              ...slotProps,
              input: {
                ...slotProps?.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {slotProps?.input?.endAdornment}
                  </React.Fragment>
                ),
              }
            }}
          />
        );
      }}
    />
  );
};

export default AutocompletePegawai;
