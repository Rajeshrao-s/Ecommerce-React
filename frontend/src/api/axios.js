import axios from 'axios';

// Change this if your backend sits somewhere else
const BASE_API = 'http://localhost:8000/api';

const api = axios.create({ baseURL: BASE_API });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;