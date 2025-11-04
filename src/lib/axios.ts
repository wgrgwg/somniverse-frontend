import axios, {
  type AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from '../static/constants';
import { eventBus } from './eventBus';
import { isTokenExpired } from './jwt';

const TOKEN_STORAGE_KEY = 'accessToken';
const AUTH_HEADER = 'Authorization';
const LOGIN_URL = '/auth/tokens';

type Waiter = (token: string | null) => void;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

function ensureHeaders(config: InternalAxiosRequestConfig): AxiosHeaders {
  if (config.headers instanceof AxiosHeaders) return config.headers;
  const converted = AxiosHeaders.from(config.headers ?? {});
  config.headers = converted;
  return converted;
}

function setHeader(
  config: InternalAxiosRequestConfig,
  name: string,
  value: string,
): void {
  ensureHeaders(config).set(name, value);
}

function deleteHeader(config: InternalAxiosRequestConfig, name: string): void {
  ensureHeaders(config).delete(name);
}

const isAuthTokensUrl = (
  config: InternalAxiosRequestConfig | undefined,
): boolean => (config?.url ?? '').startsWith(LOGIN_URL);

api.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toUpperCase();

  if (isAuthTokensUrl(config) && (method === 'POST' || method === 'PUT')) {
    deleteHeader(config, AUTH_HEADER);
    return config;
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    setHeader(config, AUTH_HEADER, `Bearer ${accessToken}`);
  } else {
    deleteHeader(config, AUTH_HEADER);
  }

  return config;
});

let isRefreshing = false;
let waiters: Waiter[] = [];

const notifyWaiters = (token: string | null): void => {
  for (const w of waiters) w(token);
  waiters = [];
};

async function requestRefreshToken(): Promise<string> {
  const { data } = await api.put(LOGIN_URL);
  const newToken: string | undefined = data?.data?.accessToken;
  if (!newToken) throw new Error('No new access token from refresh');
  setAccessToken(newToken);
  return newToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;
    const status = error.response?.status;

    if (
      !original ||
      status !== 401 ||
      original._retry ||
      isAuthTokensUrl(original)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiters.push((token) => {
          if (token) {
            setHeader(original, AUTH_HEADER, `Bearer ${token}`);
            resolve(api(original));
            return;
          }
          reject(error);
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const newToken = await requestRefreshToken();
      notifyWaiters(newToken);
      setHeader(original, AUTH_HEADER, `Bearer ${newToken}`);
      return api(original);
    } catch (e) {
      setAccessToken(null);
      notifyWaiters(null);
      eventBus.emit('unauthorized');
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
