import api, { getAccessToken, setAccessToken } from '../../lib/axios';
import type { LoginPayload, LoginResponse } from './types';
import { queryClient } from '../../app/queryClient.ts';
import { isTokenExpired } from '../../lib/jwt.ts';

export type LogoutResult = 'ok' | 'expired';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/tokens', payload);

  const accessToken = res.data.data?.accessToken;
  if (accessToken) setAccessToken(accessToken);

  return res.data;
}

export async function logout(): Promise<LogoutResult> {
  try {
    const token = getAccessToken();
    if (!token || isTokenExpired(token)) {
      const newToken = await refresh();
      if (!newToken) {
        return 'expired';
      }
    }
    await api.delete('/auth/tokens');
    return 'ok';
  } finally {
    setAccessToken(null);
    queryClient.clear();
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
