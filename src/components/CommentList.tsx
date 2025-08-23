import { useEffect, useState } from 'react';
import { deleteComment, getComments } from '../features/comments/api';
import type { Comment } from '../features/comments/types';
import Pagination from './ui/Pagination';
import { useAuthContext } from '../features/auth/AuthContext';

interface Props {
  dreamId: number;
}

export default function CommentList({ dreamId }: Props) {
  const { user } = useAuthContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    setLoading(true);
    getComments(dreamId, page, 5)
      .then((res) => {
        setComments(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, [page, dreamId]);

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await deleteComment(dreamId, commentId);
    fetchComments();
  };

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
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="p-3 rounded bg-base-100 shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{comment.author.username}</p>
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              {(user?.id === comment.author.id ||
                user?.role === 'ADMIN' ||
                user?.role === 'MANAGER') && (
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(comment.id)}
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
