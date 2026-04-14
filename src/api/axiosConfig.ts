import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Prefix /api sesuai presensiRoutes
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;