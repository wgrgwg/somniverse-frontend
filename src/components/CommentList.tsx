import { useEffect, useState } from 'react';
import {
  createComment,
  deleteComment,
  deleteCommentByAdmin,
  getComments,
  getReplies,
} from '../features/comments/api';
import type { Comment } from '../features/comments/types';
import Pagination from './ui/Pagination';
import { useAuthContext } from '../features/auth/AuthContext';
import CommentForm from './CommentForm';

interface Props {
  dreamId: number;
}

export default function CommentList({ dreamId }: Props) {
  const { user } = useAuthContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>(
    {},
  );
  const [replies, setReplies] = useState<{ [key: number]: Comment[] }>({});
  const [replyPage, setReplyPage] = useState<{ [key: number]: number }>({});
  const [replyTotal, setReplyTotal] = useState<{ [key: number]: number }>({});
  const [loadingReplies, setLoadingReplies] = useState<{
    [key: number]: boolean;
  }>({});
  const [showReplyInput, setShowReplyInput] = useState<{
    [key: number]: boolean;
  }>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const fetchComments = () => {
    setLoading(true);
    getComments(dreamId, page, 5)
      .then((res) => {
        setComments(res.content);
        setTotalPages(res.totalPages);

        // 각 댓글별 대댓글도 불러오기
        res.content.forEach((comment) => {
          fetchReplies(comment.id, true);
        });
      })
      .finally(() => setLoading(false));
  };

  const fetchReplies = async (commentId: number, reset: boolean = false) => {
    const currentPage = reset ? 0 : replyPage[commentId] || 0;
    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

    const res = await getReplies(commentId, currentPage, 5);

    setReplies((prev) => ({
      ...prev,
      [commentId]: reset
        ? res.content
        : [...(prev[commentId] || []), ...res.content],
    }));

    setReplyTotal((prev) => ({ ...prev, [commentId]: res.totalElements }));
    setReplyPage((prev) => ({ ...prev, [commentId]: currentPage + 1 }));
    setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
  };

  const handleReplySubmit = async (commentId: number) => {
    if (!replyContent[commentId]?.trim()) return;

    await createComment(dreamId, replyContent[commentId], commentId);
    setReplyContent((prev) => ({ ...prev, [commentId]: '' }));
    fetchReplies(commentId, true);
  };

  const handleDelete = async (comment: Comment, parentId?: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
        await deleteCommentByAdmin(comment.id);
      } else {
        await deleteComment(comment.id);
      }

      if (parentId) {
        fetchReplies(parentId, true);
      } else {
        fetchComments();
      }
    } catch (error) {
      console.error(error);
      alert('삭제 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page, dreamId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">댓글</h3>
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner"></span>
        </div>
      ) : comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => {
            const isAuthor = user?.id === comment.author.id;
            const canDelete =
              (isAuthor ||
                user?.role === 'ADMIN' ||
                user?.role === 'MANAGER') &&
              !comment.isDeleted;
            const canReply = user && !comment.isDeleted;

            return (
              <li key={comment.id} className="p-3 rounded bg-base-100 shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingCommentId === comment.id ? (
                      <CommentForm
                        dreamId={dreamId}
                        onSuccess={() => {
                          setEditingCommentId(null);
                          fetchComments();
                        }}
                        mode="edit"
                        commentId={comment.id}
                        initialContent={comment.content}
                      />
                    ) : (
                      <>
                        <p className="text-sm">
                          {comment.isDeleted
                            ? '삭제된 댓글입니다.'
                            : comment.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {comment.author.username} |{' '}
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isAuthor &&
                      editingCommentId !== comment.id &&
                      !comment.isDeleted && (
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => setEditingCommentId(comment.id)}
                        >
                          수정
                        </button>
                      )}

                    {canDelete && editingCommentId !== comment.id && (
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(comment)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>

                {canReply && (
                  <button
                    className="ml-0 mt-2 text-blue-500 text-sm btn btn-xs"
                    onClick={() =>
                      setShowReplyInput((prev) => ({
                        ...prev,
                        [comment.id]: !prev[comment.id],
                      }))
                    }
                  >
                    {showReplyInput[comment.id] ? '입력창 닫기' : '대댓글 달기'}
                  </button>
                )}

                {showReplyInput[comment.id] && canReply && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyContent[comment.id] || ''}
                      onChange={(e) =>
                        setReplyContent((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      placeholder="대댓글 입력..."
                      className="input input-bordered flex-1"
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleReplySubmit(comment.id)}
                    >
                      작성
                    </button>
                  </div>
                )}

                {replies[comment.id]?.map((reply) => {
                  const isReplyAuthor = user?.id === reply.author.id;
                  const canDeleteReply =
                    (isReplyAuthor ||
                      user?.role === 'ADMIN' ||
                      user?.role === 'MANAGER') &&
                    !reply.isDeleted;

                  return (
                    <div
                      key={reply.id}
                      className="ml-6 mt-2 p-2 border-l border-gray-300 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        {editingCommentId === reply.id ? (
                          <CommentForm
                            dreamId={dreamId}
                            onSuccess={() => {
                              setEditingCommentId(null);
                              fetchReplies(comment.id, true);
                            }}
                            mode="edit"
                            commentId={reply.id}
                            initialContent={reply.content}
                          />
                        ) : (
                          <>
                            <p className="text-sm">
                              {reply.isDeleted
                                ? '삭제된 댓글입니다.'
                                : reply.content}
                            </p>
                            <p className="text-xs text-gray-400">
                              {reply.author.username} |{' '}
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {isReplyAuthor &&
                          editingCommentId !== reply.id &&
                          !reply.isDeleted && (
                            <button
                              className="btn btn-xs btn-info"
                              onClick={() => setEditingCommentId(reply.id)}
                            >
                              수정
                            </button>
                          )}

                        {canDeleteReply && editingCommentId !== reply.id && (
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() => handleDelete(reply, comment.id)}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {replyTotal[comment.id] >
                  (replies[comment.id]?.length || 0) && (
                  <button
                    className="ml-6 mt-2 text-blue-500 text-sm"
                    onClick={() => fetchReplies(comment.id)}
                    disabled={loadingReplies[comment.id]}
                  >
                    {loadingReplies[comment.id]
                      ? '불러오는 중...'
                      : `대댓글 더보기 (${
                          replyTotal[comment.id] -
                          (replies[comment.id]?.length || 0)
                        })`}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
