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