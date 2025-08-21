import api, { setAccessToken } from '../../lib/axios';
import type { LoginPayload, LoginResponse } from './types';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/tokens', payload);
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data;
}

export async function logout(): Promise<void> {
  await api.delete('/auth/tokens');
  setAccessToken(null);
}

export async function refresh(): Promise<string | null> {
  const { data } = await api.put<{ accessToken: string }>('/auth/tokens');
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data?.accessToken ?? null;
}
