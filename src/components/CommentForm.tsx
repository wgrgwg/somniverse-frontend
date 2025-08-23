import { useState } from 'react';
import { createComment } from '../features/comments/api';
import { useAuthContext } from '../features/auth/AuthContext';

interface Props {
  dreamId: number;
  onSuccess: () => void;
}

export default function CommentForm({ dreamId, onSuccess }: Props) {
  const { user } = useAuthContext();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <p className="mt-3 text-gray-500">댓글을 작성하려면 로그인하세요.</p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    await createComment(dreamId, content);
    setContent('');
    onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="input input-bordered flex-1"
      />
      <button className="btn btn-primary" disabled={loading}>
        작성
      </button>
    </form>
  );
}
