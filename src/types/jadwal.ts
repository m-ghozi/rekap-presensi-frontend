export interface JadwalPegawai {
  id: number;
  nama_pegawai: string;
  bulan: number;
  tahun: number;
  [key: string]: string | number;
}