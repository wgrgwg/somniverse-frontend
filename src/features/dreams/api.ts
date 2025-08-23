import api from '../../lib/axios';
import type { Dream, DreamPayload, Page } from './types';

export async function getPublicDreams(
  page = 0,
  size = 10,
): Promise<Page<Dream>> {
  const res = await api.get('/dreams', { params: { page, size } });
  return res.data;
}

export async function getMyDreams(page = 0, size = 10): Promise<Page<Dream>> {
  const res = await api.get('/dreams/me', { params: { page, size } });
  return res.data;
}

export async function getDreamById(id: number): Promise<Dream> {
  const res = await api.get(`/dreams/${id}`);
  return res.data;
}

export async function createDream(payload: DreamPayload): Promise<Dream> {
  const res = await api.post('/dreams', payload);
  return res.data;
}

export async function updateDream(
  id: number,
  payload: DreamPayload,
): Promise<Dream> {
  const res = await api.put(`/dreams/${id}`, payload);
  return res.data;
}

export async function deleteDream(id: number): Promise<void> {
  await api.delete(`/dreams/${id}`);
}

export async function getAdminDreams(
  page = 0,
  size = 10,
): Promise<Page<Dream>> {
  const res = await api.get('/admin/dreams', { params: { page, size } });
  return res.data;
}

export async function deleteDreamByAdmin(id: number): Promise<void> {
  await api.delete(`/admin/dreams/${id}`);
}
