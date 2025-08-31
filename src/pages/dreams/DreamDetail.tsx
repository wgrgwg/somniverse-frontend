import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteDream,
  deleteDreamByAdmin,
  getDreamById,
} from '../../features/dreams/api.ts';
import type { Dream } from '../../features/dreams/types.ts';
import CommentList from '../../components/CommentList.tsx';
import CommentForm from '../../components/CommentForm.tsx';
import { useAuthContext } from '../../features/auth/AuthContext.tsx';

export default function DreamDetail() {
  const { id } = useParams<{ id: string }>();
  const dreamId = Number(id);
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const fetchDream = () => {
    setLoading(true);
    getDreamById(dreamId)
      .then((res) => setDream(res))
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 꿈을 삭제하시겠습니까?')) return;

    try {
      if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
        await deleteDreamByAdmin(dreamId);
      } else {
        await deleteDream(dreamId);
      }

      alert('삭제가 완료되었습니다.');
      navigate('/dreams');
    } catch (error) {
      console.error(error);
      alert('삭제 중 문제가 발생했습니다.');
    }
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

  const isAuthor = user?.id === dream.author.id;
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <div>
      <h1 className="text-2xl font-bold">{dream.title}</h1>
      <p className="text-gray-500">{dream.author.username}</p>
      <p className="text-gray-500 text-sm">{dream.createdAt?.slice(0, 10)}</p>

      <p className="mt-4">꿈 일자 : {dream.dreamDate}</p>
      <p className="mt-4">{dream.content}</p>

      {(isAuthor || isAdminOrManager) && (
        <div className="mt-6 flex gap-2">
          {isAuthor && (
            <Link
              to={`/dreams/${dream.id}/edit`}
              className="btn btn-primary btn-sm"
            >
              수정
            </Link>
          )}
          <button onClick={handleDelete} className="btn btn-error btn-sm">
            삭제
          </button>
        </div>
      )}

      <CommentForm dreamId={dreamId} onSuccess={fetchDream} />
      <CommentList dreamId={dreamId} />
    </div>
  );
}
