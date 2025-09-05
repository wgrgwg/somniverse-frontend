import api from '../../lib/axios';
import type { Dream, DreamPayload, Page } from './types';

export async function getPublicDreams(
  page = 0,
  size = 10,
): Promise<Page<Dream>> {
  const res = await api.get('/dreams', { params: { page, size } });
  return res.data.data;
}

export async function getMyDreams(page = 0, size = 10): Promise<Page<Dream>> {
  const res = await api.get('/dreams/me', { params: { page, size } });
  return res.data.data;
}

export async function getDreamById(id: number): Promise<Dream> {
  const res = await api.get(`/dreams/${id}`);
  return res.data.data;
}

export async function createDream(payload: DreamPayload): Promise<Dream> {
  const res = await api.post('/dreams', payload);
  return res.data.data;
}

export async function updateDream(
  id: number,
  payload: DreamPayload,
): Promise<Dream> {
  const res = await api.put(`/dreams/${id}`, payload);
  return res.data.data;
}

export async function deleteDream(id: number): Promise<void> {
  await api.delete(`/dreams/${id}`);
}

export async function getDreamsForAdmin(
  page = 0,
  size = 10,
  includeDeleted = false,
): Promise<Page<Dream>> {
  const res = await api.get('/admin/dreams', {
    params: { page, size, includeDeleted },
  });
  return res.data.data;
}

export async function getDreamAsAdminById(
  id: number,
  includeDeleted = false,
): Promise<Dream> {
  const res = await api.get(`/admin/dreams/${id}`, {
    params: { includeDeleted },
  });
  return res.data.data;
}

export async function deleteDreamByAdmin(id: number): Promise<void> {
  await api.delete(`/admin/dreams/${id}`);
}
