import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const normalizedBaseUrl = rawApiUrl
  ? rawApiUrl.replace(/\/+$/, '')
  : 'http://localhost:3000';

const API = axios.create({
  baseURL: normalizedBaseUrl.endsWith('/api')
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`,
  withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
