import api from '../../lib/axios';
import type { Comment, Page } from './types';

export const getComments = async (
  dreamId: number,
  page: number,
  size: number,
): Promise<Page<Comment>> => {
  const res = await api.get(`/dreams/${dreamId}/comments`, {
    params: { page, size },
  });
  return res.data;
};

export const createComment = async (
  dreamId: number,
  content: string,
): Promise<Comment> => {
  const res = await api.post(`/dreams/${dreamId}/comments`, { content });
  return res.data;
};

export const deleteComment = async (
  dreamId: number,
  commentId: number,
): Promise<void> => {
  await api.delete(`/dreams/${dreamId}/comments/${commentId}`);
};
