import type { InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../static/constants.ts';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = localStorage.getItem('accessToken');

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) localStorage.setItem('accessToken', token);
  else localStorage.removeItem('accessToken');
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers?.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

let isRefreshing = false;
let waiters: ((t: string | null) => void)[] = [];
const notify = (t: string | null) => {
  waiters.forEach((w) => w(t));
  waiters = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waiters.push((t) => {
            if (t) {
              original.headers?.set('Authorization', `Bearer ${t}`);
              resolve(api(original));
            } else {
              reject(error);
            }
          });
        });
      }

      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await api.put('/auth/tokens');
        if (typeof data?.accessToken === 'string') {
          setAccessToken(data.accessToken);
        }
        notify(data?.accessToken ?? null);
        original.headers?.set('Authorization', `Bearer ${data?.accessToken}`);
        return api(original);
      } catch (e) {
        setAccessToken(null);
        notify(null);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
