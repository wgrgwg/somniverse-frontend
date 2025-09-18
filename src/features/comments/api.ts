import api from '../../lib/axios';
import type { Comment, CommentPayload, Page } from './types';

export const getComments = async (
  dreamId: number,
  page: number,
  size: number,
): Promise<Page<Comment>> => {
  const res = await api.get(`/dreams/${dreamId}/comments`, {
    params: { page, size },
  });
  return res.data.data;
};

export const getReplies = async (
  commentId: number,
  page: number,
  size: number,
): Promise<Page<Comment>> => {
  const res = await api.get(`/comments/${commentId}/children`, {
    params: { page, size },
  });
  return res.data.data;
};

export const createComment = async (
  dreamId: number,
  content: string,
  parentId?: number,
): Promise<Comment> => {
  const res = await api.post(`/dreams/${dreamId}/comments`, {
    content,
    parentId,
  });
  return res.data.data;
};

export async function updateComment(
  id: number,
  payload: CommentPayload,
): Promise<Comment> {
  const res = await api.put(`/comments/${id}`, payload);
  return res.data.data;
}

export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

export const deleteCommentByAdmin = async (
  commentId: number,
): Promise<void> => {
  await api.delete(`/admin/comments/${commentId}`);
};
