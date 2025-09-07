import api from '../../lib/axios';
import type { Page } from '../dreams/types';
import type { Role } from '../../static/roles';
import type { UpdateUsernamePayload } from './types.ts';

export interface Member {
  id: number;
  email: string;
  username: string;
  role: Role;
  createdAt?: string;
}

export async function listMembers(
  params: {
    page?: number;
    size?: number;
    sort?: string;
    keyword?: string;
  } = {},
): Promise<Page<Member>> {
  const { data } = await api.get('/admin/members', { params });
  return data.data;
}

export async function getMemberForAdmin(id: number): Promise<Member> {
  const { data } = await api.get(`/admin/members/${id}`);
  return data.data;
}

export async function getMyInfo(): Promise<Member> {
  const { data } = await api.get(`/members/me`);
  return data.data;
}

export async function updateRole(id: number, role: Role): Promise<Member> {
  const { data } = await api.patch(`/admin/members/${id}/role`, { role });
  return data.data;
}

export async function updateUsername(
  payload: UpdateUsernamePayload,
): Promise<Member> {
  const { data } = await api.patch(`/members/me`, payload);
  return data.data;
}
