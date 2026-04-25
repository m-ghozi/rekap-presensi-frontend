# Rekap Presensi Frontend

Aplikasi frontend (antarmuka pengguna) untuk Sistem Rekapitulasi Presensi dan Penjadwalan. Proyek ini dibangun menggunakan web technology modern untuk memberikan antarmuka yang responsif, cepat, dan mudah digunakan bagi admin atau pengguna dalam memantau data kehadiran dan jadwal.

## 🚀 Fitur Utama

- **Otentikasi:** Halaman login yang aman dan terintegrasi dengan backend API (berbasis JWT).
- **Dashboard Presensi:** Menampilkan tabel rekap data presensi (jam kedatangan, kepulangan, durasi kerja, dan status) dengan fitur filter berdasarkan nama dan rentang tanggal.
- **Manajemen Jadwal:** Antarmuka kalender/tabel untuk memonitor jadwal kerja karyawan secara bulanan. Dilengkapi dengan fitur unduh/export jadwal ke format Excel.
- **UI Responsif & Modern:** Dibangun menggunakan komponen Material UI (MUI) untuk memberikan pengalaman pengguna yang elegan dan konsisten.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) (untuk performa *HMR* dan waktu build yang sangat cepat)
- **UI Library:** [Material UI (MUI)](https://mui.com/) & Emotion
- **HTTP Client:** [Axios](https://axios-http.com/) (terkonfigurasi dengan interceptors untuk *auth token*)
- **Date Utility:** [Day.js](https://day.js.org/) (manipulasi format tanggal dan waktu secara ringan)

## 📋 Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:
- **Node.js** (versi 18.x atau lebih baru disarankan)
- **Backend API:** Pastikan [rekap-presensi-backend](../rekap-presensi-backend) sudah berjalan agar aplikasi frontend ini dapat mengambil dan memproses data.

## ⚙️ Variabel Lingkungan (Environment Variables)

Aplikasi ini menggunakan Axios yang secara bawaan diarahkan ke `http://localhost:5000/api`. Jika menggunakan `.env`, Anda dapat membuat file `.env` di *root* direktori frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

*(Silakan sesuaikan pengaturan base URL pada `src/api/axiosConfig.ts` jika menggunakan variabel env).*

## 💻 Instalasi dan Menjalankan Frontend

1. **Pindah ke direktori frontend:**
   ```bash
   cd rekap-presensi-frontend
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi (Mode Development):**
   ```bash
   npm run dev
   ```
   Aplikasi akan dapat diakses secara lokal di `http://localhost:5173`.

4. **Build untuk Production:**
   ```bash
   npm run build
   ```
   Hasil *build* statis akan dihasilkan pada folder `dist/` dan siap untuk di-deploy (contoh: Nginx, Vercel, Netlify).

## 🗺️ Struktur Proyek

- `/src/api` - Konfigurasi Axios dan API interceptors.
- `/src/components` - Komponen React yang dapat digunakan ulang (*reusable*).
- `/src/context` - React Context untuk state management global (seperti state otentikasi).
- `/src/pages` - Halaman-halaman utama aplikasi (*LoginPage*, *PresensiPage*, *JadwalPage*).
- `/src/types` - Definisi tipe TypeScript (*interfaces*).

## 👤 Author
**M. Ghozi Syah Putra**
