import { useEffect, useState } from 'react';
import { getPublicDreams } from '../../features/dreams/api';
import type { Dream } from '../../features/dreams/types';
import Pagination from '../../components/ui/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext'; // ✅ 로그인 상태 확인용

export default function Dreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { user } = useAuthContext(); // ✅ 로그인 여부 확인

  useEffect(() => {
    setLoading(true);
    getPublicDreams(page, 5)
      .then((res) => {
        setDreams(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      {/* 상단 헤더 + 작성 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">공개 꿈 목록</h1>
        {user && (
          <button
            className="btn btn-primary"
            onClick={() => nav('/dreams/new')}
          >
            + 꿈일기 작성
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : dreams.length === 0 ? (
        <p>등록된 꿈이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {dreams.map((dream) => (
            <li key={dream.id} className="card bg-base-100 shadow-md p-4">
              <Link
                to={`/dreams/${dream.id}`}
                className="text-xl font-semibold hover:underline"
              >
                {dream.title}
              </Link>
              <p className="text-sm text-gray-500">{dream.dreamDate}</p>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
