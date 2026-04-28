export interface IPresensi {
    nama_pegawai: string;
    shift: string;
    jam_datang: string;
    jam_pulang: string | null;
    status: string;
    keterlambatan: string;
    durasi: string;
    keterangan: string | null;
}

export interface IFilterParams {
    startDate?: string;
    endDate?: string;
    name?: string;
}

export interface ILaporanPenilaian {
    nama_pegawai: string;
    total_hadir: string | number;
    tepat_waktu: string | number;
    terlambat_1: string | number;
    terlambat_2: string | number;
    tidak_hadir: string | number;
    total_jam_kerja: string;
    hari_kerja_efektif: string | number;
    persentase_kehadiran: string;
}