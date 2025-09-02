import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  deleteDream,
  deleteDreamByAdmin,
  getDreamAsAdminById,
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
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();
  const includeDeleted = searchParams.get('includeDeleted') === 'true';

  const fetchDream = () => {
    setLoading(true);
    getDreamAsAdminById(Number(id), includeDeleted)
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
      <h1 className="text-3xl font-bold text-base-content mb-4">
        {dream.title}{' '}
        {dream.isDeleted && (
          <span className="badge badge-error ml-auto">삭제됨</span>
        )}
      </h1>

      <div className="card bg-base-100 shadow-md border border-base-300 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-base-content">
          <div className="flex items-center gap-1">
            <span className="font-semibold">작성자:</span>
            <span>{dream.author.username}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold">작성일:</span>
            <span>{dream.createdAt?.slice(0, 10)}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold">꿈 일자:</span>
            <span>{dream.dreamDate}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold">공개 여부:</span>
            <span
              className={`badge ${
                dream.isPublic ? 'badge-success' : 'badge-warning'
              }`}
            >
              {dream.isPublic ? '공개' : '비공개'}
            </span>
          </div>
        </div>
      </div>

      <div className="prose max-w-none text-base-content mt-4">
        <p className="whitespace-pre-wrap">{dream.content}</p>
      </div>

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
          <button
            onClick={handleDelete}
            className="btn btn-error btn-sm"
            disabled={dream.isDeleted}
          >
            삭제
          </button>
        </div>
      )}

      <CommentForm dreamId={dreamId} onSuccess={fetchDream} />
      <CommentList dreamId={dreamId} />
    </div>
  );
}
