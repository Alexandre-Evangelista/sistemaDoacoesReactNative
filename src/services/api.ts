import axios from 'axios';
import { API_URL } from "../config/variaveis";
import { getStoredToken } from './tokenStorage';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
