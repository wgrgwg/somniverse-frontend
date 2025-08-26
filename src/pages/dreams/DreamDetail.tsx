import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDreamById } from '../../features/dreams/api.ts';
import type { Dream } from '../../features/dreams/types.ts';
import CommentList from '../../components/CommentList.tsx';
import CommentForm from '../../components/CommentForm.tsx';

export default function DreamDetail() {
  const { id } = useParams<{ id: string }>();
  const dreamId = Number(id);
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDream = () => {
    setLoading(true);
    getDreamById(dreamId)
      .then((res) => setDream(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDream();
  }, [dreamId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  if (!dream) {
    return <p>해당 꿈을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{dream.title}</h1>
      <p className="text-gray-500">{dream.dreamDate}</p>
      <p className="mt-4">{dream.content}</p>

      <div className="mt-6">
        <Link
          to={`/dreams/${dream.id}/edit`}
          className="btn btn-primary btn-sm"
        >
          수정
        </Link>
      </div>

      <CommentForm dreamId={dreamId} onSuccess={fetchDream} />
      <CommentList dreamId={dreamId} />
    </div>
  );
}
