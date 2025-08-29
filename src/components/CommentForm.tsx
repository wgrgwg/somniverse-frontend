import { useState } from 'react';
import { createComment } from '../features/comments/api';
import { useAuthContext } from '../features/auth/AuthContext';

interface Props {
  dreamId: number;
  onSuccess: () => void;
  parentId?: number;
}

export default function CommentForm({ dreamId, onSuccess, parentId }: Props) {
  const { user } = useAuthContext();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <p className="mt-3 text-gray-500">댓글을 작성하려면 로그인하세요.</p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await createComment(dreamId, content);
      setContent('');
      onSuccess();
    } catch {
      setError('댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
        className="input input-bordered flex-1"
        disabled={loading}
      />
      <button
        className="btn btn-primary btn-sm"
        disabled={loading || !content.trim()}
      >
        {loading ? '작성 중...' : '작성'}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}
