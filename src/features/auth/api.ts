import api, { setAccessToken } from '../../lib/axios';
import type { LoginPayload, LoginResponse } from './types';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/tokens', payload);

  const accessToken = res.data.data?.accessToken;
  if (accessToken) setAccessToken(accessToken);

  return res.data;
}

export async function logout(): Promise<void> {
  try {
    await api.delete('/auth/tokens');
  } finally {
    setAccessToken(null);
  }
}

export async function refresh(): Promise<string | null> {
  try {
    const res = await api.put<{ data: { accessToken: string } }>(
      '/auth/tokens',
    );

    const accessToken = res.data.data?.accessToken;
    if (accessToken) {
      setAccessToken(accessToken);
      return accessToken;
    }
    return null;
  } catch {
    setAccessToken(null);
    return null;
  }
}
