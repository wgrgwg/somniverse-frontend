import { useEffect, useRef, useState } from 'react';
import { createComment, updateComment } from '../features/comments/api';
import { useAuthContext } from '../features/auth/AuthContext';

interface Props {
  dreamId: number;
  onSuccess: () => void;
  parentId?: number;
  mode?: 'create' | 'edit';
  commentId?: number;
  initialContent?: string;
}

export default function CommentForm({
  dreamId,
  onSuccess,
  parentId,
  mode = 'create',
  commentId,
  initialContent = '',
}: Props) {
  const { user } = useAuthContext();
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attemptKeyRef = useRef<string | null>(null);
  const ensureAttemptKey = () => {
    if (!attemptKeyRef.current) {
      attemptKeyRef.current =
        globalThis.crypto?.randomUUID?.() ??
        `idem-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    }
    return attemptKeyRef.current;
  };
  const endAttempt = () => {
    attemptKeyRef.current = null;
  };

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (!user) {
    return (
      <p className="mt-3 text-gray-500">댓글을 작성하려면 로그인하세요.</p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);

      if (mode === 'create') {
        const key = ensureAttemptKey();
        await createComment(dreamId, content.trim(), parentId, key);
        setContent('');
        endAttempt();
      } else if (mode === 'edit' && commentId) {
        await updateComment(commentId, { content: content.trim() });
      }

      onSuccess();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status && status >= 400 && status < 500) {
        endAttempt();
      }
      setError(
        mode === 'create'
          ? '댓글 작성에 실패했습니다.'
          : '댓글 수정에 실패했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  const idleLabel = mode === 'create' ? '작성' : '수정';
  const submittingLabel = mode === 'create' ? '작성중…' : '수정중…';

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
        {loading ? submittingLabel : idleLabel}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}
